import mongoose,{Schema}from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        lowercase:true, 
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 100,
    },
}, {timestamps: true})


// before saving to DB hash password 
userSchema.pre("save", async function () {
    if(!this.isModified("password")) return; 
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password){
	return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)