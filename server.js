const app = require("./app");
const connectDB = require("./src/config/db")

connectDB();
const PORT = 8000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);

});