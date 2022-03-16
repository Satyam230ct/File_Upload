const Post = require('../models/post');
const User = require('../models/user');

// Now we are going to use async await
module.exports.home = async function(req,res){    
    try{
        // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
            }
        });
        
        let users= await User.find({});

        return res.render('home',{
            title:'Codial | Home',
            posts: posts,
            all_users: users
        });
    }
    catch(err){
        console.log('Error',err);
        return;
    }
}