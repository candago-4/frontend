import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimation, AnimationType, Direction } from '@/hooks/useAnimation';

interface AnimatedProps {
  children: React.ReactNode;
  type?: AnimationType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  autoPlay?: boolean;
}

export function AnimatedView({
  children,
  type = 'fade',
  direction = 'up',
  delay = 0,
  duration = 300,
  style,
  autoPlay = true,
}: AnimatedProps) {
  const { animatedStyle, animate } = useAnimation({
    type,
    direction,
    delay,
    duration,
  });

  useEffect(() => {
    if (autoPlay) {
      animate();
    }
  }, [animate, autoPlay]);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export function AnimatedPressable({
  children,
  type = 'scale',
  direction = 'up',
  delay = 0,
  duration = 300,
  style,
  autoPlay = true,
  ...props
}: AnimatedProps & { onPress?: () => void }) {
  const { animatedStyle, animate, bounce } = useAnimation({
    type,
    direction,
    delay,
    duration,
  });

  useEffect(() => {
    if (autoPlay) {
      animate();
    }
  }, [animate, autoPlay]);

  return (
    <Animated.Pressable 
      style={[style, animatedStyle]}
      onPress={() => {
        bounce();
        props.onPress?.();
      }}
      {...props}
    >
      {children}
    </Animated.Pressable>
  );
}

export function AnimatedText({
  children,
  type = 'fade',
  direction = 'up',
  delay = 0,
  duration = 300,
  style,
  autoPlay = true,
}: AnimatedProps) {
  const { animatedStyle, animate } = useAnimation({
    type,
    direction,
    delay,
    duration,
  });

  useEffect(() => {
    if (autoPlay) {
      animate();
    }
  }, [animate, autoPlay]);

  return (
    <Animated.Text style={[style, animatedStyle]}>
      {children}
    </Animated.Text>
  );
} 