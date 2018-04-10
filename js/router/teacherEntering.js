;(function (window, undefined) {
    'use strict';
    // 教师端录入模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.entering', {
            url: '/entering',
            templateUrl: 'tpl/home/entering/entering.html',
            controller: teacherEntering_enteringController,
            ncyBreadcrumb: {
                label: '首页 / 正考成绩录入'
            }
        }).state('home.common.enteringBatch', {
            url: '/enteringBatch/:params',
            templateUrl: 'tpl/home/entering/enteringBatch.html',
            controller: teacherEntering_enteringBatchController,
            ncyBreadcrumb: {
                label: '首页 / 正考成绩录入 / 批量成绩录入',
            }
        });
    }]);
})(window);


