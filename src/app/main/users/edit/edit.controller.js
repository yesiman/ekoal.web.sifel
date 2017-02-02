(function ()
{
    'use strict';

    angular
        .module('app.users.edit')
        .controller('UsersEditController',UsersEditController);

    /** @ngInject */
    function UsersEditController($scope,$state, api,$stateParams,orgasResolv,userResolv,$mdDialog,standardizer,$rootScope)
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
            responsive  : true,
            language: standardizer.getDatatableLanguages()
        };
        console.log($stateParams.profil);
        vm.profil = $stateParams.profil;
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour utilisateur"
        };
        $scope.current =  {userForm : {}};
        $scope.id = $stateParams.id;
        $scope.orgas = orgasResolv.items;
        $scope.item = userResolv;
        console.log("userResolv",userResolv);
        
        if (!$scope.item.producteurs) {$scope.item.producteurs= [];}
        if (!$scope.item.parcelles) {$scope.item.parcelles= [];}
        $scope.currentNavItem = "infos";
        //
        $scope.valid = function(frm){
            if($scope.current.userForm.$valid)
            {
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
            
        }
        var mdDialogCtrl = function ($scope, item,onCancel,onValid) { 
            $scope.item = item;
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;   
        }
        $scope.closeMe = function()
        {
            $mdDialog.hide();
        }
        $scope.validLine = function(item){
            if (item.new)
            {
                $scope.item.parcelles.push(item);
            }
            else {
                //Maj ARRAY OBJECT
            }
            $mdDialog.hide();
        }
        $scope.editParc = function(i,ev) {
            var locals = {item: i, onCancel: $scope.closeMe, onValid: $scope.validLine };
            $mdDialog.show({
                templateUrl: 'app/main/users/edit/dialogs/addParc.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: locals,
                controller: mdDialogCtrl,
                controllerAs: 'ctrl',
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                $scope.status = 'You cancelled the dialog.';
            });        
        }
        $scope.removeParc = function(i) {}
        $scope.addParcelle = function(ev){
            var item = {
                new:true,
                lib:"",
                surface:0
            }
            //$scope.dialogItems = response.items;
            var locals = {item: item, onCancel: $scope.closeMe, onValid: $scope.validLine };
            $mdDialog.show({
                templateUrl: 'app/main/users/edit/dialogs/addParc.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: locals,
                controller: mdDialogCtrl,
                controllerAs: 'ctrl',
                clickOutsideToClose:true,
                fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                $scope.status = 'You cancelled the dialog.';
            });            
        }

        //TODO ID NEED
        $scope.loadProducteurs = function() {
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

        if ($rootScope.user.type > 1)
        {
            $scope.item.orga = $rootScope.user.orga;
        }

        if ($scope.item.orga)
        {

            $scope.loadProducteurs();
        }
        
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