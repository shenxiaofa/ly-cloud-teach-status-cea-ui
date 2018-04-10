;(function (window, undefined) {
    'use strict';
    // 教师端监考安排
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.invigilateArrange', {
            url: '/invigilateArrange',
            templateUrl: 'tpl/home/invigilateArrange/index.html',
            controller: teacherInvigilateArrange_invigilateArrangeController,
            ncyBreadcrumb: {
                label: '首页 / 监考安排'
            }
        })
		.state('home.common.invigilateArrangeNumber', {
            url: '/invigilateArrange/studentList/:params',
            templateUrl: 'tpl/home/invigilateArrange/studentList.html',
            controller: teacherInvigilateArrange_invigilateArrangeStudentController,
            ncyBreadcrumb: {
                label: '首页/ 监考安排 / 考生名单'
            }
        });
    }]);
})(window);


