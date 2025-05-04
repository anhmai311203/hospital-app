// backend/routes/appointmentRoutes.js
const express = require('express');
const AppointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', AppointmentController.createAppointment);
router.get('/', AppointmentController.getUserAppointments);
router.get('/timeslots', AppointmentController.getAvailableTimeSlots);
router.get('/:id', AppointmentController.getAppointmentById);
router.put('/:id/cancel', AppointmentController.cancelAppointment);

module.exports = router;