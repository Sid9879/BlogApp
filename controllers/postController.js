let postCollection = require('../models/PostCollection')

const createPost = async(req,res)=>{
const {title,description,file} = req.body
// const user = (req.user)
let id = req.user._id
console.log(id)
try {
    let data = await postCollection.create({
        title,
        description,
        file,
        userId:id
    })
    res.json({msg:"post created successfully",success:true})
} catch (error) {
    res.send({msg:"error in creating post",success:false,error:error.message})
}
// res.send(req.user)
// console.log(user)
// res.send("post created")
}

const getAllPost = async(req,res)=>{

    try {
        let post = await postCollection.find().populate({path:"userId",select:["name","profilePic"]}).populate({path:'comments', options: { sort: { createdAt: -1 } },populate:{path:'user',select:['name','profilePic' ]}}).sort({createdAt:-1});
    res.json({msg:"post find successfully",success:true,post})
    } catch (error) {
        res.json({msg:"error in getting all post",success:false,error:error.message})
    }

}

const updatePost = async(req,res)=>{
    const {title,description,file} = req.body
    try {
        let userId = req.params._id
        console.log(userId)
    let update = await postCollection.findByIdAndUpdate(userId,{$set:{title,description,file}});
    res.json({msg:"post updated successfully",success:true,post:update})
    } catch (error) {
        res.json({msg:"error in updating post",success:false,error:error.message})
    }


}

const deletePost = async(req,res)=>{
    try {
        let userId = req.params._id;
    let deletePost = await postCollection.findByIdAndDelete(userId);
    res.json({msg:"post deleted successfully",success:true})
    } catch (error) {
        res.json({msg:"error in deleting post",success:false,error:error.message})
    }

}

const getUserPosts = async(req,res)=>{
let {userId} = req.params;
try {
    let posts = await postCollection.find({userId})
res.json({msg:"post fetched successfully",success:true,posts})
} catch (error) {
    res.json({msg:"error in fetching post",success:false,error:error.message})
}
}

const likePost = async(req,res)=>{
    let {postId} = req.params;
    let userId = req.user._id;
    // console.log(postId)
    // console.log('userid=',userId)
   try {
    let post = await postCollection.findById(postId)
    console.log(post)
    if(post.likes.includes(userId)){
        post.likes.pull(userId)
        await post.save()
        return res.json({msg:"post disliked",success:true})
    }
    else{
        post.likes.push(userId)
        await post.save()
        return res.json({msg:"post liked",success:true})

    }
   } catch (error) {
    return res.json({msg:" error in post liked",success:false,error:error.message})
    
   }
}

const commentPost = async(req,res)=>{
    const {postId} = req.params;
    const userId = req.user._id;
    // console.log("userid=",userId)
    const {text} = req.body;

 

   try {
    let post = await postCollection.findById(postId);
    post.comments.push({user:userId,text:text})
    // .sort({createdAt:-1});
    await post.save();
    let date = Date.now();
   
    res.json({msg:"comment posted successfully",success:true})
   } catch (error) {
    res.json({msg:" error in comment ",success:false,error:error.message})
   }
}

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
    getUserPosts,
    likePost,
    commentPost
}