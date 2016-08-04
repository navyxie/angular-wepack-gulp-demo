// var service = require('./service');
// var cookie = require('cookie');
// var angular = require('angular');
require('../../css/reset.css');
require('../../css/index.css');
require('../../css/theme.css');
angular.module('app',[])
.controller('indexCtrl',['$scope', function(scope){
  scope.name = 'index, welcome!';
}]);