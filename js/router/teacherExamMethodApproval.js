;(function (window, undefined) {
    'use strict';
    // 教师端补考录入模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.examMethodApproval', {
            url: '/examMethodApproval',
            templateUrl: 'tpl/home/examMethodApproval/index.html',
            controller: teacherExamMethod_examMethodApprovalController,
            ncyBreadcrumb: {
                label: '首页 / 考试方式申请'
            }
        }).state('home.common.ensureExamMethod', {
            url: '/ensureExamMethod/:params',
            templateUrl: 'tpl/home/examMethodApproval/ensureExamMethod.html',
            controller: teacherExamMethod_ensureExamMethodController,
            ncyBreadcrumb: {
                label: '首页 / 考试方式申请 / 确认考试方式',
            }
        });
    }]);
})(window);


