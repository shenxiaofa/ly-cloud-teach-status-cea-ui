;(function (window, undefined) {
    'use strict';
    window.teacherMakeupEntering_makeupEnteringController = function ($scope, $http, $state, $timeout, $uibModal, $cookies, $compile, $rootScope, $window, baseinfo_generalService, alertService, app) {
		
		$scope.entering = {};

		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
			
		// 表格的高度
        $scope.table_height = $window.innerHeight - 233;
        
        $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
        
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="makeupEntering.semester_ID" id="semester_ID" name="semester_ID" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semester_ID").parent().empty().append(html);
            $compile(angular.element("#semester_ID").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	monitor: 'monitor',
            	type: '2',
            	teacherId : cookieasJson.userName,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.makeupEntering);
	    };
	    
		$scope.makeupEnteringTable = {
            url: app.api.address + '/score/makeupExamScore',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
//          showColumns: true,
//          showRefresh: true,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
			onLoadSuccess: function() {
				$compile(angular.element('#makeupEnteringTable').contents())($scope);
			},
			columns: [
                {field:"semester",title:"开课学期",align:"center",valign:"middle",width:"10%"},
                {field:"courseNum",title:"课程代码",align:"center",valign:"middle",width:"10%"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width:"10%"},
                {field:"department",title:"开课单位",align:"center",valign:"middle",width:"10%"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle",width:"10%"},
                {field:"recheckDays",title:"轮次",align:"center",valign:"middle",width:"5%"},
                {field:"credit",title:"学分",align:"center",valign:"middle",width:"5%"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle",width:"5%"},
                {field:"className",title:"考试班名称",align:"center",valign:"middle",width:"10%"},
                {field:"notInputCount",title:"未录入数/人数",align:"center",valign:"middle",width:"10%",
                    formatter : function (value, row, index) {
	                    return  row.notInputCount+ "/"+row.studentCount;
	                }
                },
                {field:"status",title:"操作状态",align:"center",valign:"middle",width:"5%",
                    formatter : function (value, row, index) {
                        if("1"==value){return  "暂存";}
                        if("2"==value){return  "提交";}
                        if("3"==value){return  "退回";}
                        return  "";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width:"6%",
                    formatter : function (value, row, index) {
                    	var maintain = "";
                    	if(row.status == 2){
                    		maintain =  "<button id='btn_update' type='button' ng-click='wheneverEdit(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>修改</button>";
                    	}else{
                    		maintain =  "<button id='btn_update' type='button' ng-click='wheneverEdit(" + JSON.stringify(row) + ")'  class='btn btn-default btn-sm''>录入</button>";
                    	}
                        return maintain;
                    }
                }
			]
		};
		
        // 随时编辑
        $scope.wheneverEdit = function(row){
			$("body").fadeOut();
			$timeout(function(){
				// 把json数据转换为json字符串
				var params = angular.toJson(row);
				$state.go("home.common.makeupEnteringBatch",{
					"params" : params
				});
            },500);
			$("body").fadeIn(800);
        };

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
			angular.element('#makeupEnteringTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.makeupEntering = {};
            // 重新初始化下拉框
            angular.element('form[name="makeupEnteringSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#makeupEnteringTable').bootstrapTable('selectPage', 1);
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
			angular.element('#makeupEnteringTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
		
		
	};
	teacherMakeupEntering_makeupEnteringController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModal', '$cookies', '$compile', '$rootScope', '$window', 'baseinfo_generalService', 'alertService', 'app'];
})(window);