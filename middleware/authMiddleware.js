const jwt = require('jsonwebtoken');
const userModel = require('../models/User');


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({error:'No token provided'})
    }
    const token = authHeader.split(' ')[1];
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)
        if(!user) {
            return res.status(401).json({ message: 'Unauthorized'})
        }
        req.user = user;
       next()
     } catch(error) {
        res.status(500).json({ error: 'Failed to authenticate token' });
     }
}

module.exports = authMiddleware