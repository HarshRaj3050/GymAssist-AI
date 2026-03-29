const attendanceModel = require('../models/attendance.model');
const userModel = require('../models/user.model');

// ── Helper: today's date key "YYYY-MM-DD" ──────────────────────
function todayKey() {
    return new Date().toISOString().split('T')[0];
}

// ── Helper: check membership is still valid ────────────────────
function isMembershipValid(expiryDate) {
    return expiryDate && new Date(expiryDate) >= new Date();
}

// ─────────────────────────────────────────────────────────────────
// POST /api/attendance/mark
// Mark today's attendance for the logged-in user
// ─────────────────────────────────────────────────────────────────
async function markAttendance(req, res) {
    try {
        const userId = req.userId; // set by auth middleware

        // Find user's attendance record
        let record = await attendanceModel.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found. Please contact admin.' });
        }

        // Check membership expiry
        // if (!isMembershipValid(record.membershipExpiry)) {
        //     return res.status(403).json({ message: 'Your membership has expired. Please renew to mark attendance.' });
        // }

        // Check if already marked today
        const today = todayKey();
        if (record.attendance.get(today) === true) {
            return res.status(400).json({ message: 'Attendance already marked for today.' });
        }

        // Mark attendance
        record.attendance.set(today, true);
        record.totalAttendance = (record.totalAttendance || 0) + 1;
        record.lastAttendance = new Date();

        await record.save();

        res.status(200).json({
            message: 'Attendance marked successfully',
            date: today,
            totalAttendance: record.totalAttendance,
            lastAttendance: record.lastAttendance,
        });

    } catch (err) {
        console.error('markAttendance error:', err);
        res.status(500).json({ message: 'Something went wrong while marking attendance' });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/attendance/my
// Get the logged-in user's own attendance record
// ─────────────────────────────────────────────────────────────────
async function getMyAttendance(req, res) {
    try {
        const userId = req.userId;

        const record = await attendanceModel.findOne({ userId });
        if (!record) {
            return res.status(404).json({ message: 'No attendance record found.' });
        }

        // Convert Map to plain object for JSON response
        const attendanceObj = Object.fromEntries(record.attendance);

        res.status(200).json({
            email: record.email,
            membershipExpiry: record.membershipExpiry,
            membershipValid: isMembershipValid(record.membershipExpiry),
            totalAttendance: record.totalAttendance,
            lastAttendance: record.lastAttendance,
            attendance: attendanceObj,
        });

    } catch (err) {
        console.error('getMyAttendance error:', err);
        res.status(500).json({ message: 'Something went wrong while fetching attendance' });
    }
}

// ─────────────────────────────────────────────────────────────────
// GET /api/attendance/my/month?month=2025-01
// Get attendance for a specific month (defaults to current month)
// ─────────────────────────────────────────────────────────────────
async function getMyMonthlyAttendance(req, res) {
    try {
        const userId = req.userId;
        const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"

        const record = await attendanceModel.findOne({ userId });
        if (!record) {
            return res.status(404).json({ message: 'No attendance record found.' });
        }

        // Filter only keys that start with the given month
        const monthly = {};
        record.attendance.forEach((value, key) => {
            if (key.startsWith(month)) {
                monthly[key] = value;
            }
        });

        const presentDays = Object.values(monthly).filter(Boolean).length;

        res.status(200).json({
            month,
            attendance: monthly,
            presentDays,
            totalAttendance: record.totalAttendance,
        });

    } catch (err) {
        console.error('getMyMonthlyAttendance error:', err);
        res.status(500).json({ message: 'Something went wrong while fetching monthly attendance' });
    }
}



// ─────────────────────────────────────────────────────────────────
// ADMIN: GET /api/attendance/all
// Get all members' attendance records (admin only)
// ─────────────────────────────────────────────────────────────────
async function getAllAttendance(req, res) {
    try {
        const records = await attendanceModel.find().lean();

        const result = records.map((r) => ({
            userId: r.userId,
            email: r.email,
            membershipExpiry: r.membershipExpiry,
            membershipValid: isMembershipValid(r.membershipExpiry),
            totalAttendance: r.totalAttendance,
            lastAttendance: r.lastAttendance,
            attendance: r.attendance, // already plain object with .lean()
        }));

        res.status(200).json({ total: result.length, records: result });

    } catch (err) {
        console.error('getAllAttendance error:', err);
        res.status(500).json({ message: 'Something went wrong while fetching all records' });
    }
}

// ─────────────────────────────────────────────────────────────────
// ADMIN: GET /api/attendance/today
// Get all members who marked attendance today
// ─────────────────────────────────────────────────────────────────
async function getTodayAttendance(req, res) {
    try {
        const today = todayKey();
        const records = await attendanceModel.find().lean();

        const present = records
            .filter((r) => r.attendance && r.attendance[today] === true)
            .map((r) => ({
                userId: r.userId,
                email: r.email,
                lastAttendance: r.lastAttendance,
            }));

        res.status(200).json({
            date: today,
            presentCount: present.length,
            members: present,
        });

    } catch (err) {
        console.error('getTodayAttendance error:', err);
        res.status(500).json({ message: 'Something went wrong while fetching today\'s attendance' });
    }
}

// ─────────────────────────────────────────────────────────────────
// ADMIN: PUT /api/attendance/renew
// Renew a member's membership expiry date
// ─────────────────────────────────────────────────────────────────
async function renewMembership(req, res) {
    try {
        const { userId, membershipExpiry } = req.body;

        if (!userId || !membershipExpiry) {
            return res.status(400).json({ message: 'userId and membershipExpiry are required.' });
        }

        const record = await attendanceModel.findOneAndUpdate(
            { userId },
            { membershipExpiry: new Date(membershipExpiry) },
            { new: true }
        );

        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found.' });
        }

        res.status(200).json({
            message: 'Membership renewed successfully',
            userId: record.userId,
            email: record.email,
            membershipExpiry: record.membershipExpiry,
        });

    } catch (err) {
        console.error('renewMembership error:', err);
        res.status(500).json({ message: 'Something went wrong while renewing membership' });
    }
}

// ─────────────────────────────────────────────────────────────────
// ADMIN: DELETE /api/attendance/:userId
// Delete a member's attendance record
// ─────────────────────────────────────────────────────────────────
async function deleteAttendanceRecord(req, res) {
    try {
        const { userId } = req.params;

        const record = await attendanceModel.findOneAndDelete({ userId });
        if (!record) {
            return res.status(404).json({ message: 'Attendance record not found.' });
        }

        res.status(200).json({ message: 'Attendance record deleted successfully.' });

    } catch (err) {
        console.error('deleteAttendanceRecord error:', err);
        res.status(500).json({ message: 'Something went wrong while deleting record' });
    }
}

module.exports = {
    markAttendance,
    getMyAttendance,
    getMyMonthlyAttendance,
    getAllAttendance,
    getTodayAttendance,
    renewMembership,
    deleteAttendanceRecord,
};