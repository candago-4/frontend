import { StyleSheet, View } from 'react-native';

interface WebMapProps {
  latitude: number;
  longitude: number;
}

export function WebMap({ latitude, longitude }: WebMapProps) {
  return (
    <View style={styles.container}>
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          borderRadius: 12,
        }}
        title="Map"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#242f3e',
  },
}); 