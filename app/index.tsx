import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import welcomeImage from '@/assets/images/welcome.png';

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const WelcomeScreen = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const openChats = () => {
    Linking.openURL('com.supersimon.whatsapp://chats')
      .catch(() => {
        alert('No se pudo abrir la aplicación. Asegúrate de que esté instalada.');
      });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: welcome_image }} style={styles.welcome} />
      <Text style={styles.headline}>¡Bienvenido a HablemosYA!</Text>
      <Text style={styles.description}>
        Lee nuestra{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://galaxies.dev')}>
          Política de Privacidad
        </Text>
        . {'Presiona "Aceptar y Continuar" para aceptar los '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://galaxies.dev')}>
          Términos de Servicio
        </Text>
        .
      </Text>
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <TouchableOpacity
          onPress={openChats}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Aceptar y Continuar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  welcome: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
  },
  headline: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#555',
  },
  link: {
    color: '#FF8C42',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF8C42',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;