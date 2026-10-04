
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) {
            return res.json({
                status: false,
                message: "Name is mandatory"
            });
        }

        if (!email) {
            return res.json({
                status: false,
                message: "Email is mandatory"
            });
        }

        if (!password) {
            return res.json({
                status: false,
                message: "Password is mandatory"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.json({
                status: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.json({
                status: false,
                message: "Password should contain at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.json({
                status: false,
                message: "Email already registered"
            });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        await newUser.save();

        return res.json({
            status: true,
            message: "Registration Successful"
        });

    } catch (error) {
        console.log(error);

        return res.json({
            status: false,
            message: "Registration failed"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.json({
                status: false,
                message: "User does not exist"
            });
        }

        if (user.password !== password) {
            return res.json({
                status: false,
                message: "Invalid password"
            });
        }

        // Create JWT token after successful login
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            status: true,
            message: "Login Successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);

        return res.json({
            status: false,
            message: "Login failed"
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};

