;(function (window, undefined) {
    'use strict';

    window.logoutController = function ($compile, $scope, $uibModal, $timeout, $rootScope, $localStorage, $cookies, $state, logoutService, alertService, $interval) {
        $rootScope.showLoading = true; // 开启加载提示
        // 登出
        logoutService.logout(function (error, message) {
			$("body").fadeOut();
			$timeout(function(){
	            $rootScope.showLoading = false; // 关闭加载提示
	            if (error) {
	                alertService(message);
	            }
	            // 清除 $localStorage 数据
	            $localStorage.$reset();
	            // 清除 session 检查定时器
	            $interval.cancel($rootScope.stopSessionCheck);
	            // 跳转到登录页
	            $state.go('login');
            },500);
			$("body").fadeIn(800);
        });
    };
    logoutController.$inject = ['$compile', '$scope', '$uibModal', '$timeout', '$rootScope', '$localStorage', '$cookies', '$state', 'logoutService', 'alertService', '$interval'];

})(window);
