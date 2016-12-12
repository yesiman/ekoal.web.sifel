(function ()
{
    'use strict';

    angular
        .module('app.users.edit')
        .controller('UsersEditController',UsersEditController);

    /** @ngInject */
    function UsersEditController($scope,$state, api,$stateParams,orgasResolv,userResolv)
    {
        $scope.id = $stateParams.id;
        $scope.orgas = orgasResolv.items;
        $scope.item = userResolv;
        //
        $scope.valid = function(){
            $scope.item.type = parseInt($scope.item.type);
            api.users.add.post({ id:$scope.id, product: $scope.item } ,
                function (response)
                {
                    $state.go("app.users_list");
                },
                function (response)
                {
                    console.error(response);
                }
            );
        }
    }
})();