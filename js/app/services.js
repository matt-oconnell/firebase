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
			console.log('initting');
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
			console.log('saving user');
		    if(firebaseUserService.user) {
				console.log('saving sb user');
				firebaseUserService.user = angular.extend(firebaseUserService.user, $scope.user);
				firebaseUserService.user.$save();
			}
			localUserService.model = angular.extend(localUserService.model, $scope.user);
			localUserService.saveState();
		},
		setAction: function($scope, actionKey) {
			console.log('happening?');
		    $scope.user.action = actions[actionKey] || actionKey;
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
axbServices.factory('localUserService', function($rootScope) {

	// Data Model
	var base = {
		key: false, // key for firebase
		firstName: '',
		lastName: '',
		email: '',
		vip: false,
		shopLook: false,
		virtualStylist: false,
		shoptelligence: false,
		authentication: false,
		weatherSelect: false,
		action: '',
		requestedItem: null
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
axbServices.factory('firebaseUserService', function($firebaseObject, $firebaseArray) {
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
				console.log(modelData);
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


//setValue: function(user, value) {
//	var userIndex = user.model.i;
//
//	switch(value) {
//		case 'vip':
//			service.array[userIndex].action = 'Checking VIP Coupon';
//			break;
//		case 'shopLook':
//			service.array[userIndex].action = 'Shopping the look';
//			break;
//		case 'virtualStylist':
//			service.array[userIndex].action = 'Using the virtual stylist';
//			break;
//		case 'weatherSelect':
//			service.array[userIndex].action = 'Checking our weather reccomendations';
//			break;
//		case 'shoptelligence':
//			service.array[userIndex].action = 'Using Shoptelligence';
//			break;
//	}
//
//	// Local/Firebase
//	service.array[userIndex][value] = true;
//	service.array.$save(userIndex);
//	// Session
//	user.model[value] = true;
//	user.SaveState();
//},
//setItemStatus: function(user, statusKey, itemKey) {
//	var userIndex = user.model.i;
//	var email = service.array[userIndex].email;
//	var items = {
//		wool: 'Wool Cardigan and Tiered Skirt'
//	};
//	var statuses = {
//		'try': 'Waiting in to try on ' + items[itemKey],
//		'buy store': 'Prepare for register purchase: ' + items[itemKey],
//		'buy ship': 'Ship' + items[itemKey] + ' to ' + email
//	};
//
//	service.array[userIndex].action = statuses[statusKey];
//
//	// Local/Firebase
//	service.array.$save(userIndex);
//	// Session
//	user.SaveState();
//}
