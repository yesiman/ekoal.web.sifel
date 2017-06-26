(function ()
{
    'use strict';

    angular
        .module('app.bons.edit')
        .controller('BonsEditController',BonsEditController);

    /** @ngInject */
    function BonsEditController($scope,$state, api,$stateParams,$q)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour bon"
        };
        
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            api.bons.add.post({ id:$scope.id, bon: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.bons_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.stations.getAll;
                    methodArgs = { pid:1,nbp:1000 };
                    methodBase.get(methodArgs,
                        function (response)
                        {
                            console.log("response",response);
                            deferred.resolve( response.items );
                        },
                        // Error
                        function (response)
                        {
                            console.error(response);
                            //return null;
                        }
                    );
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4,req:$scope.item.producteurSearch };
                    methodBase.get(methodArgs,
                        function (response)
                        {
                            deferred.resolve( response.items );
                        },
                        // Error
                        function (response)
                        {
                            console.error(response);
                            //return null;
                        }
                    );
                    break;
                
            }
           
            return deferred.promise;
        }
    }
})();