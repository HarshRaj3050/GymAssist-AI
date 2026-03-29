const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        email: String,
        membershipExpiry: Date,

        attendance: {
            type: Map,
            of: Boolean,
            default: {}
        },

        totalAttendance: Number,
        lastAttendance: Date

    }, {
        timestamps: true
    }
);

const attendanceModel = mongoose.model("userAttendance", attendanceSchema);

module.exports = attendanceModel;

