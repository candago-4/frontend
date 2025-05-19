import { fireEvent, render } from '@testing-library/react-native';
import { Platform } from 'react-native';
import MapScreen from '../app/(tabs)/map';

// Mock the required dependencies
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: () => 'dark'
}));

jest.mock('@/components/WebMap', () => {
  const { View } = require('react-native');
  return {
    WebMap: ({ latitude, longitude }: { latitude: number; longitude: number }) => (
      <View 
        testID="web-map" 
        accessibilityValue={{ 
          text: `${latitude},${longitude}` 
        }} 
      />
    ),
  };
});

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  const MockMapView = (props: any) => {
    return <View testID="mock-map-view" {...props} />;
  };
  const MockMarker = (props: any) => {
    return <View testID="mock-marker" {...props} />;
  };
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    PROVIDER_GOOGLE: 'google',
  };
});

describe('MapScreen', () => {
  describe('Common functionality', () => {
    it('renders correctly with title and dropdown', () => {
      const { getByText } = render(<MapScreen />);
      
      // Check if title is rendered
      expect(getByText('[org_name] Mapa')).toBeTruthy();
      
      // Check if dropdown is rendered
      expect(getByText('[Device_name || Id]')).toBeTruthy();
    });

    it('opens dropdown when pressed', () => {
      const { getByText, queryByText } = render(<MapScreen />);
      
      // Initially, dropdown items should not be visible
      expect(queryByText('Device 1 || DEV-001')).toBeNull();
      
      // Press the dropdown
      fireEvent.press(getByText('[Device_name || Id]'));
      
      // Now dropdown items should be visible
      expect(getByText('Device 1 || DEV-001')).toBeTruthy();
      expect(getByText('Device 2 || DEV-002')).toBeTruthy();
    });

    it('selects device from dropdown', () => {
      const { getByText } = render(<MapScreen />);
      
      // Open dropdown
      fireEvent.press(getByText('[Device_name || Id]'));
      
      // Select a device
      fireEvent.press(getByText('Device 1 || DEV-001'));
      
      // Check if selected device is displayed
      expect(getByText('Device 1 || DEV-001')).toBeTruthy();
    });
  });

  describe('Platform specific rendering', () => {
    const originalPlatform = Platform.OS;

    afterEach(() => {
      Platform.OS = originalPlatform;
    });

    it('shows web map on web platform', () => {
      Platform.OS = 'web';
      const { getByTestId } = render(<MapScreen />);
      const webMap = getByTestId('web-map');
      expect(webMap).toBeTruthy();
      expect(webMap.props.accessibilityValue.text).toBe('-23.5505,-46.6333');
    });

    it('renders native map on android platform', () => {
      Platform.OS = 'android';
      const { getByTestId } = render(<MapScreen />);
      expect(getByTestId('mock-map-view')).toBeTruthy();
      expect(getByTestId('mock-marker')).toBeTruthy();
    });
  });
}); 