;(function (window, undefined) {
    'use strict';
    hiocsApp.config(['$stateProvider', '$urlRouterProvider', 'app', function ($stateProvider, $urlRouterProvider, app) {
        $urlRouterProvider.when('', '/login');
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'tpl/login/login.html',
            controller: loginController
        }).state('logout', {
            url: '/logout',
            controller: logoutController
        }).state('home', {
            url: '/home',
            templateUrl: 'tpl/home.html',
            controller: function(){
                
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('teacherIndex', {
            url: '/teacher-index',
            templateUrl: 'tpl/home/teacherIndex.html',
            controller: teacher_teacherIndexController
        }).state('home.common', {
            url: '/common?moduleId&ncyBreadcrumbLabel',
            templateUrl: 'tpl/common.html',
            resolve: {
                permissionData:  ['$stateParams', 'system_permissionManageService', 'alertService', 'app',
                    function($stateParams, system_permissionManageService, alertService, app){
                        // 若是调试模式，则返回 null
                        if (app.debug) {
                            return null;
                        }
                        return system_permissionManageService.findPrivilege({
                            fwbh: $stateParams.moduleId // 服务编号
                        }, function (error, message, data) {
                            if (error) {
                                alertService(message);
                                return [];
                            }
                            if (data && data.length > 0) {
                                return data;
                            }
                            return [];
                        });
                    }
                ]
            },
            controller: ['$scope', '$rootScope', '$localStorage', '$stateParams', 'permissionData', function($scope, $rootScope, $localStorage, $stateParams, permissionData){
                if (!app.debug) {
                    // 将服务权限存入 $localStorage
                    if (!$localStorage.__permission__by) {
                        $localStorage.__permission__by = {};
                    }
                    if (!$localStorage.__permission__by[$stateParams.moduleId]) {
                        $localStorage.__permission__by[$stateParams.moduleId] = permissionData;
                    }
                    $rootScope.$log.debug("load permission ...");
                    $rootScope.$log.debug($localStorage.__permission__by);
                }
                $scope.ncyBreadcrumbLabel = $stateParams.ncyBreadcrumbLabel; // 动态改变面包屑
            }],
            ncyBreadcrumb: {
                label: '{{ncyBreadcrumbLabel}}',
            }
        });
    }]);
})(window);


