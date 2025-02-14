// creating the user.js router all the requests that comes to /api/v1/user will come here

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db");
const JWT_SECRET = require("../config");

// post endpoint to register the user in database
router.post("/signup", async (req, res) => {
    const body = req.body;

    // checking if user already exists in database or not 
    const existingUser = await User.findOne({
        username: body.username
    })

    // if the user already exists in the database, then return a message User already exists
    if(existingUser){
        return res.status(411).json({
            message: "User already exists"
        })
    }

    // putting in mongodb if the inputs are correct
    const dbUser = await User.create(body);

    // using jwt to sign the user with the token, with the id of the User
    const userId = dbUser._id;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

});



// post endpoint for user to signin
router.post("/signin", async (req, res) => {
    const body = req.body;

    const dbUser = await User.findOne({
        username: body.username,
        password: body.password
    });


    if(dbUser){
        const token = jwt.sign({
            userId: dbUser._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

// get endpoint to search user based on username or fullname and get all there information
// getting the filter in the query 
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    console.log("filter is " + filter);
    // finding the users in database according to there username or fullname 
    const users = await User.find({
        "$or": [{
            username: {
                "$regex": filter
            },
        }, {
            fullName: {
                "$regex": filter
            }
        }]
    })
    console.log(users);
    // retrieving there full information 
    res.json({
        // we dont want to return the password to the user 
        user: users.map(user => ({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            country: user.country
        }))
    })

}); 

module.exports = router;