import * as Haptics from 'expo-haptics';
import { PropsWithChildren } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';

type AnimatedPressableProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
    haptic?: boolean;
  }
>;

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export function AnimatedPressable({ children, haptic = true, onPress, style, ...props }: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressableBase
      {...props}
      style={[style, animatedStyle]}
      onPressIn={(event) => {
        if (!reduceMotion) scale.value = withSpring(0.97, { damping: 18, stiffness: 350 });
        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (!reduceMotion) scale.value = withSpring(1, { damping: 16, stiffness: 280 });
        props.onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic && process.env.EXPO_OS === 'ios') void Haptics.selectionAsync();
        onPress?.(event);
      }}>
      {children}
    </AnimatedPressableBase>
  );
}
