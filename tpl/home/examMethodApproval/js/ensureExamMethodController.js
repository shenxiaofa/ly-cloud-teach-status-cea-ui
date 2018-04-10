;(function (window, undefined) {
    'use strict';
    window.teacherExamMethod_ensureExamMethodController = function ($scope, $http, $stateParams, $state, $timeout, $uibModal, $compile, $rootScope, $window, alertService, teacherExamMethod_ensureExamMethodService, baseinfo_generalService, app) {
		
		$scope.ensureExamMethod = {};

		// 表格的高度
        $scope.table_height = $window.innerHeight - 140;
        
        $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
        
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="ensureExamMethod.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.ensureExamMethod);
	    };
	    
		$scope.ensureExamMethodTable = {
            url:app.api.address + '/exam/testTask/teachingClass?examWayTaskId='+stateParams.id,
			method: 'get',
			cache: false,
            height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
//			pagination: true,
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
			onLoadSuccess: function() {
				$compile(angular.element('#ensureExamMethodTable').contents())($scope);
			},
            responseHandler:function(response){
                var data ={}
                data.rows = response.data;
                return data;
            },
			clickToSelect: true,
			columns: [
                {field:"courseId",title:"课程代码",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"className",title:"教学班名称",align:"center",valign:"middle"},
                {field:"studentCount",title:"上课人数",align:"center",valign:"middle"},
                {field:"examWay",title:"考试方式",align:"center",valign:"middle",width: "15%",
                    formatter : function (value, row, index) {
                        $scope["examWay"+row.id] = value;
                        var selectHtml = '<select name="examWay" id='+"examWay"+row.id+'  ng-model='+"examWay"+row.id+' class="col-xs-8 form-control mark"> <option value="">==请选择==</option> <option value="1">笔试闭卷</option><option value="2">笔试开卷</option></select>'
                        return selectHtml;
                    }
                },
                {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {

                        $scope.$watch('exam'+row.id, function(newVal){
                            $scope["usual"+row.id] = 100-newVal;
                        });
                        if(value != null){
                        	$scope["usual"+row.id] = value.substring(2);
                        }
                        var input = '<input type="number" id='+"usual"+row.id+' ng-model='+"usual"+row.id+' min="0" max="100" style="width: 64px;"   value="'+value+'"  name="usualScore" size="2"/>';
                        return input;
                    }
                },
                {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",width: "5%",
                    formatter : function (value, row, index) {


                        $scope.$watch('usual'+row.id, function(newVal){
                            $scope["exam"+row.id] = 100-newVal;
                        });
                        if(value != null){
                        	$scope["exam"+row.id] = value.substring(2);
                        }
                        var input = '<input type="number" id='+"exam"+row.id+' ng-model='+"exam"+row.id+' style="width: 64px;" min="0" max="100" value="'+value+'"  name="examScore" size="2"/>';
                        return input;
                    }
                }
			]
		};

        // 提交成功后
        $scope.submit = function(){
            var data = angular.element('#ensureExamMethodTable').bootstrapTable('getData');
            for(var i = 0; i<data.length; i++ ){
                var obj = data[i];
                obj.examWay = angular.element('#examWay'+obj.id)[0].value;
                obj.usualScoreScale = angular.element('#usual'+obj.id)[0].value;
                obj.examScoreScale = angular.element('#exam'+obj.id)[0].value;
                if(obj.examWay == "" || obj.usualScoreScale == "" || obj.examScoreScale == ""){
                    alertService("请将信息补充完整再提交");
                    return;
                }
                obj.usualScoreScale = parseInt(obj.usualScoreScale)/100;
                obj.examScoreScale = parseInt(obj.examScoreScale)/100;
            }
			
            teacherExamMethod_ensureExamMethodService.apply(data,function (error, message) {
                if (error) {
                    alertService(message);
                    return;
                }else{
                    angular.element('#examMethodApprovalTable').bootstrapTable('refresh');
					$("body").fadeOut();
					$timeout(function(){  
						$state.go("home.common.examMethodApproval");
		            },500);  
					$("body").fadeIn(800);
                }
            });
        };

	};
	teacherExamMethod_ensureExamMethodController.$inject = ['$scope', '$http', '$stateParams', '$state', '$timeout', '$uibModal', '$compile', '$rootScope', '$window', 'alertService', 'teacherExamMethod_ensureExamMethodService', 'baseinfo_generalService', 'app'];
})(window);