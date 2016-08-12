import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as Users from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// your routes will go here
router.route('/posts')
  .get(Posts.getPosts)
  .post(requireAuth, Posts.createPost);

router.route('/posts/:id')
  .get(Posts.getPost)
  .put(requireAuth, Posts.updatePost)
  .delete(requireAuth, Posts.deletePost);

// User routes
router.post('/signin', requireSignin, Users.signin);
router.post('/signup', Users.signup);

export default router;
