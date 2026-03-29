const userModel = require('../models/user.model');
const bcrypt = require('bcrypt')


async function dashboard(req, res) {
    const userId = req.userId;
    try {
        const userName = await userModel.findOne({ "_id": userId }).select("name");

        res.status(201).json({
            message: "user data fetch successfully",
            userName
        })

    } catch (err) {
        console.log("error: ", err);

        return res.status(401).json({
            message: "Something issue in dashboard api"
        })
    }
}


async function fit(req, res){

}

async function userAttendance(req, res){
    
}


module.exports = { dashboard, fit };