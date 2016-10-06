/**
 * Created by sachinPc on 10/5/2016.
 */

var app = angular.module('userHome',['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/signUp',
            controller: ''
        }) .when('/success', {
            templateUrl: '/users/success',
            controller: ''
        })
        .when('/userPage', {
            templateUrl: '/userPage',
            controller: ''
        })
})

app.controller('userCtrl',function($scope, $http, $location){
    $scope.error = " ";
    $scope.success= " ";
    $scope.register = function(){
        $http.post('/users/signup',
            { 'user': $scope.user})
            .then(function(data){
                $scope.success = "Successfully registered";
                $scope.error = "";
            },function(res){
                $scope.error = res.data.error.message;
            });

};
});

app.controller('homeCtrl',function($scope, $http, $location){

});