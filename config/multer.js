
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // specify a folder for storage in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // specify allowed file types
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // resize options
    }
});

const upload = multer({ 
    storage: storage,
    limits : {
        fileSize: 2 * 1024 * 1024, // Limit file size t
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if(allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'))
        }
    },
 });

module.exports = upload;