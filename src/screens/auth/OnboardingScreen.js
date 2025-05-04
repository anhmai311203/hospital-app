import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/colors';
import Dimensions from '../../utils/dimensions';
import Button from '../../components/Button';
import ICONS from '../../constants/icons';

const onboardingData = [
  {
    id: '1',
    title: 'Trouvez les meilleurs docteurs',
    description: 'Accédez aux meilleurs médecins spécialistes près de chez vous',
    image: require('../../../assets/images/onboarding1.png'), // Vous devrez ajouter vos propres images
  },
  {
    id: '2',
    title: 'Prenez rendez-vous facilement',
    description: 'Réservez facilement des rendez-vous avec vos médecins préférés',
    image: require('../../../assets/images/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Gérez vos rendez-vous',
    description: 'Suivez et gérez tous vos rendez-vous médicaux en un seul endroit',
    image: require('../../../assets/images/onboarding3.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / Dimensions.width
          );
          setCurrentIndex(index);
        }}
      />
      
      {renderPagination()}
      
      <View style={styles.footer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? "Commencer" : "Suivant"}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: Dimensions.padding,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  slideContainer: {
    width: Dimensions.width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Dimensions.padding * 2,
  },
  image: {
    width: Dimensions.width * 0.8,
    height: Dimensions.height * 0.4,
    marginBottom: Dimensions.margin * 2,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Dimensions.margin,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.margin * 2,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  footer: {
    paddingHorizontal: Dimensions.padding * 2,
    paddingBottom: Dimensions.padding * 2,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;