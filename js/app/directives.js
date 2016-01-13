'use strict';

var axbDirectives = angular.module('axbDirectives', []);

// Sidebar Navigation
axbDirectives.directive('axbSidebar',
	function() {
		return {
			restrict: 'A',
			scope: true,
			templateUrl: 'templates/directives/sidebar.html'
		}
	});

// Watch for finished ngRepeat
axbDirectives.directive('endRepeat', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope) {
			if(scope.$last === true) {
				$timeout(function() {
					scope.$emit('ngRepeatFinished');
				});
			}
		}
	}
});

// Swiper
axbDirectives.directive('swiper', function() {
	return {
		restrict: 'A',
		templateUrl: 'templates/directives/swiper.html',
		link: function(scope) {
			scope.items = [
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				},
				{
					img: null,
					name: 'name',
					price: '$0.00'
				}
			];
			scope.clicked = function(index) {
				alert(index);
			};
			scope.$on('ngRepeatFinished', function() {
				new Swiper('.swiper-container', {
					slidesPerView: 3,
					initialSlide: 3,
					watchActiveIndex: true,
					centeredSlides: true,
					resizeReInit: true,
					onSlideClick: function(swiper) {
						angular
							.element(swiper.clickedSlide)
							.scope()
							.clicked(
							angular.element(swiper.clickedSlide)
								.scope().$index
						)
					},
					onSlideChangeEnd : function(swiper) {
						console.log(swiper.activeIndex);
					}
				});
			});
		}
	}
});


