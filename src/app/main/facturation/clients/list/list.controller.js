(function ()
{
    'use strict';

    angular
        .module('app.clients.list')
        .controller('ClientsListController',ClientsListController);

    /** @ngInject */
    function ClientsListController($scope,$state, api,$mdDialog,$rootScope,standardizer,$http)
    {
        var vm = this;
        // Data
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste Clients"
        };
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };
        
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [
                { field: 'code', displayName: 'Code' },
                { field: 'name', displayName: 'Libellé' },
                { field: 'adresse', displayName: 'Adresse' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }];
        $scope.gridOptions.onRegisterApi =  function(gridApi) {
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
                $scope.paginationOptions.pageSize = pageSize;
                $scope.loadPageAction(newPage);
                //paginationOptions.pageNumber = newPage;
                //paginationOptions.pageSize = pageSize;
                //getPage();
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }

        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            api.clients.getAll.get({ pid:$scope.paginationOptions.pageNumber,nbp:$scope.paginationOptions.pageSize },
                // Success
                function (response)
                {
                    console.log(response);
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;
                    $scope.paginationOptions.total = Math.ceil(response.count / $scope.paginationOptions.pageSize);
                    $scope.items = response.items;
                    $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    $rootScope.loadingProgress = false;
                }
            );
        };
        $scope.add = function() {
            $state.go("app.clients_edit", { id:-1 });
        };
        $scope.import = function(element) {
            var file = element.files[0];
            console.log("file",file);
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("http://sifel-srv.ekoal.org/importer/clients/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                $scope.loadPageAction(1);
            })
            .error(function(){
            console.log("error!!");
            });
        };
        $scope.export = function() {
            alert("export");
        };
        $scope.edit = function(id) {
            $state.go("app.clients_edit", { id:id });
        };
        $scope.remove = function(id,ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer cette ligne?')
                .textContent('(Cette action est irréversible))')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(function() {
                $rootScope.loadingProgress = true;
                api.clients.delete.delete({ id:id } ,
                // Success
                function (response)
                {
                    $scope.loadPage();
                    //$scope.item = response;
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
        };
        //INIT
        $scope.loadPage();
        //////////
    }
})();