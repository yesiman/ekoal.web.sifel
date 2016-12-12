(function ()
{
    'use strict';

    angular
        .module('app.users.list')
        .controller('UsersListController',UsersListController);

    /** @ngInject */
    function UsersListController($scope,$state, api,$rootScope,$mdDialog)
    {
        var vm = this;
        
        
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : 'rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            initComplete: function ()
            {
                //alert("comp");
                /*var api = this.api(),
                    searchBox = angular.element('body').find('#e-commerce-products-search');

                // Bind an external input as a table wide search box
                if ( searchBox.length > 0 )
                {
                    searchBox.on('keyup', function (event)
                    {
                        api.search(event.target.value).draw();
                    });
                }*/
            },
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 10,
            scrollY     : 'auto',
            responsive  : true
        };
        // Data
        $scope.getUserType = function(it)
        {
            console.log(it);
            switch(it)
            {
                case "1":
                    return "Administrateur";
                case "2":
                    return "Administrateur OP";
                case "3":
                    return "Technicien";
                case "4":
                    return "Producteur";
            }
            
        }

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            totalItems: 0,
            sort: null
        };
        var actionsHtml = '';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.edit(row.entity._id)"><md-icon md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.remove(row.entity._id,$event)"><md-icon md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += ''
        $scope.gridOptions = {
            useExternalPagination: true,
            useExternalSorting: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableSorting: false,
            saveSelection: false,
            rowHeight: 35,
            height:"100%",
            enableGridMenu: false,
            showGridFooter: false,
            columnDefs: [
                { field: '_id', displayName: 'mongo ID' },
                { field: 'name', displayName: 'Nom' },
                { field: 'surn', displayName: 'Prénom' },
                { field: 'type', displayName: 'Type' },
                { name: 'actions', cellEditableContition: false, cellTemplate: actionsHtml, width: "150" }]
        };
        $scope.loadPageAction = function(id)
        {
            $rootScope.loadingProgress = true;
            paginationOptions.pageNumber = id;
            $scope.loadPage();
        }
        // Methods
        $scope.loadPage = function() {
            api.users.getAll.get({ pid:paginationOptions.pageNumber,nbp:paginationOptions.pageSize },
                // Success
                function (response)
                {
                    $scope.maxSize = 5;
                    $scope.totalItems = response.count;
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.items;
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