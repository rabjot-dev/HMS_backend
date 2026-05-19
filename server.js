const app = require("./app"); //contain express application
const connectDB = require("./src/config/db")

connectDB();
const PORT = 8000;
app.listen(PORT,()=>{  // listen for incoming HTTP requests
    console.log(`Server is running on ${PORT}`);

});