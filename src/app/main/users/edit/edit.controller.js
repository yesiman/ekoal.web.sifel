(function ()
{
    'use strict';

    angular
        .module('app.users.edit')
        .controller('UsersEditController',UsersEditController);

    /** @ngInject */
    function UsersEditController($scope,$state, api,$stateParams,orgasResolv,userResolv)
    {
        
        var vm = this;

        // Data
        //vm.products = Products.data;
        vm.producteurs;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true
        };


        $scope.id = $stateParams.id;
        $scope.orgas = orgasResolv.items;
        $scope.item = userResolv;
        if (!$scope.item.producteurs)
        {$scope.item.producteurs= [];}
        $scope.currentNavItem = "infos";
        $scope.gotoPg = function(pg){
            if (pg === "producteurs")
            {
                $scope.loadPage();
            }
            $scope.currentNavItem = pg;
        }
        //
        $scope.valid = function(){
            $scope.item.type = parseInt($scope.item.type);
            api.users.add.post({ id:$scope.id, user: $scope.item } ,
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

        $scope.loadPage = function() {
            api.users.getAllByOrga.get({ pid:1,nbp:100, ido:$scope.item.orga },
                // Success
                function (response)
                {
                    /*$scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;*/
                    //  console.log(response.items);
                    vm.producteurs = response.items;
                    //$rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    console.error(response);
                    $rootScope.loadingProgress = false;
                }
            );
            
        };
        $scope.contactChecked = function(contact) {
            if (!$scope.contactExists(contact))
            {
                $scope.item.producteurs.push(contact._id);
            }
            else {
                $scope.item.producteurs.splice($scope.contactId(contact));
            }
        }
        $scope.contactExists = function(contact) {
            for (var i = 0;i < $scope.item.producteurs.length;i++)
            {
                if ($scope.item.producteurs[i] === contact._id)
                {
                    return true;
                }   
            }
            return false;
        }
        $scope.contactId = function(contact) {
            for (var i = 0;i < $scope.item.producteurs.length;i++)
            {
                if ($scope.item.producteurs[i] === contact._id)
                {
                    return i;
                }   
            }
            return -1;
        }
    }
})();