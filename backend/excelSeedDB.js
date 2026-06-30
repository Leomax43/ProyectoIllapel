// migrar_a_bd.js
// Migra los datos limpios del Excel (familias_limpio.csv, integrantes_limpio.csv,
// asignaciones_limpio.csv) hacia la base de datos Postgres existente.
//
// Requiere: csv-parse  ->  npm install csv-parse
// Requiere que los 3 CSV esten en la misma carpeta que este script.
//
// Decisiones tomadas (segun lo conversado):
// - Las 6 "Asistente Social" encontradas en el Excel se crean como nuevos admin
//   con rol ASISTENTE_SOCIAL, RUT placeholder (deben corregirse despues), clave '1234'.
// - Se crea un admin generico "Jefatura (Migracion)" para llenar id_jefatura,
//   ya que el Excel no trae ese dato. Reemplazar despues si se requiere.
// - Todas las cargas migradas quedan con estado 'APROBADO'.
// - fecha_aprobacion = Marca temporal original de la fila en Asignaciones_familia.
// - dias_validez = 7 (valor por defecto, el Excel no lo registraba) y
//   fecha_expiracion = fecha_aprobacion + dias_validez.
// - RUTs irrecuperables quedaron como 'SIN-RUT' en los CSV: se insertan igual,
//   tal cual se acordo, para no perder el registro.

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const bcrypt = require('bcrypt');
const pool = require('./config/db');

const ASISTENTES_SOCIALES = [
    'Cinthia Fredes Villalobos',
    'Consuelo Flores Pereira',
    'Esley Alvarez Valencia',
    'Mariela Olivares Plaza',
    'Nicol Briceño Fajardo',
    'Rosa Jorquera Arancibia',
];

const DIAS_VALIDEZ_DEFECTO = 7;

function leerCsv(nombreArchivo) {
    const ruta = path.join(__dirname, nombreArchivo);
    const contenido = fs.readFileSync(ruta, 'utf8');
    return parse(contenido, { columns: true, skip_empty_lines: true });
}

function nulo(v) {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s === '' || s.toLowerCase() === 'nan' ? null : s;
}

function montoNumero(v) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
}

const migrar = async () => {
    const client = await pool.connect();
    try {
        console.log('--- Iniciando migracion de datos del Excel Illapel ---');

        const familiasCsv = leerCsv('familias_limpio.csv');
        const integrantesCsv = leerCsv('integrantes_limpio.csv');
        const asignacionesCsv = leerCsv('asignaciones_limpio.csv');

        console.log(`Leidos: ${familiasCsv.length} familias, ${integrantesCsv.length} integrantes, ${asignacionesCsv.length} asignaciones`);

        await client.query('BEGIN');

        // 1) Crear admins: asistentes sociales + jefatura generica para id_jefatura
        const claveHasheada = await bcrypt.hash('1234', 10);
        const idAsistentePorNombre = {};

        let contadorRut = 1;
        for (const nombre of ASISTENTES_SOCIALES) {
            const rutPlaceholder = `MIG-AS-${String(contadorRut).padStart(4, '0')}`;
            contadorRut += 1;
            const res = await client.query(
                `INSERT INTO admin (rut, nombre_completo, rol, clave, estado)
                 VALUES ($1, $2, 'ASISTENTE_SOCIAL', $3, 'ACTIVO')
                 RETURNING id_admin`,
                [rutPlaceholder, nombre, claveHasheada]
            );
            idAsistentePorNombre[nombre] = res.rows[0].id_admin;
        }
        console.log(`Creados ${Object.keys(idAsistentePorNombre).length} admins ASISTENTE_SOCIAL`);

        const resJefatura = await client.query(
            `INSERT INTO admin (rut, nombre_completo, rol, clave, estado)
             VALUES ('MIG-JEF-0001', 'Jefatura (Migracion)', 'JEFATURA', $1, 'ACTIVO')
             RETURNING id_admin`,
            [claveHasheada]
        );
        const idJefaturaGenerica = resJefatura.rows[0].id_admin;
        console.log(`Creada jefatura generica con id_admin=${idJefaturaGenerica} (reemplazar a mano si se requiere)`);

        // 2) Insertar familias, guardando folio -> id_familia
        const idFamiliaPorFolio = {};
        for (const fila of familiasCsv) {
            const claveAcceso = await bcrypt.hash('1234', 10); // clave por defecto, deben cambiarla luego
            const res = await client.query(
                `INSERT INTO familias
                    (folio_historico, rut_representante, nombre_representante, direccion, sector_localidad,
                     telefono, clave_acceso, saldo, estado, observaciones, fecha_registro)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 'ACTIVO', $8, $9::timestamp)
                 RETURNING id_familia`,
                [
                    parseInt(fila.folio, 10),
                    nulo(fila.rut_representante) || 'SIN-RUT',
                    nulo(fila.nombre_representante) || 'SIN NOMBRE',
                    nulo(fila.direccion),
                    nulo(fila.sector_localidad),
                    nulo(fila.telefono),
                    claveAcceso,
                    nulo(fila.observaciones),
                    nulo(fila.fecha_registro_original) || new Date().toISOString(),
                ]
            );
            idFamiliaPorFolio[fila.folio] = res.rows[0].id_familia;
        }
        console.log(`Insertadas ${Object.keys(idFamiliaPorFolio).length} familias`);

        // 3) Insertar integrantes
        let integrantesInsertados = 0;
        for (const fila of integrantesCsv) {
            const idFamilia = idFamiliaPorFolio[fila.folio];
            if (!idFamilia) continue; // por seguridad, no deberia pasar tras la limpieza
            await client.query(
                `INSERT INTO integrantes
                    (id_familia, nombre_completo, rut, parentesco, sexo, fecha_nacimiento, correo_electronico, telefono, tiene_discapacidad, observaciones)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, $9)`,
                [
                    idFamilia,
                    nulo(fila.nombre_completo) || 'SIN NOMBRE',
                    nulo(fila.rut) || 'SIN-RUT',
                    nulo(fila.parentesco),
                    nulo(fila.sexo),
                    nulo(fila.fecha_nacimiento),
                    nulo(fila.correo),
                    nulo(fila.telefono),
                    nulo(fila.observaciones),
                ]
            );
            integrantesInsertados += 1;
        }
        console.log(`Insertados ${integrantesInsertados} integrantes`);

        // 4) Insertar cargas de fondos (asignaciones), todas como APROBADO
        let cargasInsertadas = 0;
        for (const fila of asignacionesCsv) {
            const idFamilia = idFamiliaPorFolio[fila.folio];
            if (!idFamilia) continue;

            const idAsistente = idAsistentePorNombre[nulo(fila.asistente_social_nombre)] || idJefaturaGenerica;
            const motivo = nulo(fila.ayuda_social) || 'Ayuda social';
            const detalles = [nulo(fila.sub_area), nulo(fila.observaciones)].filter(Boolean).join(' - ');
            const fechaAprobacion = nulo(fila.fecha_registro) || new Date().toISOString();

            await client.query(
                `INSERT INTO cargas_fondos
                    (id_familia, rut_beneficiario, id_admin, id_jefatura, monto, motivo, detalles, estado, dias_validez, fecha_solicitud, fecha_aprobacion, fecha_expiracion)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'APROBADO', $8::int, $9::timestamp, $9::timestamp, $9::timestamp + ($8::text || ' days')::interval)`,
                [
                    idFamilia,
                    nulo(fila.rut_beneficiario) || 'SIN-RUT',
                    idAsistente,
                    idJefaturaGenerica,
                    montoNumero(fila.monto),
                    motivo,
                    detalles || null,
                    DIAS_VALIDEZ_DEFECTO,
                    fechaAprobacion,
                ]
            );
            cargasInsertadas += 1;
        }
        console.log(`Insertadas ${cargasInsertadas} cargas de fondos`);

        await client.query('COMMIT');
        console.log('--- Migracion completada con exito ---');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error durante la migracion, se hizo ROLLBACK:', error);
    } finally {
        client.release();
        pool.end();
    }
};

migrar();