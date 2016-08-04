var service = require('./service');
var cookie = require('cookie');
var util = require('./util');
var angular = require('angular');
angular.module('app',['app.appService'])
.controller('loginCtrl', ['appService', '$scope', function(){
  scope.name = 'login';
  scope.appName = util.name;
}]);