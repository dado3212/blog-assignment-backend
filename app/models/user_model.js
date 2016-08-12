import mongoose, { Schema } from 'mongoose';

// create a schema for posts
const UserSchema = new Schema(
  {
    email: { type: String, unique: true, lowercase: true },
    password: String,
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

UserSchema.set('toJSON', {
  virtuals: true,
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
