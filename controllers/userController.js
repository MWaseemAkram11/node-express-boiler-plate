const UserModel = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10} = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const totalUsers = await UserModel.countDocuments();

     const users = await UserModel.find()
                   .select('-password -token')
                   .skip((pageNumber - 1) * limitNumber)
                   .limit(limitNumber)
                   .lean();

     const totalPages = Math.ceil(totalUsers / limitNumber);

     res.status(200).json({
        message: 'Users fetched successfully',
        data : {
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: pageNumber,
                pageSize: users.length,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        }
     });
  } catch(error) {
    res.status(500).json({ error: 'Server error, please try again later' });
  }
}

const getUser = async (req, res) => {

    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        delete user.password;
        delete user.token;

        res.status(200).json({
            message: 'User fetched successfully',
            user
        });

    } catch(error) {
        res.status(500).json({ error: 'Server error, please try again later' });
    }

}

const updateUser = async (req, res) =>  {
    const userId = req.params.id; 
    const {firstName, lastName, password, email, phone, address, cnic, district, tehsil } = req.body;
    const image = req.files?.image ? req.files.image[0].path : undefined;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { firstName, lastName, password, email, phone, address, cnic, district, tehsil, ...(image && { image }) },
            { new: true, runValidators: true }
        ).select('-password -token'); 
        console.log(updatedUser)
        // Check if the user exists
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch(error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: 'Validation failed', messages });
        }
        res.status(500).json({ error: 'Server error, please try again later' });
    }
}
   
const deleteUser = async (req, res) => {

    const userId = req.params.id; 

    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error, please try again later' });
    }
}

const profileUpdate = async (req, res) => {
    const userId = req.user._id;
    const { phone, address, cnic, district, tehsil } = req.body;
    const image = req.files?.image ? req.files.image[0].path : undefined;

    try {
        const updatedUser  = await UserModel.findByIdAndUpdate(userId, 
            { phone, address, cnic, district, tehsil, ...(image && { image })},
            { new: true, runValidators: true }).lean();

      if(!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      delete updatedUser.password;
      delete updatedUser.token;

      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser })

    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            const messages  = Object.values(error.errors).map(err => err.message)
            return res.status(400).json({ error: 'Validation failed', messages });
        }
        res.status(500).json({ error: 'Server error, please try again later' });
    }
}

const profileFee  = async (req, res) => {
    const userId = req.user._id;
    // const paymentProofPath  = req.file ? req.file.path : undefined;
    const paymentProofPath  = req.files?.paymentProof ? req.files.paymentProof[0].path : undefined;
   
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, 
            {feePaid: true, paymentProof: paymentProofPath},
            { new: true,  runValidators: true }
        ).lean();

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
          }

          delete updatedUser.password;
          delete updatedUser.token;

          res.status(200).json({ message: 'Payment proof uploaded successfully', user: updatedUser });
    }  catch(error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports =  {getUsers, getUser, updateUser, deleteUser, profileUpdate, profileFee }