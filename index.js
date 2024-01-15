import express from 'express';
import cors from 'cors'; 
import multer from 'multer';

import mongoose from 'mongoose';
import { regiterValidations, loginValidations, postCreateValidations } from './validations.js';
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js';
import * as PostController  from './controllers/PostController.js';
import * as CommentController from './controllers/CommentController.js'
mongoose.connect(process.env.MONGODB.URI)
.then(()=>
console.log('DB ok')).catch((err)=>console.log('DB error', err));

const app = express();


const storage = multer.diskStorage({
    destination:(_, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname);
    }
})

const upload = multer({storage})

app.get('/', (req, res)=>{
    res.send('Hi')
})
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidations,  login)

app.post('/auth/register', regiterValidations,  register)

app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/posts', checkAuth, postCreateValidations, PostController.createPost);
app.get('/comments/:id', CommentController.getComments)
app.post('/comment', checkAuth, CommentController.postComment)
app.get('/posts/:id', checkAuth, PostController.getOne );
app.get('/posts', PostController.getPosts);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);



app.listen('4444', (err)=>{
    if(err){
       return console.log(err);
    }

    console.log('Server OK')
})

