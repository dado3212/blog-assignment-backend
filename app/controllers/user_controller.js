import User from '../models/user_model';
import jwt from 'jwt-simple';
import config from '../config';

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check that there is an email and a password
  if (!email || !password) {
    return res.status(422).send('You must provide email and password.');
  }

  // Check if there exists a user with that email
  User.findOne({ email })
  .then(existing => {
    if (!existing) {
      const user = new User();
      user.email = email;
      user.password = password;

      // Attempt to save the new user
      user.save()
      .then(result => {
        res.send({ token: tokenForUser(user) });
      })
      .catch(err => {
        res.status(400).send(`Error: ${err}`);
      });
    } else {
      // Handle existing email
      return res.status(422).send('An account already existing with this email.');
    }
  })
  .catch(err => {
    res.status(400).send(`Error: ${err}.`);
  });
};

export const createPost = (req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.tags = req.body.tags.split(' ');
  post.content = req.body.content;

  post.save()
  .then(result => {
    res.json({ message: 'Post created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getPosts = (req, res) => {
  Post.find().sort('-created_at').exec((err, posts) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json(posts.map(post => {
        return {
          id: post._id,
          tags: post.tags,
          title: post.title,
        };
      }));
    }
  });
};

export const getPost = (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({
        id: post._id,
        tags: post.tags,
        title: post.title,
        content: post.content,
      });
    }
  });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({ message: 'Deleted!' });
    }
  });
};

export const updatePost = (req, res) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      res.json({ message: `Error: ${err}` });
    } else {
      res.json({ message: 'Updated!' });
    }
  });
};
