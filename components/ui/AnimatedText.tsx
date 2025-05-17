import { ReactNode } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import Animated, { 
  FadeIn,
  FadeInLeft,
  FadeInRight,
  Layout 
} from 'react-native-reanimated';

type AnimationDirection = 'left' | 'right' | 'none';

interface AnimatedTextProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  style?: TextStyle;
}

export function AnimatedText({
  children,
  direction = 'none',
  delay = 0,
  duration = 1000,
  style,
}: AnimatedTextProps) {
  const getAnimation = () => {
    switch (direction) {
      case 'left':
        return FadeInLeft.delay(delay).duration(duration).springify();
      case 'right':
        return FadeInRight.delay(delay).duration(duration).springify();
      default:
        return FadeIn.delay(delay).duration(duration);
    }
  };

  return (
    <Animated.Text 
      entering={getAnimation()}
      layout={Layout.springify()}
      style={[styles.text, style]}
    >
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
}); 