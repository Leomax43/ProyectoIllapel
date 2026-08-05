import { View, Text, StyleSheet } from 'react-native';
import { useId } from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { COLORES } from '../config/colores';

export default function GradienteHeader({ titulo, subtitulo, colors }) {
  const id = useId().replace(/:/g, '');
  return (
    <View style={styles.header}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={`hdr-${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#hdr-${id})`} />
      </Svg>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomWidth: 4,
    borderBottomColor: COLORES.amarillo,
    marginBottom: 24,
  },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitulo: { fontSize: 15, color: 'rgba(255,255,255,0.92)' },
});
