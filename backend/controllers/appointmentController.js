// backend/controllers/appointmentController.js
const AppointmentModel = require('../models/appointmentModel');
const DoctorModel = require('../models/doctorModel');

class AppointmentController {
  // Create a new appointment
  async createAppointment(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { doctor_id, date, time, notes } = req.body;
      
      // Validate input
      if (!doctor_id || !date || !time) {
        return res.status(400).json({ message: 'Doctor, date, and time are required' });
      }
      
      // Check if doctor exists
      const doctor = await DoctorModel.getDoctorById(doctor_id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      // Check if time slot is available
      const isAvailable = await AppointmentModel.isTimeSlotAvailable(doctor_id, date, time);
      if (!isAvailable) {
        return res.status(409).json({ message: 'This time slot is already booked' });
      }
      
      // Create appointment
      const appointmentId = await AppointmentModel.createAppointment({
        user_id: userId,
        doctor_id,
        date,
        time,
        notes: notes || ''
      });
      
      // Get the created appointment with doctor details
      const appointment = await AppointmentModel.getAppointmentById(appointmentId);
      
      res.status(201).json({
        message: 'Appointment created successfully',
        appointment
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ message: 'Server error while creating appointment' });
    }
  }

  // Get user's appointments
  async getUserAppointments(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      
      const appointments = await AppointmentModel.getAppointmentsByUserId(userId);
      res.status(200).json({ appointments });
    } catch (error) {
      console.error('Get user appointments error:', error);
      res.status(500).json({ message: 'Server error while fetching appointments' });
    }
  }

  // Get appointment by ID
  async getAppointmentById(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { id } = req.params;
      
      const appointment = await AppointmentModel.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure the appointment belongs to the user
      if (appointment.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.status(200).json({ appointment });
    } catch (error) {
      console.error('Get appointment by ID error:', error);
      res.status(500).json({ message: 'Server error while fetching appointment' });
    }
  }

  // Cancel appointment
  async cancelAppointment(req, res) {
    try {
      const userId = req.user.id; // Set by auth middleware
      const { id } = req.params;
      
      // Get appointment
      const appointment = await AppointmentModel.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure the appointment belongs to the user
      if (appointment.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Check if appointment can be cancelled (not in the past)
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
      
      if (appointmentDate < now) {
        return res.status(400).json({ message: 'Cannot cancel past appointments' });
      }
      
      // Cancel appointment
      const success = await AppointmentModel.cancelAppointment(id);
      
      if (success) {
        res.status(200).json({ message: 'Appointment cancelled successfully' });
      } else {
        res.status(400).json({ message: 'Failed to cancel appointment' });
      }
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ message: 'Server error while cancelling appointment' });
    }
  }

  // Get available time slots
  async getAvailableTimeSlots(req, res) {
    try {
      const { doctor_id, date } = req.query;
      
      // Validate input
      if (!doctor_id || !date) {
        return res.status(400).json({ message: 'Doctor and date are required' });
      }
      
      // Check if doctor exists
      const doctor = await DoctorModel.getDoctorById(doctor_id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      const availableTimeSlots = await AppointmentModel.getAvailableTimeSlots(doctor_id, date);
      res.status(200).json({ availableTimeSlots });
    } catch (error) {
      console.error('Get available time slots error:', error);
      res.status(500).json({ message: 'Server error while fetching available time slots' });
    }
  }
}

module.exports = new AppointmentController();