(function ()
{
    'use strict';

    angular
        .module('app.users.list')
        .controller('UsersListController',UsersListController);

    /** @ngInject */
    function UsersListController($scope,$state, api,$rootScope,$mdDialog,standardizer,$http)
    {
        var vm = this;
        $scope.head = {
            ico:"icon-account-box",
            title:"Liste utilisateurs"
        };

        var filters = $rootScope.filters.UsersListController;
        if (filters)
        {
            vm.filters = filters;
        }
        else {
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
        

        $scope.gridOptions.rowTemplate='<div ng-class="{\'italicRow\':(!row.entity.actif) }"  ng-mouseover="rowStyle={\'background-color\': \'#dcedc8\',\'cursor\': \'pointer\'};grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div  ng-style="rowStyle" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name"  ng-click="grid.appScope.edit(row.entity._id, col.colDef)" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
         if ($rootScope.user.type > 1)
        {
            $scope.gridOptions.columnDefs.push({ field: 'codeAdh', displayName: 'Code adhérent' });
        }
        $scope.gridOptions.columnDefs.push({ field: 'name', displayName: 'Nom' });
        $scope.gridOptions.columnDefs.push({ field: 'surn', displayName: 'Prénom' });
        $scope.gridOptions.columnDefs.push({ field: 'type', displayName: 'Type', cellTemplate:typeHtml });
        $scope.gridOptions.columnDefs.push({ field: 'lastLog', displayName: 'Dernière connexion' });
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
            $rootScope.filters.UsersListController = vm.filters;
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
        $scope.import = function(element) {
            var file = element.files[0];
            console.log("file",file);
            var uploadUrl = "/multer";
            var fd = new FormData();
            fd.append('file', file);

            $http.post("https://sifel-srv.herokuapp.com/importer/producteurs/",fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            console.log("success!!");
            })
            .error(function(){
            console.log("error!!");
            });
        };
        $scope.export = function() {
            alert("export");
        };
        $scope.edit = function(id, col) {
            if(col)
            {
                if (col.name == "actions")
                {
                    return;
                }
            }
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