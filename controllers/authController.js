const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User');


const register = async (req, res) => {
    const {firstName, lastName,password, confirmPassword, email} = req.body;

    if(!firstName || !lastName || !password || !email || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
    try {
        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return res.status(400).json({ error: 'User already exist' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ firstName, lastName, password: hashedPassword, email})
        await user.save();
        res.status(201).json(user);
    }  catch(error) {
        res.status(400).json({ error: error.message})
    }
}
const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
    try {
            const user = await UserModel.findOne({email});

            if(!user) return res.status((404)).json({ error : 'Invalid email or password' });

            const validPassword = await bcrypt.compare(password, user.password);

            if(!validPassword) return res.status(401).json({ error: 'Invalid email or password'}) 
                
            const token = jwt.sign(
                { userId: user._id, email: user.email }, 
                 process.env.JWT_SECRET,                             
                { expiresIn: '1h' }                      
            )
            user.token = token;
            await user.save()
            res.json({
                message: 'Login successful',
                token: `Bearer ${token}`
            });
    } catch(error) {
        res.status(400).json({ error: error.message})
    }
}
const forgotPassword = async (req, res, next) => {}
const resetPassword = async (req, res, next) => {}


module.exports ={ register, login, forgotPassword, resetPassword}















