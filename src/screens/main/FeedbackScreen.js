import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    try {
      if (feedback.trim() === '') {
        Alert.alert('Error', 'Please enter your feedback');
        return;
      }

      // Get user ID from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'You need to be logged in to submit feedback');
        navigation.navigate('LoginScreen');
        return;
      }

      // Submit feedback to backend
      const response = await axios.post('http://localhost:3000/feedback', {
        user_id: parseInt(userId),
        content: feedback,
        rating: rating
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Thank you for your feedback!');
        setFeedback('');
        setRating(0);
        navigation.navigate('HomeScreen');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <AntDesign
            name={i <= rating ? 'star' : 'staro'}
            size={30}
            color={i <= rating ? '#FFD700' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How was your experience?</Text>
        
        <Text style={styles.subtitle}>Rate your experience</Text>
        <View style={styles.ratingContainer}>
          {renderStars()}
        </View>

        <Text style={styles.subtitle}>Share your thoughts</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us what you think about our service..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  star: {
    marginRight: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 24,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1A73E8',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FeedbackScreen;