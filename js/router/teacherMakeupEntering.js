;(function (window, undefined) {
    'use strict';
    // 教师端补考录入模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.makeupEntering', {
            url: '/makeupEntering',
            templateUrl: 'tpl/home/makeupEntering/makeupEntering.html',
            controller: teacherMakeupEntering_makeupEnteringController,
            ncyBreadcrumb: {
                label: '首页 / 补考成绩录入'
            }
        }).state('home.common.makeupEnteringBatch', {
            url: '/makeupEnteringBatch/:params',
            templateUrl: 'tpl/home/makeupEntering/makeupEnteringBatch.html',
            controller: teacherMakeupEntering_makeupEnteringBatchController,
            ncyBreadcrumb: {
                label: '首页 / 补考成绩录入 / 批量成绩录入',
            }
        });
    }]);
})(window);


