const mongoose = require("mongoose");
// Database schema for user information

require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log("connected to mongodb.."))
.catch(err => console.log(err))


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    dateOfBirth: {
        type: Date,
        required: true,
        set: (val) => {
            if(typeof val == "string"){
                // Convert DD/MM/YYYY into "YYYY-MM-DD"
                const [day, month, year] = val.split("/");
                return new Date(`${year}-${month}-${day}`);
            }
            return val; // Return as is if it's already a Date
        }
    },
    country: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
module.exports = {
    User
}