(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('RulesEditController',RulesEditController);

    /** @ngInject */
    function RulesEditController($scope,$state)
    {
        $scope.current =  {userForm : {}};
        var vm = this;
        
    }
})();