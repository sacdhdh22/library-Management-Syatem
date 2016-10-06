
var app = angular.module('adminHome',['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/addBooks', {
            templateUrl: '/admin/addbooks',
            controller: ''
        })
        .when('/viewTodaysSummary', {
            templateUrl: '/admin/viewTodaysSummary',
            controller: ''
        })
        .when('/allocate', {
            templateUrl: '/admin/allocate',
            controller: ''
        }).when('/checkUser', {
            templateUrl: '/admin/checkUser',
            controller: ''
        }).when('/bookDelivery', {
            templateUrl: '/admin/bookDelivery',
            controller: ''
        })
})
app.controller('adminCtrl',function($scope, $http, $window){
    console.log("ds");
    $scope.error = " ";
    $scope.success= " ";
    $scope.register = function(){
        $http.post('/admin/signup',
            { 'admin': $scope.admin})
            .then(function(data){
                $scope.error = " ";
                $window.location.href = '/admin/loginPls';
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
                var host= "http://localhost:3000/managementPage/" + "?:" +data.data.data;
                $window.location.href = host;
            },function(res){
                console.log(res);
                $scope.error = "Username or Password Incorect";
            });

    };
});

app.controller('manageCtrl',function($scope, $http, $location){
console.log("dsds");
});

app.controller('addBookCtrl',function($scope, $http, $location){
    $scope.success= " ";
$scope.submitBooks = function(){
        $http.post('/admin/addBooks', {book: $scope.book}).success(function (data) {
            $scope.success = "Successfully Added";
        })
}
});

app.controller('homeCtrl',function($scope, $http, $location){

});

app.controller('alocateBookCtrl',function($scope, $http, $location){
    $scope.success= " ";
    $scope.allocate = function(){
        $http.post('/admin/allocate', { allocatedBook : $scope.allocatedBook}).success(function(data){
            $scope.success = "Successfully allocated";
        })
    };


});

app.controller('bookDeliveryCtrl',function($scope, $http, $location){

        $http.get('/admin/getTranactions').success(function(data){
            console.log(data);
           $scope.transactions =  data;
        });



});

app.controller('checkUserCtrl',function($scope, $http, $location){
    $http.get('/admin/getBook').success(function(data){
        $scope.books = data;
    });
    var userId;
    $scope.error= "";
    $scope.result = false;
    $scope.checkUser = function(){
        $http.post('/admin/checkUser', { email : $scope.useremail}).then(function(data){
            $scope.result = true;
            $scope.error= "";
            userId = data.data._id
            $scope.fullname = data.data.fullname;$scope.Email = data.data.email;$scope.Number = data.data.number;

        },function(res){
            $scope.error = "User Does not Exist";
        });


    };


    $scope.storeTransaction= function(bookId){
       $http.post('/admin/transaction',{
           userId : userId,
           bookId: bookId
       }).then(function(data){
           $http.get('/admin/changeStatus/'  + bookId).success(function(data){
               $http.get('/admin/getBook').success(function(data){
                   $scope.books = data;
               });
           })
       },function(response){
           console.log(response);
       });
    }

});

