import { Container } from '@/components/ui/Container';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/bg.jpg')}
        style={styles.backgroundImage}
      />
      
      <Container style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/Globe.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>
            <Text style={styles.purpleText}>Ly</Text>nch{'\n'}Area
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="Email"
            placeholderTextColor="rgba(247, 236, 225, 0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="Password"
            placeholderTextColor="rgba(247, 236, 225, 0.5)"
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Link href="/register" style={styles.signupLink}>
            Cadastre-se
          </Link>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#F7ECE1" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.version}>Version 1.0</Text>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F7ECE1',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  purpleText: {
    color: '#9747FF',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  label: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginBottom: -8,
  },
  input: {
    backgroundColor: 'rgba(151, 71, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#9747FF',
    borderRadius: 8,
    padding: 12,
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  signupLink: {
    color: '#9747FF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#F7ECE1',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F04438',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    textAlign: 'center',
  },
}); 