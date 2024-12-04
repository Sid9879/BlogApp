let UserCollection = require('../models/UserCollection')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
let JWT_SECRET = "ShreeRam"
let randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const { query } = require('express');


const registerUser = async(req,res)=>{
const {name,email,password,address} = req.body;
if(!name){
    return res.json({msg:"name is required"}) //its use when your not added the required condition in user collection
}
let existingUser = await UserCollection.findOne({email}); // user exists or not
console.log(existingUser)
if(existingUser){
   return res.json({msg:"user already registered",success:false})
}
try {
    let hashedPassword = bcrypt.hashSync(password, salt); // chaning password by using hashed password
    // console.log(hashedPassword)
    // console.log(password)
    let data = await UserCollection.create({
        name,
        email,
        password:hashedPassword,
        address
    })
    res.json({msg:"user registered successfully",success:true,data})
} catch (error) {
    res.json({msg:"error in creating user",success:false,error:error.message})
}


}

const loginUser = async(req,res)=>{
 const {email,password} = req.body;

 try {
    let existingUser = await UserCollection.findOne({email});

 if(existingUser){
   let comparePassword = bcrypt.compareSync(password,existingUser.password)
   if(comparePassword){
    let token = jwt.sign({_id:existingUser._id},JWT_SECRET);
    // res.json({msg:"user Logged successfully",success:true,user:existingUser}) // without token
    res.json({msg:"user Logged successfully",success:true,token})
   } // with token
   else{
    res.json({msg:"password is incorrect",success:false})
   }
 }
 else{
    return res.json({msg:"user not found",success:false})
 }
 } catch (error) {
    res.json({msg:"error in login user",success:false,error:error.message})
 }

}
const updateUser = async(req,res)=>{
   const {name,password,coverPic,profilePic,address,bio} = req.body
  try {
    const userId = req.params._id
    if(password){
        var hashedPassword = bcrypt.hashSync(password,salt)
    }
    console.log(hashedPassword)
    let data = await UserCollection.findByIdAndUpdate(userId,{$set:{name,profilePic,coverPic,address,password:hashedPassword,bio}},{new:true})
 
    res.json({msg:"user updated successfully",success:true,user:data})
  } catch (error) {
    res.json({msg:"error in updating",success:false,error:error.message})
  }
    
}
const deleteUser = async(req,res)=>{
    
    try {
        let paramId = req.params._id
        let userId = req.user._id //its get from token
    
        // console.log("logged=",userId)
        // console.log("logged delete=",paramId)
    
        if(userId===paramId){ //checking token and its id which u mix on it
            let data = await UserCollection.findByIdAndDelete(userId)
            res.json({msg:"user deleted successfully", success:true})
    
            // console.log("you can delete")
        }
        else{
            // console.log("invalid")
            res.json({msg:"not authorized to delete", success:false})
        }  
   
    } catch (error) {
        res.json({msg:"error in deleting user",success:false,error:error.message})
    } 
}
const getUserDetails = async(req,res)=>{
    let userId = req.user._id
    // console.log("userId=",userId)
    try {
        let user = await UserCollection.findById(userId).select("-password").populate({path:'followers',select:['name','profilePic']}).populate({path:"followings",select:['name','profilePic']});
    res.json({msg:"user fetched successfully",success:true,user})
    } catch (error) {
    res.json({msg:"error in getting user details",success:false,error:error.message})
        
    }
}

//forget password........................
const resetPassword = async (req,res)=>{
    const {email} = req.body
   try {
    let user = await UserCollection.findOne({email})
    if(user){
        let reset_token = randomstring.generate(20)
        let date = Date.now();
        user.resetToken = reset_token
        user.resetTokenValidity = date
        await user.save()
        let msgSent =await sendMail(email,reset_token)
res.json({msg:"Please check your email for reset password",success:true})
    }
    else{
return res.json({msg:"user not found",success:false})
    }
   } catch (error) {
res.json({msg:"error in forgeting password",success:false,error:error.message})
    
   }
}



async function sendMail(email,reset_token){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "singhsiddharth1438@gmail.com",
          pass: "frxe zboi jvoj eatq",
        },
      });

      const info = await transporter.sendMail({
        from: 'singhsiddharth1438@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Request of Password reset", // Subject line
        text:`Please click the link below to choose a new password: \n \n http://localhost:8080/users/forgetPassword/${reset_token} \n  \n \n Regards \n Siddharth Singh`
      });
    
    //   console.log("Message sent: %s", info.messageId);
}

const forgetPassword = async (req, res) => {
    try {
        const resetToken = req.params.resetToken;
        let user = await UserCollection.findOne({ resetToken });

        if (user) {
            // Calculate time difference in hours
            const tokenDate = user.resetTokenValidity;
            const currentDate = Date.now();
            const timeDifference = currentDate - tokenDate;
            const timeInHours = timeDifference / (60 * 1000); // convert milliseconds to hours

            // If token expired (>2 min), render "tokenExpired" page
            if (timeInHours > 5) {
                return res.render('tokenExpired');  // Render the 'tokenExpired' page if the token has expired
            }

            // If token is valid, render the 'forgetPassword' page
            return res.render("forgetPassword", { resetToken });
        }

        // If no user found with the reset token, render tokenExpired page
        return res.render("tokenExpired");

    } catch (error) {
        res.json({ msg: "Error in processing forget password request", success: false, error: error.message });
    }
};

const updatePassword = async(req,res)=>{
    // res.send("password updated running")
    let resetToken = req.params.resetToken;
    let Password = req.body.updatePassword;

   try {
    
    let user = await UserCollection.findOne({resetToken})
    if(user){
        let hashedPassword = bcrypt.hashSync(Password,salt)
user.password = hashedPassword
user.resetToken = null
await user.save()
res.json({msg:"Password updated successfully",success:true})
    }
    else{
        res.json({msg:"token expired",success:false})

    }
   } catch (error) {
    res.json({msg:"error in reset password",success:false,error:error.message})
   }
}

const searchUser = async(req,res)=>{
// console.log(req,query)
      let {q} = req.query;
    //   console.log(q)

      if(q.length>0){
        let regex = new RegExp(q,'i');
        let users = await UserCollection.find({name:regex}).select(['name','profilePic',])
        res.json({msg:"fetched successfully",success:true,users})
      }

      else{
        res.json({msg:"no user found",success:false})
      }
}

const getSingleUser = async(req,res)=>{
    let _id = req.params._id;
   try {
    let user = await UserCollection.findById(_id).select(["-password","-resetToken"])
    res.json({msg:"user get successfully",success:true,user})
   } catch (error) {
    res.json({msg:"error in finding",success:false,error:error.message})
   }
}

const FollowUser = async(req,res)=>{
    let {friendId} = req.params; //other user id
    let userId = req.user._id; //Logged-in user ID by token
    // console.log(userId)
  try {
    let user = await UserCollection.findById(userId)
    // .populate({path:'followings',select:['name','profilePic']})
    // .select(['name profilePic followings']);
    let friend = await UserCollection.findById(friendId)
    // .populate({path:'followings',select:['name','profilePic']})
    // .select(['name profilePic followers']);
 
    
 
    if(!user.followings.includes(friendId)){
     user.followings.push(friendId);
     friend.followers.push(userId);
     await user.save()
     await friend.save();
     res.json({msg:"user followed successfully",success:true})
    }
 
    else{
     user.followings.pull(friendId);
     friend.followers.pull(userId);
     await user.save()
     await friend.save();
     res.json({msg:"user unfollowed successfully",success:true})
    }
  } catch (error) {
    res.json({msg:"error unfollow",success:false,error:error.message})
    
  }
}
module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUserDetails,
    resetPassword,
    forgetPassword,
    updatePassword,
    searchUser,
    getSingleUser,
    FollowUser
}