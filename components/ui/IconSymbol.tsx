import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { StyleProp, TextStyle } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export function TabBarIcon({
  name,
  size = 24,
  color,
  style,
}: {
  name: MaterialIconName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={name} style={style} />;
}