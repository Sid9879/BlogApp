const mongoose = require('mongoose');
require('dotenv').config()
const connectToDb = () =>{
    mongoose.connect(`mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASSWORD}@blogapp.2dgot.mongodb.net/?retryWrites=true&w=majority&appName=BlogApp`)
  .then(() => console.log('mongodb Connected successfully'))
  .catch(()=>console.log('error in connecting mongodb'))
};
module.exports = connectToDb