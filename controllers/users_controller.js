const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title:'User Profile',
            profile_user:user
        });
    });
}

module.exports.update = async (req,res)=>{
    
    if(req.user.id==req.params.id){

        try {
            
            let user = await User.findById(req.params.id);
            
            console.log(user);
            
            User.uploadedAvatar(req,res,function(err){
                

                console.log(req.file);

                if(err){
                    console.log('****Multer Error',err);    return;
                }

                console.log(req.file);

                user.name = req.body.name;
                user.email= req.body.email;

                if(req.file){
                    
                    if(user.avatar){ // For deleating the old avatar and to do this we need a fs(file system) and the path 
                        // Used to delete-> unlinkSync
                        try {
                            fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                        } catch (error) {
                            console.log('File not present',error);
                        }
                    }

                    // This is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }    
                
                user.save();

                return res.redirect('back');
            });

        } catch (err) {
            req.flash('error','err while uploading');
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// Rendering the sigup page
module.exports.signUp = function(req,res){

    // Means is user is already logedIn then we directly 
    if(req.isAuthenticated()){  // transfering it to profile page
       return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:'Codeial | Sign Up'
    });
    
};

// Rendering thew sign in page
module.exports.signIn = function(req,res){

    // Means is user is already logedIn then we directly 
    if(req.isAuthenticated()){  // transfering it to profile page
        return res.redirect('/users/profile');
    }
   
    return res.render('user_sign_in',{
        title:'Codeial | Sign In'
    });
};

// Get the sign-up data
module.exports.create = function(req,res){
    
    if(req.body.password!=req.body.conform_password)
    {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email},function(err,user){
        if(err){console.log('error in finding in signing up');  return;}
        console.log(user);
        if(!user){  // Means if user is not found then we have to create the user
            User.create(req.body,function(err,user){
                if(err){console.log('error in creating user signing up');  return;}
                return res.redirect('/users/sign-in');
            })     
        }else{
            return res.redirect('back');
        }
    });

};

// Sign in and create a session for the user
module.exports.createSession = function(req,res){    
    
    req.flash('success','Logged in Successfuly'); // To pass this messages to ejs we creating the middleware
    
    return res.redirect('/');
};

module.exports.destroySession = function(req,res){
    req.logout();    
    req.flash('success','You have Logged out!');
    return res.redirect('/');
}