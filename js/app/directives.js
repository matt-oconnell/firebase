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
			scope.foos = new Array(20);
			scope.clicked = function(index) {
				alert(index)
			};
			scope.$on('ngRepeatFinished', function() {
				var mySwiper = new Swiper('.swiper-container', {
					slidesPerView:'auto',
					watchActiveIndex: true,
					centeredSlides: true,
					paginationClickable: true,
					resizeReInit: true,
					keyboardControl: true,
					grabCursor: true,
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


