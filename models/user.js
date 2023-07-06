const mongoose=require('mongoose'); // database

const Schema=mongoose.Schema;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    // allows us to connect two models.
    createdEvents:[
        {
            type:Schema.Types.ObjectId,
            ref:'Event'
        }
    ]
});

module.exports=mongoose.model('User',userSchema); // model name is User