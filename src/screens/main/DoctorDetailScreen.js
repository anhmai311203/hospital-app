import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../utils/colors';
import { dimensions } from '../../utils/dimensions';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctor_id } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  const fetchDoctorDetails = async () => {
    try {
      // In a real app, replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/doctors/${doctor_id}`);
      setDoctor(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#FFD700" style={{ marginRight: 2 }} />
        );
      }
    }
    
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.doctorProfileContainer}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorInitials}>
              {doctor?.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>

          <Text style={styles.doctorName}>Dr. {doctor?.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor?.specialty}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {renderStars(doctor?.rating || 0)}
            </View>
            <Text style={styles.ratingText}>{doctor?.rating?.toFixed(1) || "0.0"}</Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={colors.textGray} />
            <Text style={styles.locationText}>{doctor?.location}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="medal-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Experience</Text>
              <Text style={styles.infoValue}>10+ Years</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="school-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Education</Text>
              <Text style={styles.infoValue}>MD, University Hospital</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Patients</Text>
              <Text style={styles.infoValue}>1000+</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.aboutText}>
            Dr. {doctor?.name} is a highly skilled and experienced {doctor?.specialty} specialist. 
            With over 10 years of experience, they have helped thousands of patients recover and
            lead healthier lives. Dr. {doctor?.name} completed their medical education at University
            Hospital and specializes in diagnosing and treating various conditions.
          </Text>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.serviceText}>General Consultation</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.serviceText}>Specialized Treatment</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.serviceText}>Medical Advice</Text>
            </View>
            <View style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.serviceText}>Follow-up Care</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookAppointmentScreen', { doctor_id: doctor_id })}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 200,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorProfileContainer: {
    alignItems: 'center',
    marginTop: -60,
  },
  doctorAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  doctorInitials: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textGray,
    marginLeft: 4,
  },
  infoSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoContent: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  aboutSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textGray,
  },
  servicesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  servicesList: {
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
  },
  bookButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorDetailScreen;