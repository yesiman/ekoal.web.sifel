(function ()
{
    'use strict';

    angular
        .module('app.stats.prevs')
        .controller('StatsPrevsController',StatsPrevsController);

    /** @ngInject */
    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }
    function StatsPrevsController($scope,$state, api,$stateParams,$mdDialog,$q,$mdSidenav,$rootScope,$filter)
    {
        var vm = this;
        //
        var monday = new Date;
        monday.setHours(0);
        monday.setMinutes(0);
        monday.setSeconds(0);
        var sunday = new Date(monday);
        sunday.setMonth(sunday.getMonth() + 1);
        sunday.setHours(23);
        sunday.setMinutes(59);
        sunday.setSeconds(59);
        sunday.setMilliseconds(59);
        $scope.filters = {
            tags: [],
            searchText: "",
            autocompleteDemoRequireMatch:true,
            selectedItem:null,
            selectedItems:$stateParams.selectedItems,
            dateFrom: new Date(),
            dateTo: sunday
        }
        $scope.toggleSidenav = function(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
        $scope.refresh = function() {
            $rootScope.loadingProgress = true;

            $scope.cLines = {
                labels:[],
                series: [],
                colors: [],
                data:[],
                options:{
                    legend: {display: true},
                    maintainAspectRatio:false,
                    size: {
                        height: 300,
                        width: 400
                    }
                }
            };
            $scope.cDonut = {
                labels:[],
                series: [],
                colors: [],
                data:[],
                options:{
                    legend: {display: true}
                }
            };
            

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
                    var sumP = 0;
                    var oneLabelPass = false;
                    $scope.sortedPlanifs = response.items;
                    for (var i = 0;i < $scope.sortedPlanifs.length;i++)
                    {
                        for (var ip = 0;ip < $scope.filters.selectedItems.length;ip++)
                        {  
                            console.log($scope.filters.selectedItems[ip]._id + "/" + $scope.sortedPlanifs[i]._id.produit);
                            if ($scope.filters.selectedItems[ip]._id === $scope.sortedPlanifs[i]._id.produit)
                            {
                                $scope.sortedPlanifs[i].produitLib = $scope.filters.selectedItems[ip].lib;
                                $scope.sortedPlanifs[i].bgColor = $scope.filters.selectedItems[ip].bgColor;
                                break;
                            }
                        }
                    }
                    for (var i = 0;i < $scope.filters.selectedItems.length;i++)
                    {   
                        sumP = 0;
                        var dataTmp = [];
                        $scope.cLines.series.push($scope.filters.selectedItems[i].lib);
                        $scope.cLines.colors.push($scope.filters.selectedItems[i].bgColor);
                        $scope.cDonut.series.push($scope.filters.selectedItems[i].lib);
                        $scope.cDonut.labels.push($scope.filters.selectedItems[i].lib);
                        $scope.cDonut.colors.push($scope.filters.selectedItems[i].bgColor);
                        for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                        {
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
                                        sumP+= o.count;
                                        dataTmp.push(o.count);
                                        found = true;
                                    }
                                }
                            }
                            if (!found) { dataTmp.push(0); }
                            if (!oneLabelPass) {$scope.cLines.labels.push(d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear());}
                        }
                        $scope.cLines.data.push(dataTmp);
                        $scope.cDonut.data.push(sumP);
                        oneLabelPass = true;
                    }
                   //"console.log(vm.data);
                    //console.log(prodDatasTmp2);
                     $rootScope.loadingProgress = false;
                     //console.log("nvdata",$scope.nvdata[0].values[4]);
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

        $scope.$on("$destroy", function(){
            d3.selectAll('.nvtooltip').remove();
        });

        $scope.refresh();
        
    }
})();