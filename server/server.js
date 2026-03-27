const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Server is running on the port 3000");
})