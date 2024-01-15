import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {body, validationResult} from 'express-validator';
import UserModel from '../models/User.js';


export const register = async(req, res)=>{
    try {
        // const errors = validationResult(req);
        // if(!errors.isEmpty()){
            
        //     return res.status(400).json(errors.array);
        // }
        const password = req.body.password;
        //алгоритм шифрування паролю
        const salt = await bcrypt.genSalt(10)
        //шифрування паролю
        const hash = await bcrypt.hash(password, salt);
    
    
        const doc = new UserModel({
            email: req.body.email, 
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })
    
        const user = await doc.save();
        const token = jwt.sign({
            _id: user._id,

        }, "secretCode",
        {
            expiresIn: '30d',
        })


        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        })
    } catch (err){
        res.status(500).json({
            message: 'Не вийшло зареєструватися',
        
        
        }
        )
    }
};

export const login = async (req, res)=>{
    try{
        const user = await UserModel.findOne({ email: req.body.email })
        if(!user){
            return res.status(404).json({
                message: 'Користувач не знайдений'
            });
        }
        
        const validPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!validPassword){
            return res.status(404).json({
                message: 'Невірний логін або пароль',
            });
        }


        const token = jwt.sign({
            _id: user._id,

        }, "secretCode",
        {
            expiresIn: '30d',
        })

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        })

    }
    catch(err){
        res.status(500).json({
            message: 'Не вийшло авторизуватися',
        
        
        }
        )
    }


};

export const getMe = async(req, res)=>{
    try{
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({
                message: 'Користувач не знайдений',
            })
        }
        const {passwordHash, ...userData} = user._doc;

        res.json({userData
        })
        
    } 
    catch(error){
        res.status(500).json({
            message: 'Не вдалось отримати дані',
        
        
        })
    }
};