var service = require('./service');
// var util = require('./util');
// var angular = require('angular');
require('../../css/reset.css');
require('../../css/login.css');
angular.module('app',['app.appService'])
.controller('loginCtrl', ['appService', '$scope', function(appService, scope){
  scope.name = 'login, welcome!';
  scope.appName = util.name;
  scope.random = appService.random();
}]);