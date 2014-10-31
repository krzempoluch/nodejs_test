angular.module('projectMWD', ['ui.router', 'ui.bootstrap'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
    	  postPromise: ['projects', function(projects){
    	    return projects.getAll();
    	  }]
    	}
    })
  .state('mwd', {
	  url: '/mwd',
	  templateUrl: '/mwd.html',
	  controller: 'MwdCtrl'
	});
  
  $urlRouterProvider.otherwise('home');
}])
.factory('projects', [ '$http', function($http) {
	var o = {
		projects : []
	};
	o.getAll = function() {
		return $http.get('/projects').success(function(data) {
			angular.copy(data, o.projects);
		});
	};
	o.create = function(post) {
		return $http.post('/projects', post).success(function(data) {
			o.projects.push(data);
		});
	};
//	o.upvote = function(post) {
//		  return $http.put('/posts/' + post.id + '/upvote')
//		    .success(function(data){
//		      post.upvotes += 1;
//		    });
//		};
//	o.get = function(id) {
//		return $http.get('/posts/' + id).then(function(res){
//			return res.data;
//		});
//	};
//	o.addComment = function(id, comment) {
//		  return $http.post('/posts/' + id + '/comments', comment);
//		};
	return o;
} ])
.controller('MainCtrl',[ 
'$scope',
'projects',
function($scope, projects) {
			$scope.projects = projects.projects;
			$scope.addProject = function() {
				if ($scope.title === '') {
					return;
				}
				$scope.posts.push({
					title : $scope.title,
					link : $scope.link,
					upvotes : 0,
				});
				$scope.title = '';
				$scope.link = '';
			};
		} ])
.controller('MwdCtrl', [
'$scope',
function($scope, posts, post){
	
}])
.controller('DatepickerCtrl', function ($scope) {
	  $scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };


	  $scope.toggleMin = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	  };

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
	});