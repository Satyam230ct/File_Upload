const Post = require('../models/post');
const Comment = require('../models/comment');
 
module.exports.create = async (req,res)=>{    

    try {
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id
        });
        
        if(req.xhr) // Converting the user input into jquery object
        {
            return res.status(200).json({
                data:{
                    post : post
                },
                message : 'Post Created!'
            });
        }

        req.flash('success','Post published!'); // for noty flash messages
        return res.redirect('back');
    } 
    catch (err) {
        req.flash('error','err');
        return res.redirect('back');
    }

}

module.exports.destroy = async function(req,res){

    try{
        let post= await Post.findById(req.params.id);
    
        if(post && post.user == req.user.id){
            post.remove(); 

            await Comment.deleteMany({post: req.params.id })

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id : req.params.id
                    },
                    message: 'Post Deleated'
                })
            }
            
            req.flash('success','Post and associated deleted!');
           
        }
        else {
            req.flash('error',"You can't delete this");
        }

        return res.redirect('/');
    }
    catch (err) {
        req.flash('error','err');
           return; 
    }
    
}