;(function (window, undefined) {
    'use strict';
    window.teacher_teacherIndexController = function ($scope, $http, $timeout, $state, $uibModal, $compile, $rootScope, $localStorage, $cookies, $interval, $window, alertService, teacher_teacherIndexService, app) {
		
		// 获取当前登录用户名
		$scope.user = {};
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
			$scope.user.name = cookieasJson.name;
		}
		
		// 跳转到录入页面
		$scope.jumpToEntering = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.entering");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到补考录入页面
		$scope.jumpToMakeupEntering = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.makeupEntering");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到考试方式申请
		$scope.jumpToExamMethodApproval = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.examMethodApproval");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到监考安排
		$scope.jumpToInvigilateArrange = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.invigilateArrange");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到课表查询
		$scope.jumpToScheduleQuery = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.scheduleQuery");
            },500);
			$("body").fadeIn(800);
		};
		
		// 回到首页，如果cookie为空，则直接回到首页
		$scope.switchIndexPage = function(){
			$("body").fadeOut();
			$timeout(function () {
				if($cookies.getObject("user") != null && $cookies.getObject("user") != undefined){
					if($cookies.getObject("user").indexOf("teacher-login") > 0){	// 回到教师端的首页
			            $state.go('teacherIndex');
					}else if($cookies.getObject("user").indexOf("student-login") > 0){	// 回到学生端的首页
			            $state.go('studentIndex');
					}else if($cookies.getObject("user").indexOf("manager-login") > 0){	// 回到管理端的首页
			            $state.go('home.index');
					}
				}else{	// 登出
	            	$rootScope.showLoading = false; // 关闭加载提示
	            	$localStorage.$reset();
	            	$interval.cancel($rootScope.stopSessionCheck);
		            $state.go('login');
				}
            }, 500);
			$("body").fadeIn(800);
		};
		

		// 获取权限
//		$http({
//			method: "get",
//			url: "/api/privilege",
//			params: {
//				type: 'menu',
//				code: 'jwjsd'
//			}
//		}).then(function(response) {
//			var arr = response.data.data;
//			for(var i = 0; i < arr.length; i++) {
//				for(var j in $scope.privileges) {
//					if(arr[i].code == j && arr[i].enable) {
//						$scope.privileges[j] = true;
//					}
//				}
//			}
//		}, function(response) {
//			
//		});

		// 权限状态
		$scope.privileges = {
			jwjsd_jxjdzd: false,
			jwjsd_kccjlr: false,
			jwjsd_tykcjlr: false,
			jwjsd_cjjfc: false,
			jwjsd_cjfchf: false,
			jwjsd_ggxxkkksq: false,
			jwjsd_ttksq: false,
			jwjsd_jsjysq: false,
			jwjsd_sykpjjgcx: false,
			jwjsd_llkpjjgcx: false,
			jwjsd_yxkcxxcx: false,
			jwjsd_jsskqkjkxjscx: false,
			jwjsd_jxjhcx: false,
			jwjsd_kkjhcx: false,
			jwjsd_rkxxcx: false,
			jwjsd_xkrzcx: false,
			jwjsd_xscx: false
		};

		// 获取公告信息
		$scope.eduForList = [];
		$scope.collegeForList = [];
		var EduForListCount = 0;
		var CollegeForListCount = 0;
		$http({
			method: "get",
			url: app.api.address + "/system/informNotice",
			params: {
				pageSize: 100,
				pageNum: 1
			}
		}).then(function(response) {
			angular.forEach(response.data.data.list, function(eduArr) {
				if(eduArr.noticeTypeName == "院系公告" && EduForListCount < 3){
					var cellEduForList = {
						content : eduArr.content,
						title : eduArr.noticeName,
						id : eduArr.noticeId
					};
					$scope.eduForList.push(cellEduForList);
					EduForListCount++;
				}else if(eduArr.noticeTypeName == "教务处公告" && CollegeForListCount < 3){
					var cellCollegeForList = {
						content : eduArr.content,
						title : eduArr.noticeName,
						id : eduArr.noticeId
					};
					$scope.collegeForList.push(cellCollegeForList);
					CollegeForListCount++;
				}
			});
		}, function(response) {
			
		});

		// 获取公告详情
		$scope.getNoticeDetial = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/home/js/notice/see.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: noticeDetialController
			});
		};
		
		// 查看公告详情控制器
		var noticeDetialController = function($compile, $scope, $uibModalInstance, $http, item, $sce) {
			$scope.noticeHtml = $sce.trustAsHtml(item.content);
			$scope.title = item.title;
			$scope.close = function() {
				$uibModalInstance.close();
			}
		}
		noticeDetialController.$inject = ['$compile', '$scope', '$uibModalInstance', '$http', 'item', '$sce'];				// 获取左侧学生基本信息
		
		// 左侧教师基本信息
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule",
			params: {
				type: 'selectTeacherInfo',
				teacherNum: cookieasJson.userName
			}
		}).then(function(response) {
			$scope.teacher = response.data.data.rows[0];
			$scope.teacher.entranceModeName = "教师";
			/*if($scope.teacher.teacherTypeNum == '50') {
				$scope.teacher.teacherTypeName = "外聘教师";
			} else {
				$scope.teacher.teacherTypeName = "校本部教职工";
			}*/
			// 教师基本信息
//			$scope.teacher = {
//				'entranceModeName': '教师',
//				'teacherNum': '040003',
//				'departmentNumName': '电软系',
//				'teacherTypeName': '校本部教职工',
//				'thisStateNumName': '在校',
//				'schoolName': '东校区'
//			};
		}, function(response) {
			console.log(response);
		});

		/* ***************************页面交互开始*************************** */
		// 左侧动画效果
		$scope.teacherLeft = function() {
			if($('.all-left').find($('.fa-outdent')).length > 0) {
				$(".all-left .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
				$('.all-left').css('width', "50px");
				$('.all-left_wrap').css('display', "none");
				$('.all-right').css('width', "calc(100% - 60px)");
				$('.footer').css({
					'width': "calc(100% - 60px)",
					'margin-left': "50px"
				});
			}else{
				$(".all-left .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-left').css('width', "230px");
				$('.all-right').css('width', "calc(100% - 240px)");
				$('.footer').css({
					'width': "calc(100% - 230px)",
					'margin-left': "230px"
				});
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}
		};

		/* 上滑下滑开始 */
		//教务处公告
		$scope.showHideEduList = function() {
			$scope.hideEduList = !$scope.hideEduList;
		};
		
		//院系公告
		$scope.showHideCollegeList = function() {
			$scope.hideCollegeList = !$scope.hideCollegeList;
		};
		
		//我的服务收缩
		$scope.showHideIcon = function() {
			$scope.teachIcon = !$scope.teachIcon;
		};
		
		// 我的服务下的卡片切换
		$('.showHideIcon').click(function() {
			if($('.teachIcon').css('display') == 'none') {
				$('.teachIcon').show();
			} else {
				$('.teachIcon').hide();
			}
		})

		//我的贡献收缩
		$scope.showHideDetails = function() {
			$scope.details = !$scope.details;
		};
		
		//我的课表
		$scope.showHideSchedule = function() {
			$scope.scheduleText = !$scope.scheduleText;
		};
		/* 上滑下滑结束 */

		// 提示语展示
		var ttmier;
		$('.tips,.tips_ct').hover(function() {
			clearTimeout(ttmier);
			$('.tips_ct').stop(true).show()
		}, function() {
			ttmier = setTimeout(function() {
				$('.tips_ct').stop(true).hide()
			}, 1000)
		})
		
		var navWidth = $(".tabs-all").width();
		$scope.liWidth = navWidth / 10;

		// 我的课表的周次滑动效果
		$scope.weeklyShow = function() {
			//周次切换
			var i = 10; //定义每个面板显示8个菜单
			var len = $scope.weeklyList.length; //获得LI元素的个数
			var page = 1;
			var maxpage = Math.ceil(len / i);
			$scope.next = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == maxpage) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "-=" + navWidth + "px"
						}, 1500);
						page++;;
					}
				}
			};
			$scope.pre = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == 1) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "+=" + navWidth + "px"
						}, 1500);
						page--;;
					}
				}
			};
		};
		/* ***************************页面交互结束*************************** */

		// 成绩录入情况
		$scope.teacherEnteringSituation = {};
		$http({
			method: "get",
			url: app.api.address + "/score/scoreEntering/queryTeacher",
			params: {
				type : 'selectSituation',
//				user_ID : '000007'
				user_ID : cookieasJson.userName
			}
		}).then(function(response) {
            $scope.teacherEnteringSituation = response.data.data.rows[0];
		}, function(response) {
			console.log(response);
		});
		
		// 获取当前学年学期
		var academicYear = "";
		$http({
			method: "get",
			url: app.api.address + '/base-info/acadyearterm/showNewAcadlist'
		}).then(function(response) {
			academicYear = response.data.data.acadYearSemester;
			$scope.academicYear = academicYear;
			
			// 教师课程数【2参】
			$scope.teacherContribution = {
				teachCourseNumber : "0",
				teachClassNumber : "0",
				teachTotalPeriod : "0"
			};
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectTeachCourseNumber/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherContribution.teachCourseNumber = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});

			// 教师教学班数【2参】
			$scope.teacherContribution = {};
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectTeachingClassNumber/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherContribution.teachClassNumber = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});

			// 教师总学时数【2参】
			$scope.teacherContribution = {};
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectTotalHours/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherContribution.teachTotalPeriod = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});

			// 当前学期下教师课程数【2参】
			$scope.teacherNowContribution = {
				teachCourseNumber : "0",
				teachClassNumber : "0",
				teachTotalPeriod : "0"
			};
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectCurrentTeachCourseNumber/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherNowContribution.teachCourseNumber = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});

			// 当前学期下教师教学班数【2参】
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectCurrentTeachingClassNumber/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherNowContribution.teachClassNumber = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});

			// 当前学期下教师总学时数【2参】
            $http({
            	method: "get",
				url: app.api.address + "/arrange/scheduleArrange/selectCurrentTotalHours/" + cookieasJson.userName + "&" + $scope.academicYear
		    })
            .then(function(response) {
            	if(response.data.data != null){
	          		$scope.teacherNowContribution.teachTotalPeriod = response.data.data;
            	}
	        },function(response) {
	          	console.log(response);
	    	});
	    	
		}, function(response) {
			console.log(response);
		});
		
		// 显示节次信息
		$scope.sectionList = {};
		$http({
			method: "get",
			url: app.api.address + '/arrange/teacherTimeDemand',
			params: {
				type : 'selectSection',
				semesterId : '2017-2018-1'
			}
		}).then(function(response) {
			// 给每一个节次行赋值id
			for(var i=0; i<response.data.data.rows.length; i++){
				response.data.data.rows[i] = {
					beginTime : response.data.data.rows[i].beginTime,
					endTime : response.data.data.rows[i].endTime,
					section : response.data.data.rows[i].section,
					sectionId : response.data.data.rows[i].sectionId,
					semesterId : response.data.data.rows[i].semesterId,
					id : i+1
				}
			}
			$scope.sectionList = response.data.data.rows;
		}, function(response) {
			console.log(response);
		});
		
		// 获取当前周次和周次名称
		$scope.weekly = "";
		$scope.weeklyList = {};
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule",
			params: {
				type : 'selectSectionList',
				pageSize : '50'
			}
		}).then(function(response) {
			$scope.weeklyList = response.data.data.rows;
			$scope.currentWeekly = response.data.data.rows[0].currentWeekly; // 当前周次
			
			if($scope.currentWeekly == undefined || $scope.currentWeekly == 'undefined') {
				$scope.currentWeekly = "1";	// 默认初始化为1
			}
			
			$scope.weeklyShow();
			$scope.getCourse($scope.currentWeekly);
		}, function(response) {
			console.log(response);
		});
		
		$scope.weekTimeMap = {};
//		// 获取周次的信息并刷新数据，每次点击重新请求数据【参数：当前学年学期    & 所选周次】
		$scope.getCourse = function(weekly) {
			$scope.weekly = weekly;
			var academicYear = $scope.academicYear;
			//课程信息
			//加载动画
			$scope.showLoading = true;
			$http({
				method: "get",
				url: app.api.address + "/arrange/teacherSchedule",
				params: {
					type: 'selectTeachStateSchedule',
					teacherNum: cookieasJson.userName,
					weekly: weekly
				}
			})
			.then(function(response) {
				var data = response.data.data.rows;
				var j = 0;
				$scope.courseList = [];
				for(var i = 0; i < $scope.sectionList.length; i++) {
					if(data[j] != undefined && "" + (i + 1) == data[j].section) {
						$scope.courseList[i] = data[j];
						j++;
					} else {
						$scope.courseList[i] = {};
					}
				}
				$scope.showLoading = false;
				
//				$timeout(function(){
//					// 合并上下table的代码 开始
//					var lastValue = "";
//					var value = "";
//					var pos = 1;
//					var row = 1;
//					var col = 0;
//					var tb = document.getElementById('tbody');
//					for(var j = 1; j <= 7; j++) {	// 循环7列
//						for(var i = row; i <= tb.rows.length; i++) {	// 循环11行
//							if(document.getElementById(i+'_'+j).innerText == null){
//								break;
//							}
//							
//							value = document.getElementById(i+'_'+j).innerText;
//							
//							if(lastValue == value) {
//								document.getElementById(i+'_'+j).deleteCell(col);
//								document.getElementById(i+'_'+j).rowSpan = document.getElementById(i+'_'+j).rowSpan + 1;
////								pos++;
//							} else {
//								lastValue = value;
////								pos = 1;
//							}
//						}
//					}
//					// 合并上下table的代码 结束
//	            },1000);
				
			}, function(response) {
				console.log(response);
			});
			
			//获取周的开始时间和结束时间【（2017-12-03至2017-12-09）】 不需要学年学期Id，只需要周次
			$http({
				method: "get",
				url: app.api.address + "/arrange/teacherSchedule",
				params: {
					type: 'selectMaxMinTime',
					weekly: $scope.weekly
				}
			})
			.then(function(response) {
				$scope.weekTimeMap = response.data.data.rows[0];
			}, function(response) {
				console.log(response);
			});
		};

		// 合并上下table的代码
//		$scope.autoRowSpan = function(tb, row, col) {
//			var lastValue = "";
//			var value = "";
//			var pos = 1;
//			for(var i = row; i < tb.rows.length; i++) {
//				value = tb.rows[i].cells[col].innerText;
//				if(lastValue == value) {
//					tb.rows[i].deleteCell(col);
//					tb.rows[i - pos].cells[col].rowSpan = tb.rows[i - pos].cells[col].rowSpan + 1;
//					pos++;
//				} else {
//					lastValue = value;
//					pos = 1;
//				}
//			}
//		}
		
//		window.onload = $scope.autoRowSpan(tb, row, col);

	};
	teacher_teacherIndexController.$inject = ['$scope', '$http', '$timeout', '$state', '$uibModal', '$compile', '$rootScope', '$localStorage', '$cookies', '$interval', '$window', 'alertService', 'teacher_teacherIndexService', 'app'];
})(window);


