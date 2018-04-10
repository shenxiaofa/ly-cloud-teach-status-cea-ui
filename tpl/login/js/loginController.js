;(function (window, undefined) {
    'use strict';

    window.loginController = function ($interval, $scope, $timeout, $rootScope, $cookies, $localStorage, $state, $uibModal, loginService, logoutService, alertService, app) {
        
        // 登录模块
        $scope.teacherModule = 'teacher-login';
        $scope.managerModule = 'manager-login';
        $scope.studentModule = 'student-login';

        // 更新登录验证码
        $scope.teacherVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.teacherModule + "&d=" + new Date()*1;
        $scope.managerVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.managerModule + "&d=" + new Date()*1;
        $scope.studentVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.studentModule + "&d=" + new Date()*1;
        $scope.updateVrifyCode = function (pattern) {
            switch (pattern) {
                case $scope.teacherModule:
                    $scope.teacherVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.teacherModule + "&d=" + new Date()*1;
                    break;
                case $scope.managerModule:
                    $scope.managerVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.managerModule + "&d=" + new Date()*1;
                    break;
                case $scope.studentModule:
                    $scope.studentVrifyCode = app.api.address + "/api/verificationCode?pattern=" + $scope.studentModule + "&d=" + new Date()*1;
            }
        }

        $scope.teacherCaptcha;
        $scope.managerCaptcha;
        var timeDiff = 0; // 服务器与本地时间差(此处忽略请求时间的误差)

        // 重定向页面
        var redirectPage = function (user){
            if (!user || !user.userName) {
                return;
            }
            $rootScope.user = user;
			$rootScope.photoPath = $scope.prefix + "/student-status/student-info/photo";
            // 若本来是登录页面，则跳转到首页
            if ($rootScope.returnState && $rootScope.returnState.name && $rootScope.returnState.name.indexOf('login') == 0) {
                $rootScope.returnState = {
                    name: 'home.index',
                    params: {}
                }
            }
            if(user.userType == app.user.type.teacher){
                switch(user.loginPattern) {
                    case $scope.teacherModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
//             	            	$state.go('teacher.index');
	                            $state.go('teacherIndex');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
                    case $scope.managerModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
                            	$state.go('home.index');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
                };
                return;
            } 
            else{ 	//学生
                switch(user.loginPattern) {
                    case $scope.studentModule:
                        if(!$rootScope.returnState){
							$("body").fadeOut();
							$timeout(function(){
//	                            $state.go('student.index');
	                            $state.go('studentIndex');
				            },500);  
							$("body").fadeIn(800);
                        } else {
                            $state.go($rootScope.returnState.name, $rootScope.returnState.params);
                        }
                        break;
            	}
            }
        }

        // 检测登录状态
        loginService.checkLoginStatus(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            if(data == app.user.loginStatus.login){
                // 若登录为登录状态,将自动跳转到首页
                var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
                redirectPage(user);
                return;
            }
            // 初始化验证码
            initGeetestCode(loginService, $scope, alertService);
        });

        //普通登录
        $scope.simpleLogin= function(userName,password, vrifyCode,valid,loginPattern){
            $scope.loginPattern = loginPattern;
            if(!valid){
                return;
            }
            var param = {
                userName: userName,
                timestamp: new Date().getTime() + timeDiff,
                token: $.base64.encode(password),
                vrifyCode: vrifyCode,
                pattern: loginPattern
            };
            $rootScope.showLoading = true; // 开启加载提示
            loginService.login(param, function (error, message, data) {
                $rootScope.showLoading = false; // 关闭加载提示
                if (error) {
                    alertService(message);
                    // 更新验证码
                    $scope.updateVrifyCode(loginPattern);
                    return;
                }
                // 清除 $localStorage 数据
                $localStorage.$reset();
                // 返回的是角色编号列表，将存入根作用域
                if (data) {
                    $localStorage.__roles__by = data;
                }
                // 定时判断 session 是否过期，若过期，则跳到登录页
                $rootScope.$emit('sessionCheck');
                // 跳转到首页
                var user = angular.fromJson(angular.fromJson($cookies.getObject("user")));
                $rootScope.$log.debug(user);
                redirectPage(user);
            });
        }
    };
    loginController.$inject = ['$interval', '$scope', '$timeout', '$rootScope', '$cookies', '$localStorage', '$state', '$uibModal', 'loginService', 'logoutService', 'alertService', 'app'];

})(window);
