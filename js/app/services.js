var axbServices = angular.module('axbServices', []);

/*
 User Service. Abstracts both Firebase and LocalStorage user
 */
axbServices.factory('userService', function(
	$rootScope,
	$state,
	$window,
	localUserService,
	firebaseUserService,
	actions
) {
	var service = {
		init: function($scope) {
			// Initialize User Services
			localUserService.restoreState();
			$scope.user = localUserService.model;

			// Redirect to Check In if user is non-existant
			if(service.exists()) {
				var key = $scope.user.key;
				firebaseUserService.assignUser(key);
				console.log('exists, key:', key);
			} else {
				console.log('doesnt exist');
			}
		},
		resetFB: function() {
		    firebaseUserService.reset();
		},
		// Is the user stored in LS?
		exists: function() {
		    return localUserService.exists();
		},
		removeUser: function($scope) {
		    $scope.user = {};
			firebaseUserService.user.$remove();
			localUserService.clearState();
			$scope.toggleCustom();
			// $state.reload();
		},
		// Add User.
		addUser: function($scope, redirect) {
			firebaseUserService.init($scope.user);
			$scope.user.key = firebaseUserService.user.$id;
			service.setAction($scope, 'Just checked in');
			service.saveUser($scope);
			$state.go(redirect);
		},
		saveUser: function($scope) {
		    if(firebaseUserService.user) {
				firebaseUserService.user = angular.extend(firebaseUserService.user, $scope.user);
				firebaseUserService.user.$save();
			}
			localUserService.model = angular.extend(localUserService.model, $scope.user);
			localUserService.saveState();
		},
		setAction: function($scope, actionKey) {
		    $scope.user.action = actions[actionKey] || actionKey;
			service.saveUser($scope);
		},
		setVisited: function($scope, subclass) {
			var key = subclass.replace(/-([a-z])/g, function(g) {
				return g[1].toUpperCase();
			});
		    $scope.user.visited[key] = true;
			service.saveUser($scope);
		}
	};

	return service;
});

/*
 Default customer page actions
 */
axbServices.factory('actions', function() {
	return {
		'check-in': 'Currently checking in',
		'vip-exclusive': 'Viewing VIP Coupon',
		'authenticity': 'Viewing authenticity',
		'shop-the-look': 'Shopping the look',
		'virtual-stylist': 'Virtual stylist stuff',
		'weather-select': 'Weather select',
		'shoptelligence': 'Shoptelligence'
	}
});


/*
 Local User Service
 */
axbServices.factory('localUserService', function(
		$rootScope
	) {
	// Data Model
	var base = {
		key: false, // key for firebase
		firstName: '',
		lastName: '',
		email: '',
		action: '',
		requestedItem: null,
		visited: {
			vipExclusive: false,
			shopTheLook: false,
			virtualStylist: false,
			shoptelligence: false,
			authenticity: false,
			weatherSelect: false
		}
	};

	var service = {
		// Model will be current state
		model: base,
		// Template is original state
		modelTemplate: angular.extend({}, base),
		saveState: function() {
			localStorage.localUserService = angular.toJson(this.model);
		},
		restoreState: function() {
			var ls = localStorage.localUserService;
			ls = ls === 'undefined' || !ls ? base : ls;
			this.model = angular.fromJson(ls);
		},
		clearState: function() {
			console.log(this.modelTemplate);
			this.model = this.modelTemplate;
			this.saveState();
		},
		exists: function() {
			return this.model.key;
		}
	};

	$rootScope.$on("savestate", service.saveState);
	$rootScope.$on("restorestate", service.restoreState);
	$rootScope.$on("clearstate", service.clearState);

	return service;

});

/*
 Firebase Intergration Service
 */
axbServices.factory('firebaseUserService', function(
		$firebaseObject,
		$firebaseArray
	) {
		var fbRef = new Firebase('https://burning-heat-6184.firebaseio.com/users/');
		return {
			user: null,
			assignUser: function(key) {
				this.setUser(fbRef.child(key));
			},
			getUsers: function() {
			    return $firebaseArray(fbRef);
			},
			init: function(modelData) {
				this.setUser(fbRef.push(modelData));
				return this.user.$id;
			},
			setUser: function(userRef) {
			    this.user = $firebaseObject(userRef);
			},
			reset: function() {
			    $firebaseObject(fbRef).$remove();
			}
		};
	}
);

/*
 Forecast IO API Service
 */
axbServices.factory('forecastIOService', function($http) {
		var apiUrl = 'https://api.forecast.io/forecast/';
		var key = '50efc01999c6c329ae64ade7449047fe/';
		var lat = '40.748441';
		var lon = '-73.985793';
		var url = apiUrl + key + lat + ',' + lon;
		return {
			call: function(callback) {
				$http({
					method: 'GET',
					url: url
				}).success(callback);
			}
		}
	}
);
