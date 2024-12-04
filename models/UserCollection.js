const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
       type: String,
    required:[true,"name is required"]
    },

    email:{
        type: String,
     required:[true,"email is required"],
     unique:true
     },

     password:{
        type: String,
     required:[true,"password is required"]
     },

     profilePic:{
        type: String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf49fton7yztt_1Xmzro_oc-xSEV9oa-JzXg&s'
    //  required:[true,"name is required"]
     },

     coverPic:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2dhrA2w0kJcS4h5Ww-yipVpz8kCDsLY0M9w&s"
     },

     address:{
        type: String,
    //  required:[true,"name is required"]
     },

    
},{timestamps:true})

userSchema.add({
   resetToken:{
      type:String,
      default:null
   },
   resetTokenValidity:{
      type:Date,
   },
   bio:{
type:String,
default:""
   },
   followers:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
   }
],
   followings:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
   }
]
},)

module.exports = mongoose.model("users",userSchema)