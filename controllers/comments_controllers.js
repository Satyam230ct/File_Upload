const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create= async function(req,res){

// Adding comment only if the post exist realted to that id 
    
    let post= await Post.findById(req.body.post);

    if(post)
    {
        let comment = await Comment.create({
            content:req.body.content,
            user:req.user._id,
            post:req.body.post // same as post: post._id
        });

        post.comments.push(comment); 
        // It will automatically featch out the id and push it (or you can do comment._id)
        post.save(); // Whenever we are updateing something we have to call save

        res.redirect('/');
    }
}

module.exports.destroy = async (req,res)=>{

    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user==req.user.id)
        {
            let postId=comment.post;
            comment.remove();
            
            await Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}});

        }

        return res.redirect('back');
    } 
    catch (err) {
        console.log('Error',err); return;
    }
}