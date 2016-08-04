angular.module('app.appService',[])
  .factory('appService',[], function () {
    return {
      random: Math.random
    }
  })