import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const postComment = async (req, res) => {
    try {
        const postId = req.body.id;
        const comment = req.body.comment;
        const user = req.userId
        const newComment = new Comment({ comment, user, postId});
        await newComment.save();
        res.json({
            newComment,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не вдалося запостиити комент',
        });
    }
}


export const getComments = async(req, res)=>{
    try {
        const postId = req.params.id;
        const comment = await Comment.find({ postId }).populate('user').exec();
        res.json(
            comment)
        }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалося отримати'
        })

    }
}