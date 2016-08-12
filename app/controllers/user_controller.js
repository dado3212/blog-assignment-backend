import User from '../models/user_model';
import jwt from 'jwt-simple';
import config from '../config';

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export const signin = (req, res, next) => {
  res.json({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  // Check that there is an email and a password
  if (!email || !password || !name) {
    return res.status(422).send('You must provide email, password, and name.');
  }

  // Check if there exists a user with that email
  User.findOne({ email })
  .then(existing => {
    if (!existing) {
      const user = new User();
      user.email = email;
      user.password = password;
      user.name = name;

      // Attempt to save the new user
      user.save()
      .then(result => {
        res.json({ token: tokenForUser(user) });
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
