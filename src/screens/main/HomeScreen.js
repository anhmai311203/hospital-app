import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [specialties, setSpecialties] = useState(['Dermatology', 'Cardiology', 'Neurology', 'Pediatrics', 'Ophthalmology']);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Dermatology');

  useEffect(() => {
    fetchUserData();
    fetchDoctors();
  }, []);

  const fetchUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Replace with your API endpoint
      const response = await axios.get('http://localhost:3000/doctors');
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
      // For demo purposes, set mock data
      setDoctors([
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialty: 'Dermatology',
          location: 'New York Medical Center',
          rating: 4.8,
          image: 'https://placekitten.com/100/100'
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          specialty: 'Dermatology',
          location: 'Boston Health Clinic',
          rating: 4.5,
          image: 'https://placekitten.com/101/101'
        },
        {
          id: 3,
          name: 'Dr. Emily Williams',
          specialty: 'Dermatology',
          location: 'Chicago Medical Institute',
          rating: 4.9,
          image: 'https://placekitten.com/102/102'
        }
      ]);
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.specialty === selectedSpecialty &&
    (doctor.name.toLowerCase().includes(searchText.toLowerCase()) || 
     doctor.location.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetailScreen', { doctor });
  };

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.doctorCard}
      onPress={() => handleDoctorPress(item)}
    >
      <View style={styles.doctorImageContainer}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
          style={styles.doctorImage}
        />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <Text style={styles.doctorLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#1A73E8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello 👋</Text>
          <Text style={styles.userName}>{userName || 'Guest'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <View style={styles.profileIcon}>
            <FontAwesome name="user" size={24} color="#1A73E8" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctor, specialty..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {specialties.map(specialty => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.categoryItem,
              selectedSpecialty === specialty && styles.selectedCategory
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={[
              styles.categoryText,
              selectedSpecialty === specialty && styles.selectedCategoryText
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.topDoctorsHeader}>
        <Text style={styles.topDoctorsTitle}>Top Doctors</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorsScreen')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A73E8" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.doctorsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No doctors found</Text>
          }
        />
      )}

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#1A73E8" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('AppointmentsScreen')}
        >
          <Ionicons name="calendar-outline" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('FeedbackScreen')}
        >
          <MaterialIcons name="feedback" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <FontAwesome name="user-o" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategory: {
    backgroundColor: '#1A73E8',
    borderColor: '#1A73E8',
  },
  categoryText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  topDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  topDoctorsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '600',
  },
  doctorsList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#1A73E8',
    marginBottom: 4,
  },
  doctorLocation: {
    fontSize: 14,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
    marginLeft: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  activeNavText: {
    color: '#1A73E8',
    fontWeight: '600',
  },
});

export default HomeScreen;