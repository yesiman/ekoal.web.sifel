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
    function StatsPrevsController($scope,$state, api,$stateParams,$mdDialog,$q,$mdSidenav,$rootScope)
    {
      $scope.options = {
            chart: {
                type: 'historicalBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 65,
                    left: 50
                },
                x: function(d){return parseInt(d[0]);},
                y: function(d){return parseInt(d[1]);},
                showValues: true,
                duration: 100,
                xAxis: {
                    axisLabel: 'Date',
                    rotateLabels: 30,
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Quatité',
                    axisLabelDistance: -10
                },
                tooltip: {
                    keyFormatter: function(d) {
                        return d;
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }
            }
        };

        var prodDatasTmp2 = [];

        $scope.data = [
            {
                "key" : "Quantity" ,
                "bar": true,
                "color":"#000000",
                "values" : [ [ 1136005200000 , 1271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            },{
                "key" : "Quantity2" ,
                "bar": true,
                "values" : [ [ 1136005200000 , 271000.0] , [ 1138683600000 , 1271000.0] , [ 1141102800000 , 1271000.0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 3899486.0] , [ 1162270800000 , 3899486.0] , [ 1164862800000 , 3899486.0] , [ 1167541200000 , 3564700.0] , [ 1170219600000 , 3564700.0] , [ 1172638800000 , 3564700.0] , [ 1175313600000 , 2648493.0] , [ 1177905600000 , 2648493.0] , [ 1180584000000 , 2648493.0] , [ 1183176000000 , 2522993.0] , [ 1185854400000 , 2522993.0] , [ 1188532800000 , 2522993.0] , [ 1191124800000 , 2906501.0] , [ 1193803200000 , 2906501.0] , [ 1196398800000 , 2906501.0] , [ 1199077200000 , 2206761.0] , [ 1201755600000 , 2206761.0] , [ 1204261200000 , 2206761.0] , [ 1206936000000 , 2287726.0] , [ 1209528000000 , 2287726.0] , [ 1212206400000 , 2287726.0] , [ 1214798400000 , 2732646.0] , [ 1217476800000 , 2732646.0] , [ 1220155200000 , 2732646.0] , [ 1222747200000 , 2599196.0] , [ 1225425600000 , 2599196.0] , [ 1228021200000 , 2599196.0] , [ 1230699600000 , 1924387.0] , [ 1233378000000 , 1924387.0] , [ 1235797200000 , 1924387.0] , [ 1238472000000 , 1756311.0] , [ 1241064000000 , 1756311.0] , [ 1243742400000 , 1756311.0] , [ 1246334400000 , 1743470.0] , [ 1249012800000 , 1743470.0] , [ 1251691200000 , 1743470.0] , [ 1254283200000 , 1519010.0] , [ 1256961600000 , 1519010.0] , [ 1259557200000 , 1519010.0] , [ 1262235600000 , 1591444.0] , [ 1264914000000 , 1591444.0] , [ 1267333200000 , 1591444.0] , [ 1270008000000 , 1543784.0] , [ 1272600000000 , 1543784.0] , [ 1275278400000 , 1543784.0] , [ 1277870400000 , 1309915.0] , [ 1280548800000 , 1309915.0] , [ 1283227200000 , 1309915.0] , [ 1285819200000 , 1331875.0] , [ 1288497600000 , 1331875.0] , [ 1291093200000 , 1331875.0] , [ 1293771600000 , 1331875.0] , [ 1296450000000 , 1154695.0] , [ 1298869200000 , 1154695.0] , [ 1301544000000 , 1194025.0] , [ 1304136000000 , 1194025.0] , [ 1306814400000 , 1194025.0] , [ 1309406400000 , 1194025.0] , [ 1312084800000 , 1194025.0] , [ 1314763200000 , 1244525.0] , [ 1317355200000 , 475000.0] , [ 1320033600000 , 475000.0] , [ 1322629200000 , 475000.0] , [ 1325307600000 , 690033.0] , [ 1327986000000 , 690033.0] , [ 1330491600000 , 690033.0] , [ 1333166400000 , 514733.0] , [ 1335758400000 , 514733.0]]
            }];


        var vm = this;
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
            $scope.data = [];
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
                
                        prodDatasTmp2 = [];
                        var oTmp = {
                            "color":$scope.filters.selectedItems[i].bgColor,
                            "bar":true,
                            "key":$scope.filters.selectedItems[i].lib
                        };
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
                                        prodDatasTmp2.push([d.getDate() + (d.getMonth() + 1) + d.getFullYear(),o.count])
                                    }
                                }
                            }
                            if (!found) {
                                prodDatasTmp.push(0);
                            }
                        }
                        oneLabelPass = true;
                        datas.push(prodDatasTmp);
                        oTmp.values = prodDatasTmp2;
                        $scope.data.push(oTmp);
                    }
                   
                    vm.barChart = {
                        labels: labels,
                        series: $scope.series,
                        data  : datas,
                        colors: $scope.colors
                    };
                    //console.log(prodDatasTmp2);
                     $rootScope.loadingProgress = false;
                     console.log($scope.data);
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