;(function (window, undefined) {
    'use strict';
window.teacherMakeupEntering_makeupEnteringBatchController = function ($scope, $http, $state, $stateParams, $uibModal, $timeout, $compile, $rootScope, $window, alertService, teacherMakeupEntering_makeupEnteringBatchService, app, formVerifyService) {

	$scope.enteringBatch = {};
	
	// 表格的高度
    $scope.table_height = $window.innerHeight-195;
    
    $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
    $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    
	// 将传过来的json字符串转换为json格式数据
	var stateParams = JSON.parse($stateParams.params);
	
	$scope.inputCount = 0;	// 累加有导入的人数
	$scope.countPercent = 0; // 计算导入人数占比百分比
	
	// 转换为数字并获取到百分比的结果
	$scope.studentCount = parseInt(stateParams.studentCount);
	$scope.appTopParam = {
		'courseInfo' : stateParams.courseName,
		'department' : stateParams.department,	// 课程所在单位名称
		'credit' : stateParams.credit,			// 学分
		'totalHour' : stateParams.totalHour,			// 学时
		'studentCount' : stateParams.studentCount		// 学生人数
	};
	
	$scope.makeupEnteringBatchTable = {
        url:app.api.address + '/score/makeupExamScore/makeupScoreList?type=2&list_ID='+stateParams.cjlrrw_ID,
        method: 'get',
        cache: false,
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        striped: true,
        pagination: false,
        search: false,
        clickToSelect: true,
        onLoadSuccess: function() {
            $compile(angular.element('#makeupEnteringBatchTable').contents())($scope);
			$scope.countPercent = Math.round((($scope.inputCount)/($scope.studentCount))*100);
			console.log($scope.inputCount);
			console.log($scope.studentCount);
			console.log($scope.countPercent);
			$scope.$apply(function () {	// 强制更新上去，遇到过没更新好
				$scope.progressbarClass = $scope.countPercent;
				if($scope.progressbarClass==100){	// 进度条变为绿色
					$('.progress-bar').removeClass('progress-bar-warning').addClass('progress-bar-success');
				}else{	// 提交按钮不可点
					$('#submitButton').removeClass('btn-default').addClass('disabled').css('cursor','pointer').css('pointer-events','none');
				}
			});
        },
        responseHandler:function(response){
            var data = {
                rows :response.data
            }
            return data;
        },
        columns: [
            {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
            {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
            {field:"className",title:"班级名称",align:"center",valign:"middle"},
            {field:"scoreCount",title:"补考成绩",align:"center",valign:"middle",
                formatter : function (value, row, index) {
               		if(row.scoreCount != null){
               			$scope.inputCount++;
               		}
                    if(value){
                        $scope["score"+row.studentId] = parseFloat(value);
                    }
                    var input = '<input type="number" ng-required="true" ng-model='+"score"+row.studentId+'  min="0.0" max="100" style="width: 64px;" step="1" value="'+value+'"  name='+"examScore"+row.studentId+' size="3"/>';
                    return input;
                }},
            {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
            {field:"inputName",title:"录入人",align:"center",valign:"middle"},
            {field:"inputTime",title:"修改时间",align:"center",valign:"middle"}
        ]
	};
	
    $scope.save = function() {
    	var finalTime = "";
    	if ($scope.timeout3 != null && $scope.timeout3 != ""){
    		finalTime = $scope.timeout3;
    	}
    	if ($scope.timeout2 != null && $scope.timeout2 != ""){
    		finalTime = $scope.timeout2;
    	}
    	if ($scope.timeout1 != null && $scope.timeout1 != ""){
    		finalTime = $scope.timeout1;
    	}
    	if ($scope.timeout0 != null && $scope.timeout0 != ""){
    		if($scope.timeout != null && $scope.timeout != ""){
    			finalTime = $scope.timeout;
    		}
    	}
        if (finalTime != null && finalTime != "") {
            alertService('系统将在' + finalTime + '分钟后自动保存');
            var timer = $timeout(function () {
                var tabData = angular.element('#makeupEnteringBatchTable').bootstrapTable('getOptions').data;
                var examScores = angular.element('#makeupEnteringBatchTable input[name="examScore"]');
                var params = [];
                for (var i=0; i<tabData.length; i++) {
                    params[i] = {};
                    params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
                    params[i].score = examScores.eq(i).val();
                    //params[i].status = status;
                    params[i].cjlrrw_id = stateParams.cjlrrw_ID;
                }
                //$rootScope.showLoading = true; // 开启加载提示
                teacherMakeupEntering_makeupEnteringBatchService.update(params, function (error, message) {
                    //$rootScope.showLoading = false; // 关闭加载提示
                    if (error) {
                        alertService(message);
                        return;
                    }
                });
            }, finalTime * 60000);
            $scope.timeout3 = "";
            $scope.timeout2 = "";
            $scope.timeout1 = "";
            $scope.timeout = "";
        }else{
        	alertService('请选择自动保存的时间!(单位为分钟)');
		}
    };
    
    $scope.ok = function (status,form) {
        if(form){
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
        }
        $scope.inputCount = 0;	// 置为0
        var tabData = angular.element('#makeupEnteringBatchTable').bootstrapTable('getOptions').data;
        var examScores = angular.element('#makeupEnteringBatchTable input[name="examScore"]');
        var params = [];
        for (var i=0; i<tabData.length; i++) {
            params[i] = {};
            params[i].bqkxscj_ID = tabData[i].bqkxscj_ID;
            params[i].score = $scope["score"+tabData[i].studentId];
            params[i].status = status;
            params[i].semesterId = stateParams.semesterId;
            params[i].courseNum = stateParams.courseNum;
            params[i].studentNum = tabData[i].studentId;
            params[i].cjlrrw_id = stateParams.cjlrrw_ID;
        }
        $rootScope.showLoading = true; // 开启加载提示
        teacherMakeupEntering_makeupEnteringBatchService.update(params,function (error, message) {
              $rootScope.showLoading = false; // 关闭加载提示
            if (error) {
                alertService(message);
                return;
            }
        });
        if(status==2){
            // 成功则弹框
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/makeupEntering/alert.html',
                size: '',
                resolve: {
                    alert: function () {
                        return {
                            message: status	// 传一个参数判断是“暂存”或“提交”
                        }
                    }
                },
                controller: alertController
            });
        }else{
			location.reload();		// 简单粗暴直接页面上刷新
	    }
        angular.element('#makeupEnteringBatchTable').bootstrapTable('refresh');
    };
    
    // 暂存 & 提交的弹出框后操作
    var alertController = function ($scope, $uibModalInstance, alert) {
        $scope.close = function () {
        	if(alert.message == 2){	// 提交后点击关闭窗口
				// 返回上一层
				$("body").fadeOut();
				$timeout(function(){
					$state.go("home.common.makeupEntering");
	            },500);  
				$("body").fadeIn(800);
        	}
            $uibModalInstance.close();
        };
    };
    alertController.$inject = ['$scope', '$uibModalInstance', 'alert'];

    // 导入
    $scope.enteringButtin = function () {
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'tpl/home/makeupEntering/importData.html',
            size: 'lg',
            resolve: {
                item: function () {
                }
            },
            controller: openImportController
        });
    };
    
    // 导入控制器
    var openImportController = function ($rootScope, $scope, $uibModal, $filter, $uibModalInstance, teacherMakeupEntering_makeupEnteringBatchService, uuid4, app) {
    	
        // 导出模板
        $scope.exportTemplate = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/makeupEntering/exportTemplate.html',
                size: 'lg',
                resolve: {
                    item: function () {
                    }
                },
                controller: openExportTemplateController
            });
        }
        
        // 导入
        $scope.uploadExcelFile = function () {
            var excelFile = angular.element('#excelFile')[0].files[0];
            $scope.params = {
                list_ID: stateParams.cjlrrw_ID,
                routeKey: uuid4.generate()
            }
            // 导入数据
            var formData = new FormData();
            formData.append ('list_ID', $scope.params.list_ID);
            formData.append ('routeKey', $scope.params.routeKey);
            formData.append ('file', excelFile);
            formData.append ('type', '2');
            var client;
        	$rootScope.showLoading = true; // 开启加载提示
            teacherMakeupEntering_makeupEnteringBatchService.importData(formData, function (error, message) {
            	$rootScope.showLoading = false; // 关闭加载提示
            });
            // 实时日志显示
            client = showImportLog($scope, app);
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openImportController.$inject = ['$rootScope', '$scope', '$uibModal', '$filter', '$uibModalInstance', 'teacherMakeupEntering_makeupEnteringBatchService', 'uuid4', 'app'];

    // 下载模板控制器
    var openExportTemplateController = function ($scope, $filter, $uibModalInstance, teacherMakeupEntering_makeupEnteringBatchService, uuid4, $rootScope, app) {
        $scope.params = {
            type:'2',
            list_ID: stateParams.cjlrrw_ID,
            routeKey: uuid4.generate()
        }
        $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
        $rootScope.showLoading = true; // 开启加载提示
        // 导出模板
        teacherMakeupEntering_makeupEnteringBatchService.exportTemplate($scope.params, function (data) {
            var blob = new Blob([data], {type: "application/vnd.ms-excel"});
            var objectUrl = window.URL.createObjectURL(blob);
            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var aForExcel = angular.element('<a download="补考成绩单-导入模板-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
            angular.element('body').append(aForExcel);
            angular.element('.forExcel').click();
            aForExcel.remove();
            // 允许关闭
            $scope.isNotAllowWindowClose = false;
            $rootScope.showLoading = false; // 关闭加载提示
            $uibModalInstance.close();
        });
    };
    openExportTemplateController.$inject = ['$scope', '$filter', '$uibModalInstance', 'teacherMakeupEntering_makeupEnteringBatchService', 'uuid4', '$rootScope', 'app'];

    // 输出打印
    $scope.previewAndPrint = function () {
        var LODOP = getLodop();
        LODOP.PRINT_INIT('补考学生成绩单');
        LODOP.SET_PRINT_STYLE('FontSize', 18);  
        //LODOP.SET_PRINT_STYLE('Bold', 1);
        // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, '补考学生成绩单');
        var data = angular.element('#makeupEnteringBatchTable').bootstrapTable('getData');
        var tableHTML = '';
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            if(!obj.className){obj.className = ""}
            if(!obj.scoreCount){obj.scoreCount = ""}
            if(!obj.scoreFlag){obj.scoreFlag = ""}
            if(!obj.inputName){obj.inputName = ""}
            if(!obj.inputTime){obj.inputTime = ""}
            tableHTML += '<tr data-index="'+i+'"><td style="text-align: center; vertical-align: middle; width:47px; ">'+ (i+1) +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 79px; ">'+ obj.studentId +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.studentName +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.className +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 50px; ">'+ obj.scoreCount +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.scoreFlag +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 54px; ">'+ obj.inputName +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.inputTime +'</td></tr>';
        }
        var html ='<table border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px black;">' +
            '<caption style="font-size: 18px;font-weight: bold;">补考学生成绩单</caption>' +
            '<thead class="ng-scope"><tr>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; width: 5%; " data-field="" tabindex="0"><div class="th-inner ">序号</div><div class="fht-cell" style="width: 47px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentId" tabindex="0"><div class="th-inner ">学生学号</div><div class="fht-cell" style="width: 79px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentName" tabindex="0"><div class="th-inner ">学生姓名</div><div class="fht-cell" style="width: 66px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="className" tabindex="0"><div class="th-inner ">班级名称</div><div class="fht-cell" style="width: 150px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreCount" tabindex="0"><div class="th-inner ">补考成绩</div><div class="fht-cell" style="width: 50px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreFlag" tabindex="0"><div class="th-inner ">成绩标记</div><div class="fht-cell" style="width: 66px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputName" tabindex="0"><div class="th-inner ">录入人</div><div class="fht-cell" style="width: 54px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputTime" tabindex="0"><div class="th-inner ">修改时间</div><div class="fht-cell" style="width: 150px;"></div></th>' +
            '</tr></thead>' +
            '<tbody></tbody> '+ tableHTML+'</table>';

        LODOP.ADD_PRINT_HTM(88, 50, 800, 900, html);
        LODOP.PREVIEW();
    };
    
    // 实时日志显示
    var showImportLog = function ($scope, app) {
        $scope.logs = "";
        var ws = new WebSocket('ws://' + app.rabbitmq.hostname + ':15674/ws');
        var client = Stomp.over(ws);
        var index = 0;
        client.connect(app.rabbitmq.username, app.rabbitmq.password, function () {
            var subscribeObject = client.subscribe('/exchange/' + app.rabbitmq.logExchange + '/' + $scope.params.routeKey, function (data) {
                $scope.$apply(function () {
                    index+=1;
                    var log = data.body;
                    log = angular.fromJson(log);
                    $scope.logData = angular.fromJson(log);
                    if(log.status=="START" || log.status=="CHECK" || log.status=="END" ){
                        log = log.message
                    }
                    if(log.status=="IMPORT_DATA"){
                        log = "总处理数据"+ log.totalCount+"条,成功"+ log.successCount+"条," +log.message
                    }
                    if($scope.logData.level=="ERROR"){
                        $scope.logs+='<font color="#982C2C">'+index + '.'+ log+'</font><br/>';
                    }else{
                        $scope.logs+='<font color="#5DFF16">'+index + '.'+ log+'</font><br/>';
                    }

                    angular.element("#logs").empty().append($scope.logs);
                    $compile(angular.element("#logs").contents())($scope);
                });
            });
        }, function () {
            $scope.$apply(function () {
                $scope.logs+='<font color="#982C2C">获取导入信息失败</font><br/>';
                angular.element("#logs").empty().append($scope.logs);
                $compile(angular.element("#logs").contents())($scope);
            });
        }, '/');
        client.debug = function(message) {
            // 屏蔽调试信息
        };
        return client;
    }

	// 返回上一层
	$scope.returnLastLabel = function () {
		$("body").fadeOut();
		$timeout(function(){  
			$state.go("home.common.makeupEntering");
        },500);  
		$("body").fadeIn(800);
	};
	
};
teacherMakeupEntering_makeupEnteringBatchController.$inject = ['$scope', '$http', '$state', '$stateParams', '$uibModal', '$timeout', '$compile', '$rootScope', '$window', 'alertService', 'teacherMakeupEntering_makeupEnteringBatchService', 'app', 'formVerifyService'];
})(window);
