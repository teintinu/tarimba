angular.module('getLostApp', ['lumx']).
controller('MainCtrl', function($rootScope, $scope, $http) {

  $scope.cities = [
    {name:'Manaus', code:'AM'},
    {name:'Pará', code:'PA'},
    {name:'Brasilia', code:'BSB'},
    {name:'Ceará', code:'CE'}
  ];

  $scope.prices = [
    {show:'R$200', value:200},
    {show:'R$300', value:300},
    {show:'R$400', value:400},
    {show:'R$500', value:500}
  ];

  $scope.info = {
    origin: {
      name: 'Goiânia',
      code: 'GYN'
    },
    maxfare: {
      show: 'R$500',
      value: 500
    },
    returndate: '2015-05-20',
    departuredate: '2015-05-15'
  };

//  $scope.submit = function() {
//    $http.get('/api/v1/places?origin=' + $scope.info.origin.code +
//      '&departuredate=' + formatDate($scope.info.departuredate) +
//      '&returndate=' + formatDate($scope.info.returndate) +
//      '&maxfare=' + $scope.info.maxfare.value).success(function(data) {
//        $scope.results = data;
//        $scope.data = data.info;
//        if ($scope.results.status) {
//          $scope.fareinfo = JSON.parse($scope.data).FareInfo;
//        } else {
//          $scope.error = JSON.parse($scope.data.data).message;
//        }
//    }).error(function(err) {
//      $scope.error = JSON.parse(err.data).message;
//    });
//  };

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [day, month, year].join('-');
  }
});
