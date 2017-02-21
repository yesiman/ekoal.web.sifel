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
        vm.profil = $stateParams.profil;
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour utilisateur"
        };

        


        $scope.current =  {userForm : {}};
        $scope.id = $stateParams.id;
        $scope.orgas = orgasResolv.items;
        $scope.item = userResolv;
        
        if (!$scope.item.producteurs) {$scope.item.producteurs= [];}
        if (!$scope.item.parcelles) {$scope.item.parcelles= [];}
        if (!$scope.item.parcellesToRem) {$scope.item.parcellesToRem= [];}
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
            $scope.item = angular.copy(item);
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;   
        }
        $scope.closeMe = function()
        {
            $mdDialog.hide();
        }
        $scope.validLine = function(item){
            var found = false;
            if (item.id)
            {
                for (var i = 0;i < $scope.item.parcelles.length;i++)
                {
                    if (item.id == $scope.item.parcelles[i].id)
                    {
                        $scope.item.parcelles[i] = item;
                        found = true;
                    }
                }
            }
            else {
                for (var i = 0;i < $scope.item.parcelles.length;i++)
                {
                    if (item._id == $scope.item.parcelles[i]._id)
                    {
                        $scope.item.parcelles[i] = item;
                        found = true;
                    }
                }
            }
            if (!found)
            {
                $scope.item.parcelles.push(item);
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
        $scope.removeParc = function(item,ev) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer cette ligne?')
                .textContent('(Cette action sera prise en compte après sauvegarde)')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(function() {
                for (var i = 0;i < $scope.item.parcelles.length;i++)
                {
                    if ((item._id == $scope.item.parcelles[i]._id) || 
                    ((item.id) && (item.id == $scope.item.parcelles[i].id)))
                    {
                        if (item._id)
                        {
                            $scope.item.parcellesToRem.push($scope.item.parcelles[i]._id);
                        }
                        $scope.item.parcelles.splice(i,1);
                        break;
                    }
                }
            }, function() {
                
            });
        }
        $scope.addParcelle = function(ev){
            var item = {
                id:$scope.item.parcelles.length*10,
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