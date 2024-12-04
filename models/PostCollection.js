const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String
    },
    file:[],

    userId:{
    //   type:String,
    type:mongoose.Schema.Types.ObjectId, //to save existing userid in object form
      required:true,
      ref:"users"
    },

},{timestamps:true})

postSchema.add({
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        }
    ],

    comments:[
    {
        user:{
            
                type:mongoose.Schema.Types.ObjectId,
                ref:"users" ,
               
                
                          
        },
        text:{
            type:String,
            // createdAt: { type: Date, default: Date.now }
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }
]
})

module.exports = mongoose.model("posts",postSchema)
