angular.module('onlinetaskmanager', ['ngSanitize']);
angular.module('onlinetaskmanager').controller('TaskManagerCtrl', function ($scope, $http) {

    $scope.taskList = [];
    $scope.taskCommentsMap = {};
    $scope.currentTask;
    $scope.currentIndex = 0;
    $scope.newComment;
    $scope.init = function() {
        //load data
        $http.get('data/task.json').then(function(res){
            $scope.taskList = res.data;
            if($scope.taskList && $scope.taskList[0]) {
                //$scope.currentTask = $scope.taskList[0];
                $scope.taskSelect(0);
            }
        });
        $http.get('data/taskComments.json').then(function(res){
            $scope.taskCommentsMap = res.data;
        });
        $scope.initNewComment();
    }
    $scope.initNewComment = function(){
        $scope.newComment = {
            author: 'Manish',
            comment: '',
            isAttentionRequired: false
        };
    }
    $scope.taskSelect = function(index) {
        if(index < $scope.taskList.length && (!$scope.currentTask || $scope.taskList[index].id !== $scope.currentTask.id)) {
            $scope.currentTask = $scope.taskList[index];
            for(var i=0; i < $scope.taskList.length; i++) {
                var task = $scope.taskList[i];
                if(task.status == 2) {
                    task.status = 1;
                }
            }
            if($scope.currentTask.status === 1) {
                $scope.currentTask.status = 2;
            }
            $scope.currentIndex = index;
        }
    }
    $scope.getStatusText = function(statusCode) {
        var status;
        if(statusCode === 3) {
            status = 'Completed';
        } else if(statusCode === 2) {
            status = 'On Going';
        } else {
            status = 'Not Started';
        }
        return status;
    }
    $scope.changeStatus = function(currentTask) {
        currentTask.status = 3;
    }
    $scope.addNewComment = function(comment){
        var commentList = $scope.taskCommentsMap[$scope.currentTask.id + ''];
        if(!commentList) {
            commentList = [];
        }
        if(comment.comment && comment.comment.trim() !== '') {
            comment.date = new Date().getTime();
            commentList.push(comment);
            $scope.initNewComment();
        }
    }
});
