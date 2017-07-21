(function ()
{
    'use strict';

    angular
        .module('app.users.edit')
        .controller('UsersEditController',UsersEditController);

    /** @ngInject */
    function UsersEditController($scope,$state, api,$stateParams,orgasResolv,stationsResolv,userResolv,
        $mdDialog,standardizer,$rootScope,$mdToast)
    {
        
        var vm = this;

        

        // Data
        //vm.products = Products.data;
        vm.producteurs;
        vm.profil = $stateParams.profil;
        
        vm.producteurTxtFilter = "";
        vm.producteurPsize = 10;

        vm.parcelleTxtFilter = "";
        vm.parcellePsize = 10;

        var surfaceHtml = '<div class="ui-grid-cell-contents">';
        surfaceHtml += '{{row.entity.surface}}';
        surfaceHtml += '</div>';
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.editParc(row.entity,$event)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removeParc(row.entity,$event)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        vm.gridParcsOptions = standardizer.getGridOptionsStd();

        

         
        vm.gridParcsOptions.rowTemplate='<div ng-class="{\'italicRow\':(!row.entity.actif) }"  ng-mouseover="rowStyle={\'background-color\': \'#dcedc8\',\'cursor\': \'pointer\'};grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  ng-click="grid.appScope.editParc(row.entity,$event, col.colDef)" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
        
        vm.gridParcsOptions.columnDefs = [
            { field: 'lib', sort:{priority:0}, displayName: 'Libellé' },
            { field: 'cadastre', sort:{priority:0}, displayName: 'Cadastre' },
            { field: 'surface', sort:{priority:0}, displayName: 'Surface (hectares)', cellTemplate:surfaceHtml },
            { field: 'altitude', sort:{priority:0}, displayName: 'Altiutde (mètres)' },
            { name: 'actions', cellTemplate: actionsHtml, width: "150" }];   
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
                vm.parcellePsize = pageSize;
                $scope.getParcelles(newPage,pageSize);
            });
        }
        //
        vm.gridProducteursOptions = standardizer.getGridOptionsStd();
        vm.gridProducteursOptions.columnDefs = [
            { field: 'selected', name: '',cellEditableContition: false, width:"40",type: 'boolean',cellTemplate:'<div class="ui-grid-cell-contents text-center"><md-checkbox ng-click="grid.appScope.addProducteur(row.entity._id)" ng-model="row.entity.selected" ng-checked="grid.appScope.isProducteurForMe(row.entity)" class="md-warn"></md-checkbox></div>' },
            { field: 'name', sort:{priority:0}, displayName: 'Nom' },
            { field: 'surn', sort:{priority:0}, displayName: 'Prénom' }];
        vm.gridProducteursOptions.totalItems = 100;        
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
                vm.producteurPsize = pageSize;
                $scope.loadProducteurs(newPage,pageSize);
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
        $scope.stations = stationsResolv.items;
        $scope.item = userResolv;
        $scope.profil = $stateParams.profil;

        if (!$scope.item.producteurs) {$scope.item.producteurs= [];}
        if (!$scope.item.parcelles) {$scope.item.parcelles= [];}
        if (!$scope.item.parcellesToRem) {$scope.item.parcellesToRem= [];}

        

        $scope.isProducteurForMe = function(it) {
            for (var i = 0;i < $scope.item.producteurs.length;i++)
            {
                if ($scope.item.producteurs[i] == it._id)
                {
                    it.selected = true;
                    return true;
                }
            }
            it.selected = false;
            return false;
        }
        $scope.addProducteur = function(id) {
            for (var i = 0;i < $scope.item.producteurs.length;i++)
            {
                if ($scope.item.producteurs[i] == id)
                {
                    $scope.item.producteurs.splice(i,1);
                    return;
                }
            }
            $scope.item.producteurs.push(id);
        }
        
        $scope.getParcelles = function(pid,psize) {
            if ($scope.item.type == 4)
            {
                api.users.getParcelles.post({ pid:pid,nbp:psize,id:$scope.item._id,req:vm.parcelleTxtFilter },
                    function (response)
                    {
                        vm.gridParcsOptions.totalItems = response.count;     
                        vm.gridParcsOptions.data = response.items;
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                        //return null;
                    }
                );
            }
        }
        var map;
            var bounds;
            
        if ($scope.item.type == 4)
        {
            $scope.getParcelles(1, vm.parcellePsize);
            
            //if (!$rootScope.mapInjected) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "googleMaps";
                script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyAKuOtLqUR5I6LaqCMNADzppolXaH8w2JE&libraries=geometry&callback=mapInit';

                //script.src = 'http://maps.google.com/maps/api/js?key=AIzaSyAKuOtLqUR5I6LaqCMNADzppolXaH8w2JE&libraries=geometry&callback=mapInit';

                document.body.appendChild(script);
            //}
            //else {
                //$scope.mapInit();
                //$scope.drawParc();
            //}
            window.mapInit = function () {
                $rootScope.mapInjected = true;
                map = new google.maps.Map(document.getElementById('map'), {center: {lat: -34.397, lng: 150.644},zoom: 8});
            
            bounds = new google.maps.LatLngBounds();
            api.users.getParcelles.post({ pid:1,nbp:1000,id:$scope.item._id,req:"" },
                    function (response)
                    {
                        for (var i = 0;i< response.items.length;i++)
                        {
                            var triangleCoords = [];
                            if (response.items[i].coordonnees)
                            {
                                angular.forEach(response.items[i].coordonnees.coordinates, function(value) {
                                    triangleCoords.push({ lat: value[1], lng: value[0] });
                                    console.log(value[1] + ":",value[0])
                                    bounds.extend(new google.maps.LatLng(value[1], value[0]));
                                });
                                var parcelleDraw = new google.maps.Polygon({
                                    paths: triangleCoords,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35
                                });
                                parcelleDraw.setMap(map);
                                map.fitBounds(bounds);
                            }
                        }
                        console.log(response.count);
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                        //return null;
                    }
                );
            };


            
            
        }

        //vm.gridOptions.totalItems = $scope.item.parcelles.length;

        

        $scope.currentNavItem = "infos";
        //
        $scope.valid = function(frm){
            if($scope.current.userForm.$valid)
            {
                $scope.item.type = parseInt($scope.item.type);
                api.users.add.post({ id:$scope.id, user: $scope.item } ,
                    function (response)
                    {
                        if (response.res == false)
                        {
                            var toast = $mdToast.simple()
                                .textContent('Email ou login déja utilisés !')
                                .action('FERMER')
                                .highlightAction(true)
                                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                .position('bottom right');

                            $mdToast.show(toast).then(function(response) {
                                if ( response == 'ok' ) {
                                    
                                }
                            });
                        }
                        else {
                        $state.go("app.users_list");}
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
            $rootScope.loadingProgress = true;
            //Attribution producteur parcelle
            item.producteur = $scope.item._id;
            //Sauvegarde parcelle
            api.users.addParcelle.post({ id:(item._id?item._id:"-1"), parcelle: item } ,
                function (response)
                {
                    $mdDialog.hide();
                    $scope.getParcelles(1,vm.parcellePsize);
                    $rootScope.loadingProgress = false;
                },
                function (response)
                {
                    $mdDialog.hide();
                    $rootScope.loadingProgress = false;
                }
            );
            
            //$scope.getParcelles(newPage,vm.parcellePsize);
            $mdDialog.hide();
        }
        $scope.editParc = function(i,ev,col) {
            if(col)
            {
                if (col.name == "actions")
                {
                    return;
                }
            }
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
                .textContent('(Cette action est irréversible))')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                api.users.deleteParcelle.delete({ id:item._id } ,
                    // Success
                    function (response)
                    {
                        $scope.getParcelles(1, vm.parcellePsize);
                        $rootScope.loadingProgress = false;
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                        $rootScope.loadingProgress = false;
                    }
                );
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
        $scope.loadProducteurs = function(pid,nbp) {
            api.users.getAllByOrga.post({ pid:pid,nbp:nbp, ido:$scope.item.orga, req:vm.producteurTxtFilter },
                // Success
                function (response)
                {
                    vm.gridProducteursOptions.totalItems = response.count;
                    vm.gridProducteursOptions.data = response.items;

                    $rootScope.loadingProgress = false;
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

            $scope.loadProducteurs(1,10);
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