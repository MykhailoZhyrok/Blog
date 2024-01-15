import PostModel from "../models/Post.js"

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const removeDoc = await PostModel.findOneAndDelete(
            {
                _id: postId
            }
        );
        if (!removeDoc) {
            return res.status(404).json({
                message: "Стаття не видалена",
            });
        }
        res.json({
            succes: true,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не вдалося видалити статтю',
        });
    }
}



export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedDoc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { new: true }
        ).populate('user');

        if (!updatedDoc) {
            return res.status(404).json({
                message: "Стаття не знайдена",
            });
        }

        res.json(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не вдалося отримати або оновити статтю',
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(
            posts)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалося отримати'
        })

    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        })

        const post = await doc.save();

        res.json({
            post,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалося запостити'
        })

    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        const updatedPatchDoc = await PostModel.updateOne(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        );
        if (!updatedPatchDoc) {
            return res.status(404).json({
                message: "Стаття не оновлена",
            });
        }
        res.json({
            succes: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не вдалося оновити'
        })

    }

}