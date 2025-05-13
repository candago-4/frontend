// app/(tabs)/index.tsx
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DevicesScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  // Dados temporários - substituir com sua fonte real
  const devices = Array(10).fill(null).map((_, i) => ({
    id: `DEVICE-${i + 1}`,
    name: `Device ${i + 1}`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>[org_name] Devices</Text>
      
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.deviceItem, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.deviceText, { color: theme.colors.text }]}>
              {item.name} || {item.id}
            </Text>
          </View>
        )}
      />

      <Text style={[styles.version, { color: theme.colors.text }]}>Version 1.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  deviceItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  deviceText: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  version: {
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'SpaceMono',
    opacity: 0.6,
  },
});

export default DevicesScreen;