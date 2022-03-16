const mongoose = require('mongoose');

// We are imprting multer in user page not in config folder why-> Because we are uploading that
// file specific to user and will have some specific settings user avtar will be uploaded at different place
// we are setting up m ulter individually for each model
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars'); // This is where we are storing all the avatars

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true    // Email id can't be dublicates
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String // Store the href of image
    }
},{
    timestamps: true // Controles date and time (created at and updated at)
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

// Static function -> Are the ones which can be call overalled on the whole class
// for example if there is a class called planets and i need to get count of population 
// overall all the planets i need to define static function on that planet not for the each individual planet that have been created or the object of that class

// Static methods
userSchema.statics.uploadedAvatar = multer({storage : storage}).single('avatar'); // .single('avatar) this says only one file or one instance is going to be uploaded
userSchema.statics.avatarPath = AVATAR_PATH; // Just made this publically availabe 

const User = mongoose.model('User',userSchema);
module.exports = User;