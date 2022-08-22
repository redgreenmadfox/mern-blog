import express from 'express';
import mongoose from 'mongoose';
import { registerValidator, loginValidator, postCreateValidator } from './utils/validations.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';
import { UserController, PostController } from './controllers/index.js'
import cors from 'cors';

mongoose.connect(
  'mongodb+srv://superuser:superpassword@cluster0.xfuaz.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {console.log('DB OK')})
  .catch((error) => {console.log('DB ERROR', error)})
;

//initializing app
const app = express();

//files storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
})

const upload = multer({ storage });

//reading JSON
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidator,  handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
});

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getPostById);
app.delete('/posts/:id', checkAuth, PostController.removePostById);
app.patch('/posts/:id', checkAuth, postCreateValidator,  handleValidationErrors, PostController.updateById);
app.post('/posts', checkAuth, postCreateValidator,  handleValidationErrors, PostController.create);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK')
});