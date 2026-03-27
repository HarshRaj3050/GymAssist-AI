const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');


const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://application-name.vercel.app"
        ],
        credentials: true
    })
);


app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
    res.send("Server working");
});


module.exports = app