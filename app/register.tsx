import { Container } from '@/components/ui/Container';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signUp(name, email, password);
    } catch (err) {
      setError('Failed to create account');
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
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError('');
            }}
            placeholder="Nome"
            placeholderTextColor="rgba(247, 236, 225, 0.5)"
          />

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

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="Senha"
            placeholderTextColor="rgba(247, 236, 225, 0.5)"
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar Senha</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            placeholder="Confirmar Senha"
            placeholderTextColor="rgba(247, 236, 225, 0.5)"
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Link href="/" style={styles.loginLink}>
            Já tem uma conta? Faça login
          </Link>

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.registerButtonPressed,
              isLoading && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#F7ECE1" />
            ) : (
              <Text style={styles.registerButtonText}>Cadastrar</Text>
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
  loginLink: {
    color: '#9747FF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  registerButton: {
    backgroundColor: '#9747FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonPressed: {
    opacity: 0.8,
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
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