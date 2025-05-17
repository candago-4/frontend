import { Container } from '@/components/ui/Container';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao fazer login. Por favor, tente novamente.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
              style={[styles.input, error && email === '' && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Email"
              placeholderTextColor="rgba(247, 236, 225, 0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={[styles.input, error && password === '' && styles.inputError]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Senha"
              placeholderTextColor="rgba(247, 236, 225, 0.5)"
              secureTextEntry
              editable={!isLoading}
            />

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Link href="/register" style={[styles.signupLink, isLoading && styles.disabledLink]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1625',
  },
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
  inputError: {
    borderColor: '#F04438',
  },
  errorContainer: {
    backgroundColor: 'rgba(240, 68, 56, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: -8,
  },
  errorText: {
    color: '#F04438',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  signupLink: {
    color: '#9747FF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  disabledLink: {
    opacity: 0.5,
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
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    textAlign: 'center',
  },
}); 