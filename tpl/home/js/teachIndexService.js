/**
 * Created by test on 2017/6/27.
 */
;(function (window, undefined) {
    'use strict';

    hiocsApp.service("teacher_teacherIndexService", ['$http', '$log', 'app', function($http, $log, app) {

        // 录入成绩、更正成绩
        this.update = function(data,callback) {
            $log.debug("update run ...");
             $http.put(app.api.address + '/score/formalExamScore/inputFormalScore', data)
             .then(function successCallback(response) {
                 if (response.data.code == app.api.code.success) {
                     callback();
                 } else {
                     callback(true, response.data.message);
                 }
             }, function errorCallback(response) {
                 callback(true, response.data.message);
             });
        }

    }]);

})(window);