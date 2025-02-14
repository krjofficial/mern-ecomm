import mongoose from "mongoose";
import bcrypt from "bcryptjs";  

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"], // error message
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  cartItems: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer", // by default each user will be customer 
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt fields
});




//Presave hook to hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash the password
    next();
  } catch (error) {
    next(error);
  }
})


// Compare Password 
// actual password = 1234
// entered password = 234 -> invalid password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}


const User = mongoose.model("User", userSchema)
export default User;
