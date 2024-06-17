import mongoose , {Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
    username:{
        type:String,
        required:true,
        unqiue:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unquie:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //Cloudinary url
        required:true
    },
    coverImage:{
        type:String  //Cloudinary url
    },
    watchHistro:[
        {
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    ],
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    }
},
{timestamps:true})

userSchema.pre("save", async function (next){
    if(!this.isModified("password"))return next();
    this.password = await bcrypt.hash(this.password ,10,)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
     return Jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
     }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
      {
        _id:this._id,
     },
     process.env.REFRESH_TOKEN_SECRET,
     {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     }
    )
}

export const User = mongoose.model("User",userSchema);