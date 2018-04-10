;(function (window, undefined) {
    'use strict';
    window.teacherInvigilateArrange_invigilateArrangeStudentController = function ($scope, $http, $stateParams, $state, $timeout, $uibModal, $cookies, $compile, $rootScope, $window, alertService, app) {
		
    	// 表格的高度
        $scope.table_height = $window.innerHeight - 200;
        
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
		$scope.semester = stateParams.semester;
		$scope.courseName = stateParams.courseName;
		$scope.dept = stateParams.dept;
		$scope.credit = stateParams.credit;
//		$scope.credit = stateParams.credit;		// 试卷闭卷
		$scope.startEndTime = stateParams.startTime + "    ~    " + stateParams.endTime;
		
		console.log(stateParams);
		
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.invigilateArrangeStudentList);
	    };
	    
		$scope.invigilateArrangeStudentListTable = {
            url: app.api.address + '/exam/formalManage/examineeInfo?id=' + stateParams.id,
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
//			showColumns: true,
//			showRefresh: true,
			onLoadSuccess: function() {
				$compile(angular.element('#invigilateArrangeStudentListTable').contents())($scope);
			},
            responseHandler:function(response){
                var data = {
                    rows : response.data.rows,
                    total : response.data.total
                }
                return data;
            },
			clickToSelect: true,
			columns: [
                {field:"studentNum",title:"学号",align:"center",valign:"middle",width:"10%"},
                {field:"studentName",title:"姓名",align:"center",valign:"middle",width:"10%"},
                {field:"sex",title:"性别",align:"center",valign:"middle",width:"10%"},
                {field:"studentType",title:"学生类别",align:"center",valign:"middle",width:"5%"},
                {field:"schemeLevel",title:"培养层次",align:"center",valign:"middle",width:"5%"},
                {field:"deptName",title:"所属学院",align:"center",valign:"middle",width:"10%"},
                {field:"semesterGrade",title:"年级专业",align:"center",valign:"middle",width:"10%"},
                {field:"semesterGrade",title:"班级",align:"center",valign:"middle",width:"10%"},
                {field:"atSchoolSign",title:"学籍状态",align:"center",valign:"middle",width:"10%"},
                {field:"schoolStatus",title:"在校状态",align:"center",valign:"middle",width:"10%"},
			]
		};
		
		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
			angular.element('#invigilateArrangeStudentListTable').bootstrapTable('selectPage', 1);
		};
		
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 45;
			} else {
				$scope.table_height = $scope.table_height - 45;
			}
			angular.element('#invigilateArrangeStudentListTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
    
    };
	teacherInvigilateArrange_invigilateArrangeStudentController.$inject = ['$scope', '$http', '$stateParams', '$state', '$timeout', '$uibModal', '$cookies', '$compile', '$rootScope', '$window', 'alertService', 'app'];
})(window);