(function ()
{
    'use strict';

    angular
        .module('app.clients.edit')
        .controller('ClientsEditController',ClientsEditController);

    /** @ngInject */
    function ClientsEditController($scope,$state, api,$stateParams,clientResolv)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour Client"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.clients.add.post({ id:$scope.id, client: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.clients_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.item = clientResolv;
    }
})();