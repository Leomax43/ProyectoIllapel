import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function AnimacionEntrada({ children, delay = 0, style }) {
  const anim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    anim.setValue(0);
    const t = Animated.timing(anim, {
      toValue: 1,
      duration: 450,
      delay,
      useNativeDriver: true
    });
    t.start();
    return () => t.stop();
  }, [isFocused, anim, delay]);

  return (
    <Animated.View
      style={[
        {
          opacity: anim,
          alignSelf: 'stretch',
          transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] })
          }]
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
}
