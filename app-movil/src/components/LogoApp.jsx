import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop, ClipPath, G } from 'react-native-svg';

export default function LogoApp({ size = 180 }) {
  // 1. Valores para la caída inicial
  const animCaidaAmarilla = useRef(new Animated.Value(-200)).current;
  const animCaidaCeleste = useRef(new Animated.Value(-200)).current;
  const animCaidaVerde = useRef(new Animated.Value(-200)).current;
  const animCaidaBlanca = useRef(new Animated.Value(-200)).current;

  // 2. Valores para la respiración (flotación continua)
  const floatAmarilla = useRef(new Animated.Value(0)).current;
  const floatCeleste = useRef(new Animated.Value(0)).current;
  const floatVerde = useRef(new Animated.Value(0)).current;
  const floatBlanca = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const crearCaida = (animValue) =>
      Animated.spring(animValue, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      });

    // Respiración continua fluida (sin tirones)
    const iniciarRespiracion = (floatValue, delay = 0) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            // Sube suavemente a -4px
            Animated.timing(floatValue, {
              toValue: -4,
              duration: 1600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            // Baja suavemente a 4px
            Animated.timing(floatValue, {
              toValue: 4,
              duration: 1600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            // Regresa al centro (0px) para enlazar el loop perfecto
            Animated.timing(floatValue, {
              toValue: 0,
              duration: 1600,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);
    };

    // Primero cae en cascada y luego inicia la respiración sin pausas intermedias
    Animated.stagger(120, [
      crearCaida(animCaidaAmarilla),
      crearCaida(animCaidaCeleste),
      crearCaida(animCaidaVerde),
      crearCaida(animCaidaBlanca),
    ]).start(() => {
      iniciarRespiracion(floatAmarilla, 0);
      iniciarRespiracion(floatCeleste, 180);
      iniciarRespiracion(floatVerde, 360);
      iniciarRespiracion(floatBlanca, 540);
    });
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Fondo Azul Fijo */}
      <Svg width={size} height={size} viewBox="0 0 300 300" style={StyleSheet.absoluteFill}>
        <Rect x="10" y="10" width="280" height="280" rx="70" ry="70" fill="#005076" />
      </Svg>

      {/* Tarjeta 1: Amarilla (Atrás) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: Animated.add(animCaidaAmarilla, floatAmarilla) }
            ]
          }
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 300 300">
          <G transform="translate(137, 153) rotate(-43)">
            <Rect x="-84" y="-55" width="168" height="106" rx="10" fill="#00283d" opacity="0.4" y={-48} />
            <Rect x="-84" y="-70" width="168" height="106" rx="10" fill="#FCBE00" />
          </G>
        </Svg>
      </Animated.View>

      {/* Tarjeta 2: Celeste (Medio) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: Animated.add(animCaidaCeleste, floatCeleste) }
            ]
          }
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 300 300">
          <G transform="translate(142, 153) rotate(-30)">
            <Rect x="-84" y="-55" width="168" height="106" rx="10" fill="#00283d" opacity="0.4" y={-48} />
            <Rect x="-84" y="-55" width="168" height="106" rx="10" fill="#3DBFEA" />
          </G>
        </Svg>
      </Animated.View>

      {/* Tarjeta 3: Verde (Frente Color) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: Animated.add(animCaidaVerde, floatVerde) }
            ]
          }
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 300 300">
          <G transform="translate(147, 153) rotate(-16)">
            <Rect x="-84" y="-55" width="168" height="106" rx="10" fill="#00283d" opacity="0.4" y={-48} />
            <Rect x="-84" y="-55" width="168" height="106" rx="10" fill="#10AE8C" />
          </G>
        </Svg>
      </Animated.View>

      {/* Tarjeta 4: Principal Blanca */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [
              { translateY: Animated.add(animCaidaBlanca, floatBlanca) }
            ]
          }
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 300 300">
          <Defs>
            <LinearGradient id="gradTarjeta" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#E6E6E6" />
            </LinearGradient>
            <ClipPath id="clipTarjetaFrontal">
              <Rect x="0" y="0" width="170" height="106" rx="10" ry="10" />
            </ClipPath>
          </Defs>

          <G transform="translate(84, 130)">
            {/* Sombra */}
            <Rect x="6" y="6" width="170" height="106" rx="10" fill="#00283d" opacity="0.4" />

            {/* Base y Banda gris */}
            <G clipPath="url(#clipTarjetaFrontal)">
              <Rect x="0" y="0" width="170" height="106" fill="url(#gradTarjeta)" />
              <Rect x="0" y="10" width="170" height="15" fill="#E0E0E0" />
            </G>

            {/* Sol Amarillo */}
            <Circle cx="30" cy="44" r="14" fill="#FCBE00" />

            {/* Líneas simuladas */}
            <Rect x="80" y="33" width="82" height="5" rx="2.5" fill="#D1D1D1" />
            <Rect x="95" y="43" width="66" height="5" rx="2.5" fill="#D1D1D1" />

            {/* Olas Verde y Celeste */}
            <Path
              d="M 104 68 Q 126 52, 150 66"
              fill="none"
              stroke="#10AE8C"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <Path
              d="M 14 84 Q 65 68, 120 84 Q 138 88, 150 78"
              fill="none"
              stroke="#3DBFEA"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}