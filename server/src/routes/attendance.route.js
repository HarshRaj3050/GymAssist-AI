const express = require('express');
const router  = express.Router();

const {
  markAttendance,
  getMyAttendance,
  getMyMonthlyAttendance,
  getAllAttendance,
  getTodayAttendance,
  renewMembership,
  deleteAttendanceRecord,
} = require('../controllers/attendance.controller');

const isAuthenticated = require('../middleware/auth.middleware');

// ── Member routes (any logged-in user) ────────────────────────
router.post('/mark',      isAuthenticated, markAttendance);          // → mark today's attendance
router.get('/my',         isAuthenticated, getMyAttendance);         // → get my full attendance record
router.get('/my/month',   isAuthenticated, getMyMonthlyAttendance);  // → get my attendance for a month (?month=2025-01)

// ── Admin routes (admin role required) ────────────────────────
// GET    /api/attendance/all           → get all members' attendance
// GET    /api/attendance/today         → get today's present members
// PUT    /api/attendance/renew         → renew a member's membership
// DELETE /api/attendance/:userId       → delete a member's record

// router.get   ('/all',           isAuthenticated, adminMiddleware, getAllAttendance);
// router.get   ('/today',         isAuthenticated, adminMiddleware, getTodayAttendance);
// router.put   ('/renew',         isAuthenticated, adminMiddleware, renewMembership);
// router.delete('/:userId',       isAuthenticated, adminMiddleware, deleteAttendanceRecord);

module.exports = router;