(function ()
{
    'use strict';

    angular
        .module('app.stats.prevs')
        .controller('StatsPrevsController',StatsPrevsController);

    /** @ngInject */
    function StatsPrevsController($scope,$state, api,$stateParams,$mdDialog,$q,$mdSidenav,$rootScope)
    {
        var vm = this;
        $scope.filters = {
            tags: [],
            searchText: "",
            autocompleteDemoRequireMatch:true,
            selectedItem:null,
            selectedItems:[],
            dateFrom: new Date() ,
            dateTo: new Date()
        }
        $scope.toggleSidenav = function(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
        $scope.refresh = function() {
            $rootScope.loadingProgress = true;
            var prodsIds = [];
            for (var i = 0;i < $scope.filters.selectedItems.length;i++)
            {
                prodsIds.push($scope.filters.selectedItems[i]._id);
            }
            var args = { prodsIds:prodsIds,dateFrom:$scope.filters.dateFrom,dateTo:$scope.filters.dateTo }
            api.stats.prevsByDay.post( args ,
                // Success
                function (response)
                {
                    $scope.colors = [];
                    $scope.series = [];
                    var labels = [];
                    var datas = [];
                    var prdTmp = "";
                    var arrTmp;
                    var oneLabelPass = false;
                    for (var i = 0;i < $scope.filters.selectedItems.length;i++)
                    {   
                        var prodDatasTmp = [];
                        $scope.colors.push($scope.filters.selectedItems[i].bgColor);
                        $scope.series.push($scope.filters.selectedItems[i].lib);
                        for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                        {
                            
                            if (!oneLabelPass)
                            {
                                labels.push(d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear());
                            }
                            var found = false;
                            for (var i2 = 0;i2<response.items.length;i2++)
                            {
                                var o = response.items[i2];
                                if (o._id.produit == $scope.filters.selectedItems[i]._id)
                                {
                                    if (o._id.day == d.getDate() && 
                                    (o._id.month == (d.getMonth() + 1)) && 
                                    (o._id.year == d.getFullYear()))
                                    {
                                        found = true;
                                        prodDatasTmp.push(o.count);
                                    }
                                }
                            }
                            if (!found) {
                                prodDatasTmp.push(0);
                            }
                        }
                        oneLabelPass = true;
                        datas.push(prodDatasTmp);
                    }
                   
                    vm.barChart = {
                        labels: labels,
                        series: $scope.series,
                        data  : datas,
                        colors: $scope.colors
                    };
                     $rootScope.loadingProgress = false;
                },
                // Error
                function (response)
                {
                    $rootScope.loadingProgress = false;
                    console.error(response);
                }
            );
        }

        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase = api.products.getAllByLib;
            var methodArgs = { pid:1,nbp:20,req:$scope.filters.searchText };
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
            return deferred.promise;
        }

        $scope.refresh();

    }
})();