;(function (window, undefined) {
    'use strict';
    // 教师端课表查询模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.scheduleQuery', {
            url: '/scheduleQuery',
            templateUrl: 'tpl/home/scheduleQuery/index.html',
            controller: teacherScheduleQuery_scheduleQueryController,
            ncyBreadcrumb: {
                label: '首页 / 补考成绩录入'
            }
        });
    }]);
})(window);


