const db = require('../config/db');

class Doctor {
  static async findAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctors', (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctors WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  static async findBySpecialty(specialty) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctors WHERE specialty = ?', [specialty], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findByLocation(location) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctors WHERE location = ?', [location], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async findTopRated(limit = 5) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM doctors ORDER BY rating DESC LIMIT ?', [limit], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  static async create(doctorData) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO doctors SET ?', doctorData, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId);
      });
    });
  }

  static async update(id, doctorData) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE doctors SET ? WHERE id = ?', [doctorData, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM doctors WHERE id = ?', [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }

  static async updateRating(id, rating) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE doctors SET rating = ? WHERE id = ?', [rating, id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = Doctor;