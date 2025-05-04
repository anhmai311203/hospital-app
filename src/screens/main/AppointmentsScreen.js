import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../utils/colors';
import { dimensions } from '../../utils/dimensions';

const AppointmentsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
    
    // Add listener for when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // In a real app, replace with your actual API endpoint
      const response = await axios.get(`http://localhost:3000/user/${user.id}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
      // In a real app, you'd want to handle this error more gracefully
    }
  };

  const getFilteredAppointments = () => {
    if (activeTab === 'upcoming') {
      return appointments.filter(app => app.status === 'pending');
    } else if (activeTab === 'completed') {
      return appointments.filter(app => app.status === 'completed');
    } else {
      return appointments.filter(app => app.status === 'cancelled');
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    return (
      <TouchableOpacity 
        style={styles.appointmentCard}
        onPress={() => navigation.navigate('DoctorDetailScreen', { doctor_id: item.doctor_id })}
      >
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>Dr. {item.doctor_name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: 
            item.status === 'pending' ? colors.primary + '20' : 
            item.status === 'completed' ? colors.success + '20' : 
            colors.danger + '20' 
          }]}>
            <Text style={[styles.statusText, { color: 
              item.status === 'pending' ? colors.primary : 
              item.status === 'completed' ? colors.success : 
              colors.danger 
            }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textGray} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textGray} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={colors.textGray} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => navigation.navigate('BookAppointmentScreen', { 
                appointment_id: item.id, 
                doctor_id: item.doctor_id,
                isRescheduling: true 
              })}
            >
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => cancelAppointment(item.id)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const cancelAppointment = async (id) => {
    try {
      // In a real app, replace with your actual API endpoint
      await axios.put(`http://localhost:3000/appointments/${id}`, {
        status: 'cancelled'
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : getFilteredAppointments().length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={colors.lightGray} />
          <Text style={styles.emptyText}>No {activeTab} appointments</Text>
          {activeTab === 'upcoming' && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('DoctorsScreen')}
            >
              <Text style={styles.bookButtonText}>Book an Appointment</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={getFilteredAppointments()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAppointmentItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textGray,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textGray,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: colors.primary + '10',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: colors.danger + '10',
    marginLeft: 8,
  },
  rescheduleText: {
    color: colors.primary,
    fontWeight: '500',
  },
  cancelText: {
    color: colors.danger,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textGray,
    marginTop: 12,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AppointmentsScreen;