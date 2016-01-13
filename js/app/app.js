'use strict';

/* Main Dependencies */
var axbApp = angular.module('axbApp', [
	'ui.router',
	'firebase',
	'axbControllers',
	'axbServices',
	'axbDirectives'
]);

/* Routes */
axbApp.config(
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/dashboard');
		$stateProvider
			.state('dashboard', {
				url: "/dashboard",
				templateUrl: "templates/dashboard/dashboard.html",
				controller: 'DashboardController'
			})
			.state('customer', {
				abstract: true,
				url: "/customer",
				templateUrl: "templates/customer/customer.html",
				controller: 'CustomerController'
			})
			.state('customer.check-in', {
				url: "/check-in",
				templateUrl: "templates/customer/check-in.html",
				data: {
					subclass: 'check-in'
				}
			})
			.state('customer.vip-exclusive', {
				url: "/vip-exclusive",
				templateUrl: "templates/customer/vip-exclusive.html",
				data: {
					subclass: 'vip-exclusive'
				},
				controller: 'SubpageController'
			})
			.state('customer.authenticity', {
				url: "/authenticity",
				templateUrl: "templates/customer/authenticity.html",
				data: {
					subclass: 'authenticity'
				},
				controller: 'SubpageController'
			}).
			state('customer.shop-the-look', {
				url: "/shop-the-look",
				templateUrl: "templates/customer/shop-the-look.html",
				data: {
					subclass: 'shop-the-look'
				},
				controller: 'SubpageController'
			}).state('customer.virtual-stylist', {
				url: "/virtual-stylist",
				templateUrl: "templates/customer/virtual-stylist.html",
				data: {
					subclass: 'virtual-stylist'
				},
				controller: 'SubpageController'
			}).state('customer.weather-select', {
				url: "/weather-select",
				templateUrl: "templates/customer/weather-select.html",
				data: {
					subclass: 'weather-select'
				},
				controller: 'SubpageController'
			}).state('customer.shoptelligence', {
				url: "/shoptelligence",
				templateUrl: "templates/customer/shoptelligence.html",
				data: {
					subclass: 'shoptelligence'
				},
				controller: 'SubpageController'
			});
	}
).run(function($rootScope, $state, localUserService) {
		/*
		Init Local User and Redirect if not a saved user
		 */
		$rootScope.$on('$stateChangeStart', function(e, toState) {
			// localUserService.restoreState();
			//if(
			//	~ toState.name.indexOf('customer')
			//	&& toState.name !== 'customer.check-in'
			//	&& !localUserService.exists()
			//) {
			//	e.preventDefault();
			//	$state.go('customer.check-in');
			//}
		});
		// For persistent user store -> see services/userService
		//$rootScope.$on("$stateChangeStart", function() {
		//	if(sessionStorage.restorestate == "true") {
		//		$rootScope.$broadcast('restorestate');
		//		sessionStorage.restorestate = false;
		//	}
		//});
		//// look into checked out function here for users navigating away from page
		//window.onbeforeunload = function() {
		//	$rootScope.$broadcast('savestate');
		//};
	});