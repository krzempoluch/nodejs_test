angular.module('projectMWD', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
  .state('mwd', {
	  url: '/mwd',
	  templateUrl: '/mwd.html',
	  controller: 'MwdCtrl'
	});
  
  $urlRouterProvider.otherwise('home');
}])
//.factory('posts', [ '$http', function($http) {
//	var o = {
//		posts : []
//	};
//	o.getAll = function() {
//		return $http.get('/posts').success(function(data) {
//			angular.copy(data, o.posts);
//		});
//	};
//	o.create = function(post) {
//		return $http.post('/posts', post).success(function(data) {
//			o.posts.push(data);
//		});
//	};
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
//	return o;
//} ])
.controller('MainCtrl',[ 
'$scope',
function($scope, posts) {
			$scope.test = 'Hello world!';
			$scope.posts = ['post1'];
			$scope.addPost = function() {
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
;