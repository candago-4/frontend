import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    WithSpringConfig,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const springConfig: WithSpringConfig = {
    damping: 20,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
};

export type Direction = 'left' | 'right';

interface AnimatedNavigationConfig {
    onNavigate: (direction: Direction) => void;
    direction: Direction;
    activeIndex: number;
}

export function useAnimatedNavigation({
    onNavigate,
    direction,
    activeIndex,
}: AnimatedNavigationConfig) {
    const translateX = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd((event) => {
            const velocity = event.velocityX;
            const offset = event.translationX;

            if (Math.abs(velocity) > 500 || Math.abs(offset) > SCREEN_WIDTH * 0.4) {
                if (velocity > 0 || offset > 0) {
                    onNavigate('right');
                } else {
                    onNavigate('left');
                }
            }

            translateX.value = withSpring(0, springConfig);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
            ],
        };
    });

    return {
        gesture,
        animatedStyle,
    };
} 