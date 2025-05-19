import { useCallback } from 'react';
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    WithSpringConfig,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const springConfig: WithSpringConfig = {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
};

export type AnimationType = 'slide' | 'fade' | 'scale' | 'bounce';
export type Direction = 'left' | 'right' | 'up' | 'down';

interface AnimationConfig {
    type?: AnimationType;
    direction?: Direction;
    duration?: number;
    delay?: number;
}

export function useAnimation({
    type = 'fade',
    direction = 'up',
    duration = 300,
    delay = 0,
}: AnimationConfig = {}) {
    const animation = useSharedValue(0);
    const scale = useSharedValue(1);

    const animate = useCallback(() => {
        'worklet';
        animation.value = withDelay(
            delay,
            withSpring(1, springConfig)
        );
    }, [animation, delay]);

    const bounce = useCallback(() => {
        'worklet';
        scale.value = withSequence(
            withSpring(1.1, springConfig),
            withSpring(1, springConfig)
        );
    }, [scale]);

    const getInitialTranslation = () => {
        switch (direction) {
            case 'left':
                return { x: -SCREEN_WIDTH, y: 0 };
            case 'right':
                return { x: SCREEN_WIDTH, y: 0 };
            case 'up':
                return { x: 0, y: 50 };
            case 'down':
                return { x: 0, y: -50 };
            default:
                return { x: 0, y: 0 };
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        const { x, y } = getInitialTranslation();

        const transform = [];

        if (type === 'slide') {
            transform.push(
                { translateX: withSpring(x * (1 - animation.value), springConfig) },
                { translateY: withSpring(y * (1 - animation.value), springConfig) }
            );
        }

        if (type === 'scale' || type === 'bounce') {
            transform.push({ scale: scale.value });
        }

        return {
            opacity: type === 'fade' ? withTiming(animation.value, {
                duration,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }) : 1,
            transform,
        };
    });

    return {
        animatedStyle,
        animate,
        bounce,
    };
} 