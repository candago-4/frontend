import { Container } from '@/components/ui/Container';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, isLoading } = useAuth();

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return false;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await signUp(name, email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <Image
          source={require('../assets/images/bg.jpg')}
          style={styles.backgroundImage}
        />
        
        <Container style={styles.content}>
          <View style={styles.innerContent}>
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
                style={[styles.input, error && name === '' && styles.inputError]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                placeholder="Nome completo"
                placeholderTextColor="rgba(247, 236, 225, 0.5)"
                autoCapitalize="words"
                editable={!isLoading}
              />

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

              <Text style={styles.label}>Confirmar Senha</Text>
              <TextInput
                style={[styles.input, error && confirmPassword === '' && styles.inputError]}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                placeholder="Confirmar senha"
                placeholderTextColor="rgba(247, 236, 225, 0.5)"
                secureTextEntry
                editable={!isLoading}
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Link href="/" style={[styles.loginLink, isLoading && styles.disabledLink]}>
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
                  <Text style={styles.registerButtonText}>Criar Conta</Text>
                )}
              </Pressable>
            </View>

            <Text style={styles.version}>Version 1.0</Text>
          </View>
        </Container>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  innerContent: {
    flex: 1,
    padding: 24,
    gap: 32,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 48 : 32,
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
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    alignSelf: 'center',
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
  loginLink: {
    color: '#9747FF',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  disabledLink: {
    opacity: 0.5,
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
  version: {
    color: '#F7ECE1',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.7,
    textAlign: 'center',
  },
}); 