;(function (window, undefined) {
    'use strict';
window.teacherEntering_enteringBatchController = function ($scope, $http, $state, $stateParams, $uibModal, $timeout, $compile, $rootScope, $window, alertService, teacherEntering_enteringBatchService, app, formVerifyService) {
			
	$scope.enteringBatch = {};
	
	// 表格的高度
    $scope.table_height = $window.innerHeight-213;// 195
    
    $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
    $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
    
	// 将传过来的json字符串转换为json格式数据
	var stateParams = JSON.parse($stateParams.params);
	console.log(stateParams);
	
	$scope.inputCount = 0;	// 累加有导入的人数
	$scope.countPercent = 0; // 计算导入人数占比百分比
	
	// 转换为数字并获取到百分比的结果
	$scope.studentCount = parseInt(stateParams.studentCount);
	$scope.appTopParam = {
		'courseInfo' : stateParams.courseName,	// 课程名称
		'department' : stateParams.department,	// 课程所在单位名称
		'credit' : stateParams.credit,			// 学分
		'totalHour' : stateParams.totalHour,			// 学时
		'studentCount' : stateParams.studentCount		// 学生人数
	};
	
	$scope.enteringBatchTable = {
//      url: 'data_test/index/tableview_enteringBatch.json',	// json文件测试专用
        url:app.api.address + '/score/formalExamScore/formalScoreList?list_ID='+stateParams.cjlrrw_ID,
        method: 'get',
        cache: false,
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        striped: true,
        pagination: false,
        search: false,
        clickToSelect: true,
        onColumnSwitch: function (field, checked) {
            $compile(angular.element('#enteringBatchTable').contents())($scope);
        },
        onLoadSuccess: function() {
            $compile(angular.element('#enteringBatchTable').contents())($scope);
			$scope.countPercent = Math.round((($scope.inputCount)/($scope.studentCount))*100);
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
                rows : response.data
            }
            return data;
        },
		columns: [
            {field:"rowNum",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
                return index+1;
            }},
            {field:"studentId",title:"学生学号",align:"center",valign:"middle"},
            {field:"studentName",title:"学生姓名",align:"center",valign:"middle"},
            {field:"className",title:"班级名称",align:"center",valign:"middle"},
            {field:"examScoreScale",title:"期末成绩比例",align:"center",valign:"middle",
                formatter : function (value, row, index) {
                    return parseInt(value*1000)/10+"%";
            }},
            {field:"usualScoreScale",title:"平时成绩比例",align:"center",valign:"middle",
                formatter : function (value, row, index) {
                    return parseInt(value*1000)/10+"%";
                }},
            {field:"examScore",title:"正考成绩",align:"center",valign:"middle",
                formatter : function (value, row, index) {
                    if(value){
                        $scope["exam"+row.studentId] = parseFloat(value);
                    }
                    var input = '<input type="number" ng-required="true" ng-model='+"exam"+row.studentId+' style="width: 64px;" min="0" max="100"  value="'+value+'"  name='+"examScore"+row.studentId+' size="2"/>';
                    return input;
                }},
            {field:"usualScore",title:"平时成绩",align:"center",valign:"middle",
                formatter : function (value, row, index) {
                    if(value){
                        $scope["usual"+row.studentId] = parseFloat(value);
                    }
                    var input = '<input type="number" ng-required="true" ng-model='+"usual"+row.studentId+' min="0" max="100" style="width: 64px;"   value="'+value+'"  name='+"usualScore"+row.studentId+' size="2"/>';
                    return input;
                }},
            {field:"scoreCount",title:"总成绩",align:"center",valign:"middle",
                formatter : function (value, row, index) {
               		if(row.scoreCount != null){
               			$scope.inputCount++;
               		}
               	
                    //总成绩
                    if(value){
                        $scope["total"+row.studentId] = parseFloat(value);
                    }
                    $scope.$watch('exam'+row.studentId, function(newVal){
                        var f = parseFloat(newVal);
                        if (isNaN(f)) {
                            return;
                        }
                        if($scope["usual"+row.studentId]){
                            var tmp = f*row.examScoreScale + $scope["usual"+row.studentId]*row.usualScoreScale;
                            $scope["total"+row.studentId] = Math.round(tmp*10)/10;
                        }
                    });
                    $scope.$watch('usual'+row.studentId, function(newVal){
                        var f = parseFloat(newVal);
                        if (isNaN(f)) {
                            return;
                        }
                        if($scope["exam"+row.studentId]){
                            var tmp = f*row.usualScoreScale + $scope["exam"+row.studentId]*row.examScoreScale;
                            $scope["total"+row.studentId] = Math.round(tmp*10)/10;
                        }
                    });
                    return '<span ng-bind='+"total"+row.studentId+'></span>';
                }
            },
            {field:"scoreFlag",title:"成绩标记",align:"center",valign:"middle"},
            {field:"inputName",title:"录入人",align:"center",valign:"middle"},
            {field:"inputTime",title:"修改时间",align:"center",valign:"middle"}
		]
	};

	// 保存
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
                var tabData = angular.element('#enteringBatchTable').bootstrapTable('getOptions').data;
//              var usualScores = angular.element('#enteringBatchTable input[name="usualScore"]');
//              var examScores = angular.element('#enteringBatchTable input[name="examScore"]');
                var params = [];
                for (var i=0; i<tabData.length; i++) {
                        params[i] = {};
                        params[i].zkxscjd_id = tabData[i].zkxscjd_ID;
                        params[i].cjlrrw_id = stateParams.cjlrrw_ID;
                        params[i].usualScore = $scope["usual"+tabData[i].studentId];
                        params[i].examScore = $scope["exam"+tabData[i].studentId];
                        params[i].usualScoreScale = tabData[i].usualScoreScale;
                        params[i].examScoreScale = tabData[i].examScoreScale;
                        params[i].semesterId = stateParams.semesterId;
                        params[i].courseNum = stateParams.courseNum;
                        params[i].studentNum = tabData[i].studentId;
//                      params[i].status = status;
                }
                //$rootScope.showLoading = true; // 开启加载提示
                arrange_enteringBatchService.update(params, function (error, message) {
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
    }
    
    // 暂存 & 提交
    $scope.ok = function (status,form) {
        if(status==2){
            if(form.$invalid) {
                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
                formVerifyService(form);
                return;
            };
        }
        $scope.inputCount = 0;	// 置为0
        var tabData = angular.element('#enteringBatchTable').bootstrapTable('getOptions').data;
//      var usualScores = angular.element('#enteringBatchTable input[name="usualScore"]');
//      var examScores = angular.element('#enteringBatchTable input[name="examScore"]');
        var params = [];
        for (var i=0; i<tabData.length; i++) {
            params[i] = {};
            params[i].zkxscjd_id = tabData[i].zkxscjd_ID;
            params[i].cjlrrw_id = stateParams.cjlrrw_ID;
            params[i].usualScore = $scope["usual"+tabData[i].studentId];
            params[i].examScore = $scope["exam"+tabData[i].studentId];
            params[i].usualScoreScale = tabData[i].usualScoreScale;
            params[i].examScoreScale = tabData[i].examScoreScale;
            params[i].semesterId = stateParams.semesterId;
            params[i].courseNum = stateParams.courseNum;
            params[i].studentNum = tabData[i].studentId;
            params[i].status = status;
        }
        $rootScope.showLoading = true; // 开启加载提示
        teacherEntering_enteringBatchService.update(params,function (error, message) {
            $rootScope.showLoading = false; // 关闭加载提示
            if (error) {	// 报错
                alertService(message);
                return;
            }
        });
        if(status==2){
        	 // 成功则弹框
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/entering/alert.html',
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
        angular.element('#enteringBatchTable').bootstrapTable('refresh');
    };
    
    // 暂存 & 提交的弹出框后操作
    var alertController = function ($scope, $uibModalInstance, alert) {
        $scope.close = function () {
        	if(alert.message == 2){	// 提交后点击关闭窗口
				// 返回上一层
				$("body").fadeOut();
				$timeout(function(){
					$state.go("home.common.entering");
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
            templateUrl: 'tpl/home/entering/importData.html',
            size: 'lg',
            resolve: {
                item: function () {
                }
            },
            controller: openImportController
        });
    };
    
    // 导入控制器
    var openImportController = function ($rootScope, $scope, $uibModal, $uibModalInstance, teacherEntering_enteringBatchService, uuid4, app) {
    	
        // 导出模板
        $scope.exportTemplate = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/entering/exportTemplate.html',
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
            var client;
        	$rootScope.showLoading = true; // 开启加载提示
            teacherEntering_enteringBatchService.importData(formData, function (error, message) {
            	$rootScope.showLoading = false; // 关闭加载提示
            });
            // 实时日志显示
            client = showImportLog($scope, app);
        };
        $scope.close = function () {
            $uibModalInstance.close();
        };
    };
    openImportController.$inject = ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', 'teacherEntering_enteringBatchService', 'uuid4', 'app'];

    // 下载模板控制器
    var openExportTemplateController = function ($scope, $filter, $uibModalInstance, teacherEntering_enteringBatchService, uuid4, $rootScope, app) {
        $scope.params = {
            list_ID: stateParams.cjlrrw_ID,
            routeKey: uuid4.generate()
        }
        $scope.isNotAllowWindowClose = true; // 是否允许关闭窗口
        $rootScope.showLoading = true; // 开启加载提示
        // 导出模板
        teacherEntering_enteringBatchService.exportTemplate($scope.params, function (data) {
            var blob = new Blob([data], {
            	type: "application/vnd.ms-excel"
            });
            var objectUrl = window.URL.createObjectURL(blob);
            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            var aForExcel = angular.element('<a download="正考成绩单-导入模板-' + currentTime + app.excel.ext + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
            angular.element('body').append(aForExcel);
            angular.element('.forExcel').click();
            aForExcel.remove();
            // 允许关闭
            $scope.isNotAllowWindowClose = false;
            $rootScope.showLoading = false; // 关闭加载提示
            $uibModalInstance.close();
        });
    };
    openExportTemplateController.$inject = ['$scope', '$filter', '$uibModalInstance', 'teacherEntering_enteringBatchService', 'uuid4', '$rootScope', 'app'];

    // 输出打印
    $scope.previewAndPrint = function () {
        var LODOP = getLodop();
        LODOP.PRINT_INIT('正考学生成绩单');
        LODOP.SET_PRINT_STYLE('FontSize', 18);  
        //LODOP.SET_PRINT_STYLE('Bold', 1);
        // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, '正考学生成绩单');
        var data = angular.element('#enteringBatchTable').bootstrapTable('getData' );
        var tableHTML = '';
        for(var i=0;i<data.length;i++){
            var obj = data[i];
            if(!obj.className){obj.className = ""}
            if(!obj.examScore){obj.examScore = ""}
            if(!obj.usualScore){obj.usualScore = ""}
            if(!obj.scoreCount){obj.scoreCount = ""}
            if(!obj.scoreFlag){obj.scoreFlag = ""}
            if(!obj.inputName){obj.inputName = ""}
            if(!obj.inputTime){obj.inputTime = ""}
            tableHTML += '<tr data-index="'+i+'"><td style="text-align: center; vertical-align: middle; width: 5%; ">'+ (i+1) +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 79px; ">'+ obj.studentId +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.studentName +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.className +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 91px; ">'+ obj.examScoreScale*100 +'%</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 91px; ">'+ obj.usualScoreScale*100 +'%</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 77px; ">'+ obj.examScore +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 77px; ">'+ obj.usualScore +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 54px; ">'+ obj.scoreCount +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 66px; ">'+ obj.scoreFlag +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 54px; ">'+ obj.inputName +'</td>';
            tableHTML += '<td style="text-align: center; vertical-align: middle; width: 150px; ">'+ obj.inputTime +'</td></tr>';
        }
        var html ='<table border="1" cellspacing="0" bgcolor="#FFFFFF"style="border-collapse:collapse;table-layout:fixed;border:solid 1px black;">' +
            '<caption style="font-size: 18px;font-weight: bold;">正考学生成绩单</caption>' +
            '<thead class="ng-scope"><tr>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; width: 5%; " data-field="" tabindex="0"><div class="th-inner ">序号</div><div class="fht-cell" style="width: 47px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentId" tabindex="0"><div class="th-inner ">学生学号</div><div class="fht-cell" style="width: 79px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="studentName" tabindex="0"><div class="th-inner ">学生姓名</div><div class="fht-cell" style="width: 66px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="className" tabindex="0"><div class="th-inner ">班级名称</div><div class="fht-cell" style="width: 150px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="examScoreScale" tabindex="0"><div class="th-inner ">期末成绩比例</div><div class="fht-cell" style="width: 91px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="usualScoreScale" tabindex="0"><div class="th-inner ">平时成绩比例</div><div class="fht-cell" style="width: 91px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="examScore" tabindex="0"><div class="th-inner ">正考成绩</div><div class="fht-cell" style="width: 77px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="usualScore" tabindex="0"><div class="th-inner ">平时成绩</div><div class="fht-cell" style="width: 77px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreCount" tabindex="0"><div class="th-inner ">总成绩</div><div class="fht-cell" style="width: 54px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="scoreFlag" tabindex="0"><div class="th-inner ">成绩标记</div><div class="fht-cell" style="width: 66px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputName" tabindex="0"><div class="th-inner ">录入人</div><div class="fht-cell" style="width: 54px;"></div></th>' +
            '<th style="font-size: 15px;font-weight: bold;text-align: center; vertical-align: middle; " data-field="inputTime" tabindex="0"><div class="th-inner ">修改时间</div><div class="fht-cell" style="width: 150px;"></div></th>' +
            '</tr></thead>' +
            '<tbody></tbody> '+ tableHTML+'</table>';

        LODOP.ADD_PRINT_HTM(88, 50, 1500, 900, html);
        LODOP.PREVIEW();
    };
    
    // 实时日志显示
    var showImportLog = function ($scope, app) {
        $scope.logs = '';
        var ws = new WebSocket('ws://' + app.rabbitmq.hostname + ':15674/ws');
        var client = Stomp.over(ws);
        var index = 0;
        $scope.$watch('logData', function(newVal){
            if(newVal){
                if(newVal.status=="END"){
                    client.disconnect();
                }
            }
        });
        client.connect(app.rabbitmq.username, app.rabbitmq.password, function () {
            console.log('key: ' + $scope.params.routeKey);
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
                    $scope.logs+=index + '.'+ log+'\r\n';
                });
            });
        }, function () {
            $scope.$apply(function () {
                $scope.logs+='获取导入信息失败'+'\r\n';
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
			$state.go("home.common.entering");
        },500);  
		$("body").fadeIn(800);
	};
	
};
teacherEntering_enteringBatchController.$inject = ['$scope', '$http', '$state', '$stateParams', '$uibModal', '$timeout', '$compile', '$rootScope', '$window', 'alertService', 'teacherEntering_enteringBatchService', 'app', 'formVerifyService'];
})(window);
