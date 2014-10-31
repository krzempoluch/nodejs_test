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
var Project = dao.model('Project');
var MWD = dao.model('MWD');

router.get('/projects', function(req, res, next) {
	Project.findAll().complete(function(err, posts) {
		if (err) {
			return next(err);
		}
		res.json(posts);
	});
});
router.post('/projects', function(req, res, next) {
	  var project = Project.build(req.body)
	  project
	  .save()
	  .complete(function(err, project){
	    if(err){ 
	    	console.log(err)
	    	return next(err); 
	    }
	    res.json(project);
	  });
	});
router.get('/mwds', function(req, res, next) {
	MWD.findAll().complete(function(err, mwds) {
		if (err) {
			return next(err);
		}
		res.json(mwds);
	});
});
router.post('/mwds', function(req, res, next) {
	  var mwd = MWD.build(req.body)
	  mwd
	  .save()
	  .complete(function(err, mwd){
	    if(err){ 
	    	console.log(err)
	    	return next(err); 
	    }
	    res.json(mwd);
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