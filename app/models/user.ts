import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    capped: { size: 1024 },
    bufferCommands: false,
    autoCreate: false
  },
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
UserModel.createCollection().then(() => { console.log("User collection created") });

export default UserModel;