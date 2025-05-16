import { Container } from '@/components/ui/Container';
import { TabBarIcon } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import * as Clipboard from 'expo-clipboard';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AccountScreen() {
  const { user, signOut, isLoading } = useAuth();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const renderField = (label: string, value: string, isMasked: boolean = false) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {isMasked ? '********' : value}
        </Text>
        <Pressable
          onPress={() => copyToClipboard(value)}
          style={({ pressed }) => [
            styles.copyButton,
            pressed && styles.copyButtonPressed
          ]}
        >
          <TabBarIcon name="content-copy" color="#9747FF" size={20} />
        </Pressable>
      </View>
    </View>
  );

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Container style={styles.content}>
        {renderField('Nome', user.name)}
        {renderField('Email', user.email)}
        {renderField('Senha', 'your-password-here', true)}
        {renderField('Organização', user.organization)}
        
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
              isLoading && styles.logoutButtonDisabled
            ]}
            onPress={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#F7ECE1" />
            ) : (
              <Text style={styles.logoutText}>Logout</Text>
            )}
          </Pressable>
          
          <Text style={styles.version}>Version 1.0</Text>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1625',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9747FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#9747FF',
    fontFamily: 'SpaceMono',
  },
  copyButton: {
    padding: 8,
    borderRadius: 8,
  },
  copyButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
  },
  footer: {
    marginTop: 'auto',
    gap: 16,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#F04438',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
  },
}); 