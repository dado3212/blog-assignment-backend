import mongoose, { Schema } from 'mongoose';

// create a schema for posts
const PostSchema = new Schema(
  {
    title: String,
    tags: [String],
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

// create model class
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
