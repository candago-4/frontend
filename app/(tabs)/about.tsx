import { Container } from '@/components/ui/Container';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View, ScrollView, Image, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Container style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <AnimatedText delay={200} style={StyleSheet.flatten([styles.title, { color: colors.text }])}>
              Sobre o Projeto
            </AnimatedText>
            <AnimatedText delay={400} style={StyleSheet.flatten([styles.subtitle, { color: colors.text }])}>
              LynchArea - Sistema de Monitoramento de Boias
            </AnimatedText>
          </View>

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Image
              source={require('../../assets/images/Globe.png')}
              style={styles.logo}
            />
            <AnimatedText delay={600} style={StyleSheet.flatten([styles.logoText, { color: colors.text }])}>
              <Text style={styles.purpleText}>Ly</Text>nch{'\n'}Area
            </AnimatedText>
          </View>

          {/* Canda.go Section */}
          <AnimatedText delay={800} style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Grupo Canda.go
          </AnimatedText>
          
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <AnimatedText delay={1000} style={StyleSheet.flatten([styles.cardText, { color: colors.text }])}>
              O Canda.go é um grupo de pesquisa e desenvolvimento da faculdade, 
              focado em soluções inovadoras para monitoramento e controle de sistemas 
              aquáticos. Nossa missão é desenvolver tecnologias que contribuam para 
              a preservação e gestão sustentável dos recursos hídricos.
            </AnimatedText>
          </View>

          {/* LynchArea Project Section */}
          <AnimatedText delay={1200} style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Projeto LynchArea
          </AnimatedText>
          
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <AnimatedText delay={1400} style={StyleSheet.flatten([styles.cardText, { color: colors.text }])}>
              O LynchArea é um sistema inovador de monitoramento de boias desenvolvido 
              com Arduino. O projeto visa calcular e monitorar a posição, velocidade 
              e comportamento de boias em tempo real, fornecendo dados precisos para 
              análise ambiental e controle de qualidade da água.
            </AnimatedText>
          </View>

          {/* Features Section */}
          <AnimatedText delay={1600} style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Funcionalidades Principais
          </AnimatedText>
          
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: colors.tint }]}>📍</Text>
              <Text style={StyleSheet.flatten([styles.featureText, { color: colors.text }])}>
                Rastreamento GPS em tempo real
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: colors.tint }]}>📊</Text>
              <Text style={StyleSheet.flatten([styles.featureText, { color: colors.text }])}>
                Análise de métricas e estatísticas
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: colors.tint }]}>📱</Text>
              <Text style={StyleSheet.flatten([styles.featureText, { color: colors.text }])}>
                Interface mobile para monitoramento
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: colors.tint }]}>🔧</Text>
              <Text style={StyleSheet.flatten([styles.featureText, { color: colors.text }])}>
                Hardware Arduino customizado
              </Text>
            </View>
          </View>

          {/* Technology Stack */}
          <AnimatedText delay={1800} style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Tecnologias Utilizadas
          </AnimatedText>
          
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <View style={styles.techGrid}>
              <View style={styles.techItem}>
                <Text style={StyleSheet.flatten([styles.techTitle, { color: colors.tint }])}>Frontend</Text>
                <Text style={StyleSheet.flatten([styles.techText, { color: colors.text }])}>
                  React Native, Expo, TypeScript
                </Text>
              </View>
              
              <View style={styles.techItem}>
                <Text style={StyleSheet.flatten([styles.techTitle, { color: colors.tint }])}>Backend</Text>
                <Text style={StyleSheet.flatten([styles.techText, { color: colors.text }])}>
                  Node.js, Express, PostgreSQL
                </Text>
              </View>
              
              <View style={styles.techItem}>
                <Text style={StyleSheet.flatten([styles.techTitle, { color: colors.tint }])}>Hardware</Text>
                <Text style={StyleSheet.flatten([styles.techText, { color: colors.text }])}>
                  Arduino, GPS, Sensores
                </Text>
              </View>
              
              <View style={styles.techItem}>
                <Text style={StyleSheet.flatten([styles.techTitle, { color: colors.tint }])}>Comunicação</Text>
                <Text style={StyleSheet.flatten([styles.techText, { color: colors.text }])}>
                  MQTT, HTTP, WebSocket
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Section */}
          <AnimatedText delay={2000} style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>
            Contato
          </AnimatedText>
          
          <View style={[styles.card, { backgroundColor: colors.background }]}>
            <Pressable 
              style={styles.contactItem}
              onPress={() => handleLinkPress('mailto:canda.go@faculdade.edu.br')}
            >
              <Text style={[styles.contactIcon, { color: colors.tint }]}>📧</Text>
              <Text style={StyleSheet.flatten([styles.contactText, { color: colors.text }])}>
                canda.go@faculdade.edu.br
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.contactItem}
              onPress={() => handleLinkPress('https://github.com/canda-go')}
            >
              <Text style={[styles.contactIcon, { color: colors.tint }]}>🐙</Text>
              <Text style={StyleSheet.flatten([styles.contactText, { color: colors.text }])}>
                GitHub: canda-go
              </Text>
            </Pressable>
          </View>

          {/* Version */}
          <AnimatedText delay={2200} style={StyleSheet.flatten([styles.version, { color: colors.text }])}>
            LynchArea v1.0 - Desenvolvido pelo Grupo Canda.go
          </AnimatedText>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    opacity: 0.8,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  purpleText: {
    color: '#9747FF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 16,
    marginTop: 24,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    flex: 1,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techItem: {
    width: '48%',
    marginBottom: 16,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  techText: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    opacity: 0.8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    flex: 1,
  },
  version: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginTop: 30,
    opacity: 0.6,
  },
}); 