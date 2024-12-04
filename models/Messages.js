const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    text:{
        type:String,
        required:true,
    },
    // createdAt:{
    //     type:Date,
    //     default:Date.now
    // }

},{timestamps:true})

module.exports = mongoose.model('message',messageSchema)