(function ()
{
    'use strict';

    angular
        .module('app.users.list')
        .controller('UsersListController',UsersListController);

    /** @ngInject */
    function UsersListController($scope,$state, api,$rootScope,$mdDialog,standardizer)
    {
        var vm = this;
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste utilisateurs"
        };
        vm.filters = { 
                levels: []
            };
        switch ($rootScope.user.type)
        {
            case 1:
                vm.filters.levels.push({lib:"Administrateur",checked:true,level:1});
                vm.filters.levels.push({lib:"Administrateur OP",checked:true,level:2});
                break;
            case 2:
                vm.filters.levels.push({lib:"Technicien",checked:true,level:3});
                vm.filters.levels.push({lib:"Producteur",checked:true,level:4});
                vm.filters.levels.push({lib:"Commercial",checked:true,level:5});
                break;
            case 3:
                vm.filters.levels.push({lib:"Producteur",checked:true,level:4});
                break;
        }
        // Data
        $scope.getUserType = function(it)
        {
            switch(it)
            {
                case 1:
                    return "Administrateur";
                case 2:
                    return "Administrateur OP";
                case 3:
                    return "Technicien";
                case 4:
                    return "Producteur";
                case 5:
                    return "Commercial";
            }
            
        }
        $scope.getUserBg = function(it)
        {
            switch(it)
            {
                case 1:
                    return "md-red-400-bg";
                case 2:
                    return "md-green-400-bg";
                case 3:
                    return "md-lime-400-bg";
                case 4:
                    return "md-blue-400-bg";
                case 5:
                    return "md-orange-400-bg";
            }
            
        }
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            pageCount: 0,
            totalItems: 0,
            sort: null
        };
        var typeHtml = '<div class="ui-grid-cell-contents">';
        typeHtml += '<span class="status {{grid.appScope.getUserBg(row.entity.type)}}">{{grid.appScope.getUserType(row.entity.type)}}</span>';
        typeHtml += '</div>';
        
        var actionsHtml = standardizer.getHtmlActions();
        $scope.gridOptions = standardizer.getGridOptionsStd();
        $scope.gridOptions.columnDefs = [];
        if ($rootScope.user.type > 1)
        {
            $scope.gridOptions.columnDefs.push({ field: 'codeAdh', displayName: 'Code adhérent' });
        }
        $scope.gridOptions.columnDefs.push({ field: 'name', displayName: 'Nom' });
        $scope.gridOptions.columnDefs.push({ field: 'surn', displayName: 'Prénom' });
        $scope.gridOptions.columnDefs.push({ field: 'type', displayName: 'Type', cellTemplate:typeHtml });
        $scope.gridOptions.columnDefs.push({ name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" });
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
                //paginationOptions.pageNumber = newPage;
                $scope.paginationOptions.pageSize = pageSize;
                //getPage();
                $scope.loadPageAction(newPage);
            });
        }
            
        $scope.loadPageAction = function(id)
        {
            $scope.paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            
            var levels = [];
            $rootScope.loadingProgress = true;
            angular.forEach(vm.filters.levels, function(value) {
                if (value.checked)
                {
                    levels.push(value.level);
                }   
            });
            api.users.getAll.post({ pid:$scope.paginationOptions.pageNumber,
                nbp:$scope.paginationOptions.pageSize,levels:levels,txtFilter:vm.filters.text },
                // Success
                function (response)
                {
                    //$scope.maxSize = 5;
                    //$scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;
                    //$scope.paginationOptions.total = Math.ceil(response.count / $scope.paginationOptions.pageSize);
                    $scope.items = response.items;
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
        $scope.add = function() {
            $state.go("app.users_edit", { id:-1 });
        };
        $scope.edit = function(id) {
            $state.go("app.users_edit", { id:id });
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
                api.users.delete.delete({ id:id } ,
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