import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

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

UserSchema.pre('save', (next) => {
  const user = this;

  // Ignore hashing if password not being modified
  if (!user.isModified('password')) return next();

  // generate salt with callback (async)
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      return next();
    });
  });
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
