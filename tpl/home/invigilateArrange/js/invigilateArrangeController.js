;(function (window, undefined) {
    'use strict';
    window.teacherInvigilateArrange_invigilateArrangeController = function ($scope, $http, $state, $timeout, $uibModal, $cookies, $compile, $rootScope, $window, baseinfo_generalService, alertService, app) {
    	
    	// 表格的高度
        $scope.table_height = $window.innerHeight - 275;
        
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
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="invigilateArrange.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	teacherId : cookieasJson.userName,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.invigilateArrange);
	    };
	    
		$scope.invigilateArrangeTable = {
//			/exam/formalManage/findExamLocationInfo 
            url: app.api.address + '/exam/formalManage/teacherExamInfo',
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
				$compile(angular.element('#invigilateArrangeTable').contents())($scope);
			},
            responseHandler:function(response){
                return response.data;
            },
			clickToSelect: true,
			columns: [
                {field:"semester",title:"开课学期",align:"center",valign:"middle",width:"10%"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width:"10%"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle",width:"10%"},
                {field:"credit",title:"学分",align:"center",valign:"middle",width:"5%"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle",width:"5%"},
                {field:"startTime",title:"考试开始时间",align:"center",valign:"middle",width:"10%"},
                {field:"endTime",title:"考试结束时间",align:"center",valign:"middle",width:"10%"},
                {field:"name",title:"考试班",align:"center",valign:"middle",width:"10%"},
//              {field:"teacher",title:"监考人员",align:"center",valign:"middle",width:"10%"},
                {field:"locationName",title:"考试地点",align:"center",valign:"middle",width:"10%"
//              ,
//                  formatter : function (value, row, index) {
//                      if(value == '' || value == null){
//                          return "-";
//                      }
//                      var names = "";
//                      angular.forEach(value, function(data, index, array){
//                          names += data.classRoomNum + "、";
//                      });
//                      if (names.length > 0) {
//                          names = names.substring(0, names.length - 1);
//                      }
//                      return names;
//                  }
                },
                {field:"examSeatNum",title:"考生数",align:"center",valign:"middle",width:"6%",
                    formatter : function (value, row, index) {
                        var maintain =  "<a style='color: red;' ng-click='checkStudent(" + JSON.stringify(row) + ")'>"+ row.studentCount +"</a>";
                        return  maintain;
                    }
                }
			]
		};
		
        // 考生名单
        $scope.checkStudent = function(row){
			$("body").fadeOut();
			var params = angular.toJson(row);
			$timeout(function(){
				$state.go("home.common.invigilateArrangeNumber",{
					"params" : params
				});
            },500);
			$("body").fadeIn(800);
        };

        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            }
        };
        
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            }
        };

        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('invigilateArrange.endTime', function (newValue) {
            if ($scope.invigilateArrange.startTime && newValue && (newValue < $scope.invigilateArrange.startTime)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
			angular.element('#invigilateArrangeTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.invigilateArrange = {};
            // 重新初始化下拉框
            angular.element('form[name="invigilateArrangeForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#invigilateArrangeTable').bootstrapTable('selectPage', 1);
        };
        
		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 85;
			} else {
				$scope.table_height = $scope.table_height - 85;
			}
			angular.element('#invigilateArrangeTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
    
    };
	teacherInvigilateArrange_invigilateArrangeController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModal', '$cookies', '$compile', '$rootScope', '$window', 'baseinfo_generalService', 'alertService', 'app'];
})(window);