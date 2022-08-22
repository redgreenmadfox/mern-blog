import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts receiving error'
    })
  }
}

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    
    PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      $inc: { viewsCount: 1 },
    }, {
      returnDocument: 'after'
    },
    (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
        message: 'Posts receiving error'
      })}

      if (!doc) {
        return res.status(404).json({
          message: 'Post not found'
        })
      }

      res.json(doc)
    }).populate('user')
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts receiving error'
    })
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(3).exec();
    const tags = posts.map(post => post.tags).flat().slice(0, 3)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Tags receiving error'
    })
  }
}

export const removePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    
    PostModel.findOneAndDelete({
      _id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
        message: 'Posts deleting error'
      })}

      if (!doc) {
        return res.status(404).json({
          message: 'Post not found'
        })
      }

      res.json({
        success: true,
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts receiving error'
    })
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    })

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Post creation error'
    })
  }
}

export const updateById = async (req, res) => {
  try {
    const postId = req.params.id;
    
    PostModel.updateOne({
      _id: postId,
    },{
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
    })

    res.json({
      success: true
    })
  } catch (err) {

  }
}
