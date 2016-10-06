

var app = angular.module('libraryHome',['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.when('/managementPage/?:id', {
        controller: 'libCtrl'
    });
});

app.controller('libCtrl',function($scope, $http, $routeParams){

    console.log($routeParams)
    console.log("ewfewfwfds");
    $scope.error = " ";
    $scope.success= " ";
    $scope.register = function(){
        $http.post('/admin/signup',
            { 'admin': $scope.admin})
            .then(function(data){
                $scope.error = " ";
                $scope.success = "Successfully registered";
            },function(res){
                console.log(res);
                $scope.success= " ";
                $scope.error = res.data.err;
            });

    };
});

app.controller('adminLoginCtrl',function($scope, $http, $location, $window){

    $scope.error = " ";
    $scope.success= " ";
    $scope.login = function(){

        $http.post('/admin/login',
            {
                'username': $scope.enterusername,
                'password': $scope.password
            }).then(function(data){
                var host= "http://localhost:3000/managementPage/" + data.data.data;
                $window.location.href = host;
            },function(res){
                console.log(res);
                $scope.error = "Username or Password Incorect";
            });

    };
});