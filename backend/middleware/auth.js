import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
    // Look for token in Authorization header
    const token =
        req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized – token missing',
        });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        const message =
            err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        res.status(401).json({ success: false, message });
    }
}
