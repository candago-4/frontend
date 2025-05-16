/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewinwd.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a72ea4';
const tintColorDark = '#725AC1';

export const Colors = {
    light: {
        text: '#F7ECE1',
        background: '#fff',
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#F7ECE1',
        background: '#151718',
        tint: tintColorDark,
        icon: '#725AC1',
        tabIconDefault: '#242038',
        tabIconSelected: tintColorDark,
    },
};
