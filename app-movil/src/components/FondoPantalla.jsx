import { View, StyleSheet } from 'react-native';
import { useId } from 'react';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { COLORES } from '../config/colores';

export default function FondoPantalla({ children, color = COLORES.celeste }) {
  const id = useId().replace(/:/g, '');
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id={`glow-${id}`} cx="50%" cy="0" r="100%">
            <Stop offset="0" stopColor={color} stopOpacity="0.26" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#glow-${id})`} />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});
