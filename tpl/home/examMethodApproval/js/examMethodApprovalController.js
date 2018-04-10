;(function (window, undefined) {
    'use strict';
    window.teacherExamMethod_examMethodApprovalController = function ($scope, $http, $state, $timeout, $uibModal, $compile, $cookies, $rootScope, $window, baseinfo_generalService, alertService, app) {
		
		$scope.examMethodApproval = {};

		// 表格的高度
        $scope.table_height = $window.innerHeight - 227;
        
        $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
	    
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
			
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html1 = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester for plateObj in semesterObjs" '
                +  ' ng-model="examMethodApproval.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html1);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	teacherId : cookieasJson.userName,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.examMethodApproval);
	    };
	    
		$scope.examMethodApprovalTable = {
            url: app.api.address + '/exam/testTask/teacherExamWayTask',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
            uniqueId: "id",
			queryParams: $scope.queryParams,//传递参数（*）
			onLoadSuccess: function() {
				$compile(angular.element('#examMethodApprovalTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
			clickToSelect: true,
			columns: [
                {field:"name",title:"申请表单",align:"center",valign:"middle"},
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"teacher",title:"执行人",align:"center",valign:"middle"
//              ,
//                  formatter : function (value, row, index) {
//                      if(value == '' || value == null){
//                          return "-";
//                      }
//                      var names = "";
//                      angular.forEach(value, function(data, index, array){
//                          names += data.name + "、";
//                      });
//                      if (names.length > 0) {
//                          names = names.substring(0, names.length - 1);
//                      }
//                      return names;
//                  }
                },
                {field:"status",title:"审批状态",align:"center",valign:"middle",
                    formatter : function (value, row, index) {
                        if(value == "0"){
                            return "不通过";
                        }
                        if(value == "1"){
                            return "通过";
                        }
                        if(value == "2"){
                            return "已提交";
                        }
                        return "未提交";
                    }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        if(row.status == '1' || row.status == '2'){
                             return "<button type='button' class='btn disabled' disabled='disabled'>确认考试方式</button>";
                        }else{
                            return "<button type='button' style='margin: 0;' ng-click='ensureExamMethod(" + JSON.stringify(row) + ")' class='btn btn-default'>确认考试方式</button>";
                        }
                    }
                }
			]
		};
		
        // 确认考试方式
        $scope.ensureExamMethod = function(row){
			$("body").fadeOut();
			var params = angular.toJson(row);
			$timeout(function(){
				$state.go("home.common.ensureExamMethod",{
					"params" : params
				});
            },500);
			$("body").fadeIn(800);
        };

		// 查询表单
		$scope.searchSubmit = function () {
			angular.element('#examMethodApprovalTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.examMethodApproval = {};
            // 重新初始化下拉框
            angular.element('form[name="enteringSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examMethodApprovalTable').bootstrapTable('selectPage', 1);
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
			angular.element('#examMethodApprovalTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
		
	};
	teacherExamMethod_examMethodApprovalController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModal', '$compile', '$cookies', '$rootScope', '$window', 'baseinfo_generalService', 'alertService', 'app'];
})(window);