angular.module('projectMWD', ['ui.router', 'ui.bootstrap', 'ui.grid'])
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
	  controller: 'MwdCtrl',
	  resolve: {
    	  postPromise: ['mwds', function(mwds){
    	    return mwds.getAll();
    	  }]
    	}
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
.factory('mwds', [ '$http', function($http) {
	var o = {
			mwds : []
		};
	o.getAll = function() {
		return $http.get('/mwds').success(function(data) {
			angular.copy(data, o.mwds);
		});
	};
	return o;
} ])
.controller('MainCtrl',[ 
'$scope',
'$modal',
'projects',
function($scope, $modal, projects) {
	$scope.projects = projects.projects;
	$scope.gridOptions = {
			  enableScrollbars: false,
			  data: $scope.projects
			};
	$scope.openAdd = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'addProject.html',
	      controller: 'ModalCtrl'
	      })
	};
} ])
.controller('MwdCtrl', [
'$scope',
'mwds',
function($scope, mwds){
	$scope.mwds = mwds.mwds;
	$scope.gridOptions = {
			  enableScrollbars: false,
			  data: $scope.mwds
			};
}])
.controller('ModalCtrl', [
'$scope',
'$modalInstance',
'projects',
function($scope, $modalInstance, projects) {
	$scope.today = function() {
		$scope.dt = new Date();
	};
	$scope.today();

	$scope.clear = function() {
		$scope.dt = null;
	};

	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();

	$scope.openDP = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};

	$scope.dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	};

	$scope.formats = [ 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ];
	$scope.format = $scope.formats[0];
	
	$scope.addProject = function() {
		if ($scope.name === '') {
			return;
		}
		projects.create({
			name : $scope.name,
			jira_URL : $scope.jira_URL,
			start_date : $scope.start_date
		});
		$scope.name = '';
		$scope.jira_URL = '';
		$scope.start_date = '';
		
		$modalInstance.close();
	};
}]);