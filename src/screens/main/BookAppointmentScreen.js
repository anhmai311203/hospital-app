import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../utils/colors';
import { dimensions } from '../../utils/dimensions';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM'
];

const BookAppointmentScreen = ({ route, navigation }) => {
  const { doctor_id, isRescheduling, appointment_id } = route.params || {};
  const { user } = useContext(AuthContext);
  
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
    if (isRescheduling && appointment_id) {
      fetchAppointmentDetails();
    }
  }, []);

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchDoctorDetails = async () => {
    try {
      // In a real app, replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/doctors/${doctor_id}`);
      setDoctor(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load doctor details');
    }
  };

  const fetchAppointmentDetails = async () => {
    try {
      // In a real app, replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/appointments/${appointment_id}`);
      const appointment = response.data;
      
      // Set the selected date and time from the appointment
      setSelectedDate(new Date(appointment.date));
      setSelectedTime(appointment.time);
      setNotes(appointment.notes || '');
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      Alert.alert('Error', 'Failed to load appointment details');
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      // Format the date to YYYY-MM-DD for API
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // In a real app, replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:3000/doctors/${doctor_id}/available-slots?date=${formattedDate}`
      );
      
      // For demo, we'll just filter some random slots
      const bookedSlots = response.data || [];
      setAvailableSlots(timeSlots.filter(slot => !bookedSlots.includes(slot)));
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // For demo, we'll show all slots as available
      setAvailableSlots(timeSlots);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    setSubmitting(true);
    
    try {
      const appointmentData = {
        user_id: user.id,
        doctor_id: doctor_id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        notes: notes,
        status: 'pending'
      };

      if (isRescheduling) {
        // Update existing appointment
        await axios.put(`http://localhost:3000/appointments/${appointment_id}`, appointmentData);
        Alert.alert('Success', 'Appointment rescheduled successfully');
      } else {
        // Create new appointment
        await axios.post('http://localhost:3000/appointments', appointmentData);
        Alert.alert('Success', 'Appointment booked successfully');
      }

      navigation.navigate('PaymentScreen', { 
        doctor: doctor,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDatePicker = () => {
    const dates = [];
    const today = new Date();
    
    // Generate dates for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePickerContainer}
      >
        {dates.map((date, index) => {
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateNum = date.getDate();
          const isSelected = 
            date.getDate() === selectedDate.getDate() && 
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateItem, isSelected && styles.selectedDateItem]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDateText]}>
                {day}
              </Text>
              <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                {dateNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderTimeSlots = () => {
    return (
      <View style={styles.timeSlotsContainer}>
        {availableSlots.map((time, index) => {
          const isSelected = selectedTime === time;
          
          return (
            <TouchableOpacity
              key={index}
              style={[styles.timeSlot, isSelected && styles.selectedTimeSlot]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
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
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.doctorInfo}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorInitials}>
              {doctor?.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>Dr. {doctor?.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor?.specialty}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textGray} />
              <Text style={styles.locationText}>{doctor?.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          {renderDatePicker()}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          {availableSlots.length > 0 ? (
            renderTimeSlots()
          ) : (
            <View style={styles.noSlotsContainer}>
              <Text style={styles.noSlotsText}>No available slots for this date</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any notes for your appointment"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookAppointment}
            disabled={submitting || !selectedTime}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.bookButtonText}>
                {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  doctorInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: colors.textGray,
    marginLeft: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  datePickerContainer: {
    paddingBottom: 10,
  },
  dateItem: {
    width: 65,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDateText: {
    color: colors.white,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 12,
    marginRight: '5%',
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 12,
    marginRight: '5%',
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 12,
    marginRight: '5%',
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    marginBottom: 12,
    marginRight: '5%',
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTimeText: {
    color: colors.white,
  },
  notesInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bookButton: {
    backgroundColor: colors.primary,
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
  noSlotsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noSlotsText: {
    color: colors.textGray,
    fontSize: 14,
  }
});

export default BookAppointmentScreen;