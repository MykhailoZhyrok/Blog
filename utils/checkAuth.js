import jwt from 'jsonwebtoken';

export default (req, res, next)=>{
    const token = (req.headers.authorization||'').replace(/Bearer\s?/, '');
    console.log(token)
    if(token){
        try{
            const decoded = jwt.verify(token, "secretCode");
            req.userId = decoded._id;
            next();
        }
        catch(errors){
            return res.status(402).json({
                message: 'Не доступна'
            })
        }
    }else{
        return res.status(403).json({
            message: 'Не доступний токен',
            data: null
        })
    }
    
    
}