'use strict';

var axbControllers = angular.module('axbControllers', []);

axbControllers.controller('DashboardController',
	function($scope, firebaseUserService) {
		$scope.users = firebaseUserService.getUsers();
	});

axbControllers.controller('CustomerController',
	function($scope, $state, userService) {
		
		//userService.resetFB();return;

		// Toggle Sidebar Menu
		$scope.toggleCustom = function() {
			$scope.toggle = !$scope.toggle;
		};

		// Subclass
		$scope.subclass = '';
		$scope.$on('$stateChangeSuccess', function(e, to) {
			$scope.toggle = false;
			$scope.subclass = to.data.subclass;
		});

		// User Services
		userService.init($scope);

		$scope.userExists = function() {
		    return userService.exists();
		};

		$scope.removeUser = function() {
			userService.removeUser($scope);
		};

		$scope.addUser = function() {
			userService.addUser($scope, 'customer.vip-exclusive');
		};

		$scope.setAction = function($scope, actionKey) {
		    userService.setAction($scope, actionKey);
		};

		$scope.setVisited = function($scope, subclass) {
		    userService.setVisited($scope, subclass);
		};

	});

axbControllers.controller('SubpageController',
	function($scope, $state, forecastIOService) {
		
		// If no user is found, redirect to check in
		if(!$scope.userExists()) {
			$state.go('customer.check-in');
		}

		// Apply subclass action. i.e. "Shopping the Look"
		var sc = $state.current.data.subclass;
		$scope.setAction($scope, sc);

		// Apply visited action
		$scope.setVisited($scope, sc);
		
		// Move to directive
		if($state.current.name == 'customer.weather-select') {
			$scope.weather = {};
			forecastIOService.call(function(data) {
				$scope.weather = data.currently;
				$scope.weather.temperature = Math.round($scope.weather.temperature);
			});
		}

	});