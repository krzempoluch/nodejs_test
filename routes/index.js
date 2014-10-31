var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title : 'Flapper-News'
	});
});

module.exports = router;

var dao = require('../models/projectDao.js');
var Post = dao.model('Post');
var Comment = dao.model('Comment');

router.get('/posts', function(req, res, next) {
	Post.findAll().complete(function(err, posts) {
		if (err) {
			return next(err);
		}
		res.json(posts);
	});
});
router.post('/posts', function(req, res, next) {
	  var post = Post.build(req.body)
	  post
	  .save()
	  .complete(function(err, post){
	    if(err){ 
	    	console.log(err)
	    	return next(err); 
	    }
	    res.json(req.body);
	  });
	});
router.param('post', function(req, res, next, postId) {
	  Post
	  .find({ where: {id: postId}, include: [Comment]})
	  .complete(function (err, post){
	    if (err) { return next(err); }
	    if (!post) { return next(new Error("can't find post")); }

	    req.post = post;
	    return next();
	  });
	});
router.get('/posts/:post', function(req, res) {
	  res.json(req.post);
	});
router.put('/posts/:post/upvote', function(req, res, next) {
	  var updatedPost = req.post;
	  var newUpvotes = updatedPost.upvotes;
	  newUpvotes=newUpvotes+1;
	  updatedPost.updateAttributes({
		  upvotes: newUpvotes
	  }).complete(function (err, post){
		  if (err) { return next(err); }
		  res.json(updatedPost);
	  });
	});
router.post('/posts/:post/comments', function(req, res, next) {
	  var comment = Comment.build(req.body);
	  var post = req.post;
	  comment
	  .save()
	  .complete(function(err, comment){
	    if(err){ return next(err); }
	    post.addComments(comment);
	    res.json(comment);
	    });
	});