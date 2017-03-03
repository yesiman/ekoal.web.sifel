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
        vm.profil = $stateParams.profil;

        var producteurHtml = '<div class="ui-grid-cell-contents">';
        producteurHtml += '{{grid.appScope.getProducteurName(row.entity.producteur)}}';
        producteurHtml += '</div>';
        var semaineHtml = '<div class="ui-grid-cell-contents">';
        semaineHtml += '{{row.entity.semaine}} / {{row.entity.startAt | date : "yyyy"}}';
        semaineHtml += '</div>';
        var qteHtml = '<div class="ui-grid-cell-contents">';
        qteHtml += '{{grid.appScope.getGoodQte(row.entity)}}';
        qteHtml += '</div>';
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '</div>';
        vm.gridParcsOptions = standardizer.getGridOptionsStd();
        vm.gridParcsOptions.columnDefs = [
            { field: 'lib', sort:{priority:0}, displayName: 'Libellé' },
            { field: 'surface', sort:{priority:0}, displayName: 'Surface' },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];
            vm.gridParcsOptions.totalItems = 100;        
        vm.gridParcsOptions.onRegisterApi =  function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                //paginationOptions.sort = null;
                } else {
                //paginationOptions.sort = sortColumns[0].sort.direction;
                }
                //getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                alert(newPage);
            });
        }
        //
        vm.gridProducteursOptions = standardizer.getGridOptionsStd();
        vm.gridProducteursOptions.columnDefs = [
            { field: 'name', sort:{priority:0}, displayName: 'Nom' },
            { field: 'surn', sort:{priority:0}, displayName: 'Prénom' },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];
            vm.gridParcsOptions.totalItems = 100;        
        vm.gridProducteursOptions.onRegisterApi =  function(gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length == 0) {
                //paginationOptions.sort = null;
                } else {
                //paginationOptions.sort = sortColumns[0].sort.direction;
                }
                //getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //alert(newPage);
            });
        }
        //
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

        //vm.gridOptions.totalItems = $scope.item.parcelles.length;
        vm.gridParcsOptions.data = $scope.item.parcelles;
        

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
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    vm.gridProducteursOptions.totalItems = response.count;
                    vm.gridProducteursOptions.data = response.items;
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