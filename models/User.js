const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/Users', { useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
    console.log("Connection to database successfull");
}).catch(()=>{
    console.log("Cannot connect to database");
});

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:Number,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},

    // tokens
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, "IshanIsAGoodBoy");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 7);
    }
    next();
});

const User = new mongoose.model("User", userSchema);
module.exports = User;