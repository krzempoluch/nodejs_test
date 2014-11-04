var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', {
		title : 'Projekty'
	});
});

module.exports = router;

var dao = require('../models/projectDao.js');
var Project = dao.model('Project');
var MWD = dao.model('MWD');

MWD.addMwdsToProject = function(mwds, project, next) {
	var ids = [];
	for (var i = 0; i < mwds.length; i++) {
		ids.push(mwds[i].id);
	}
	MWD.findAll({
		where : {
			id : ids
		}
	}).complete(function(err, mwds) {
		if (err) {
			next(err);
		}
		if (mwds) {
			project.addMWDs(mwds)
			.complete(function(){
				next();
			});
		}
	});
};
Project.removeChildrens = function(project, mwds, next){
	for(var i=0;i<mwds.length;i++){
		project
		.removeMWD(mwds[i])
		.complete(function(){
			Project
			.find({where: {id: project.id}, include: [MWD]})
			.complete(function (err, projectUpdate){
			    if (err) { return next(err); }
			    if (!projectUpdate) { return next(new Error("can't find project")); }
			    if(projectUpdate.MWDs.length<1){
			    	next();
			    }
			  });
		});
	}
}

router.get('/projects', function(req, res, next) {
	Project
	.findAll({include: [MWD]})
	.complete(function(err, posts) {
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
	    MWD.addMwdsToProject(req.body.mwds, project,
	    	function(){
	  			res.json(updateProject); 
	    });
	  });
	});
router.get('/mwds', function(req, res, next) {
	MWD
	.findAll()
	.complete(function(err, mwds) {
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
router.param('mwd', function(req, res, next, mwdId) {
	  var mwd = MWD
	  .find({ where: {id: mwdId}})
	  .complete(function (err, mwd){
	    if (err) { return next(err); }
	    if (!mwd) { return next(new Error("can't find mwds")); }
	    req.mwd = mwd;
	    return next();
	  });
	});
router.get('/mwd/:mwd', function(req, res) {
	  res.json(req.mwd);
	});
router.param('project', function(req, res, next, projectId) {
	  var project = Project
	  .find({ where: {id: projectId}, include: [MWD]})
	  .complete(function (err, project){
	    if (err) { return next(err); }
	    if (!project) { return next(new Error("can't find project")); }
	    req.project = project;
	    return next();
	  });
	});
router.get('/projects/:project', function(req, res) {
	  res.json(req.project);
	});
router.post('/projects/:project/edit', function(req, res) {
	  var updateProject = req.project;
	  updateProject.updateAttributes({
		  name: req.body.name,
		  jira_URL: req.body.jira_URL,
		  start_date: req.body.start_date
	  }).complete(function (err, project){
		  if (err) { return next(err); }
		  var mwds = updateProject.MWDs;
		  if(mwds.length<1){
			  MWD.addMwdsToProject(req.body.mwds, updateProject,
					  function(){
				  		res.json(updateProject); 
				  		return;
			  });
		  }
		  Project.removeChildrens(updateProject, mwds, function(){
			  MWD.addMwdsToProject(req.body.mwds, updateProject,
					  function(){
				  		return res.json(updateProject); 
			  });
		  });
	  });
	});