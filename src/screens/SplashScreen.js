import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Colors from '../utils/colors';
import Dimensions from '../utils/dimensions';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')} // Vous devrez ajouter votre propre logo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logo: {
    width: Dimensions.width * 0.7,
    height: Dimensions.width * 0.7,
  },
});

export default SplashScreen;