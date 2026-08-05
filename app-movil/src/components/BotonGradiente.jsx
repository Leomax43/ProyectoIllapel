import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useId } from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export default function BotonGradiente({ titulo, colors, onPress, icon, cargando, disabled, style }) {
  const id = useId().replace(/:/g, '');
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || cargando}
      activeOpacity={0.85}
    >
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={`btn-${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx="14" fill={`url(#btn-${id})`} />
      </Svg>
      {cargando ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.label}>
          {icon}
          <Text style={[styles.text, icon ? { marginLeft: 8 } : null]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  label: { flexDirection: 'row', alignItems: 'center' },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
