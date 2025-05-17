import { View, Text, StyleSheet } from 'react-native';
import { TabNavigator } from '@/components/navigation/TabNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

function DashboardTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.text}>Dashboard</Text>
    </View>
  );
}

function ProfileTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

function SettingsTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.text}>Settings</Text>
    </View>
  );
}

const tabs = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    component: DashboardTab,
  },
  {
    key: 'profile',
    title: 'Profile',
    component: ProfileTab,
  },
  {
    key: 'settings',
    title: 'Settings',
    component: SettingsTab,
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TabNavigator tabs={tabs} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1625',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: '#F7ECE1',
    fontSize: 24,
    fontFamily: 'SpaceMono',
  },
}); 