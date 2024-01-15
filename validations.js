import {body} from 'express-validator';


export const regiterValidations = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isURL(),

];
export const loginValidations = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
    

];

export const postCreateValidations = [
    body('title', 'Введіть заголовок статті').isLength({min:3}).isString(),
    body('text', 'Введіть текст статті').isLength({min:10}).isString(),
    body('tags', 'Невірний формат тегів').optional().isString(),
    body('imageUrl', 'Недийсне посилання на картинку').optional().isString(),

]

