import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_this_in_production';
const TOKEN_EXPIRES = "24h";

const createToken = (userId) =>
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required." 
            });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format." 
            });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters." 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: "User already exists with this email." 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();
        
        // Create token
        const token = createToken(savedUser._id);
        
        res.status(201).json({ 
            success: true, 
            message: "User registered successfully",
            token,
            user: { 
                id: savedUser._id, 
                name: savedUser.name, 
                email: savedUser.email 
            } 
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error during registration." 
        });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required." 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password." 
            });
        }
        
        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password." 
            });
        }
        
        // Create token
        const token = createToken(user._id);
        
        res.status(200).json({ 
            success: true, 
            message: "Login successful",
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error during login." 
        });
    }
};