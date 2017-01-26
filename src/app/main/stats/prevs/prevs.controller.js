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
        vm.groupMode = "w";
        vm.objectifs = [];
        //
        $scope.head = {
            ico:"icon-account-box",
            title:"Statistiques"
        };
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
            selectedItems:[],
            dateFrom: new Date(),
            dateTo: sunday,
            showObjectifs:true
        }
        vm.getObjectif = function(lab, pId)
        {
            //console.log(lab  + "/" + vm.groupMode);
            var itemsProcessed = 0;
            switch(vm.groupMode)
            {
                case "d":
                    var a = lab.split('-');
                    var w = new Date(a[2],a[1]-1,a[0]).getWeek();
                    for (var ei = 0;ei < vm.objectifs.length;ei++)
                    {
                        var element = vm.objectifs[ei];
                        if(element.produit === pId)
                        {
                            for (var eo = 0;eo < element.objectif.length;eo++)
                            {
                                var element2 = element.objectif[eo];
                                var sid = w;
                                if (element2.rendements)
                                {
                                    if (element2.rendements[sid])
                                    {
                                        return element2.rendements[sid];
                                    }
                                }
                            }
                        }
                    } 
                    break;
                case "m":
                    console.log(vm.objectifs);
                    for (var ei = 0;ei < vm.objectifs.length;ei++)
                    {
                        var element = vm.objectifs[ei];
                        if(element.produit === pId)
                        {
                            for (var eo = 0;eo < element.objectif.length;eo++)
                            {
                                var element2 = element.objectif[eo];
                                var sid = lab.substring(0,lab.indexOf("/"));
                                if (element2.id == sid)
                                {
                                    if (element2.rendement)
                                    {
                                        return element2.rendement;
                                    }
                                }
                                
                            }
                        }
                    }
                    break;
                case "w":
                    for (var ei = 0;ei < vm.objectifs.length;ei++)
                    {
                        var element = vm.objectifs[ei];
                        if(element.produit === pId)
                        {
                            for (var eo = 0;eo < element.objectif.length;eo++)
                            {
                                var element2 = element.objectif[eo];
                                var sid = lab.substring(0,lab.indexOf("/"));
                                sid = sid.replace("S","");
                                if (element2.rendements)
                                {
                                    if (element2.rendements[sid])
                                    {
                                        return element2.rendements[sid];
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            return 0;
        }
        $scope.toggleSidenav = function(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
        $scope.export = function(chartId) {
            
            var exp = [];
            var o;
            switch (chartId)
            {
                case 1:
                    o = {};
                    o["label"] = "Periode";
                    for (var i = 0;i < $scope.filters.selectedItems.length;i++)
                    {
                        o[$scope.filters.selectedItems[i].lib] = $scope.filters.selectedItems[i].lib;
                    }
                    exp.push(o);
                    for (var ilab = 0;ilab < $scope.cLines.labels.length;ilab++)
                    {
                        o = {};
                        o["label"] = $scope.cLines.labels[ilab];
                        for (var i = 0;i < $scope.filters.selectedItems.length;i++)
                        {
                            o[$scope.filters.selectedItems[i].lib] = $scope.cLines.data[i][ilab];
                        }
                        exp.push(o);
                        //exp.push({ label:$scope.cLines.labels[ilab], "tomates":$scope.cLines.data[0][ilab] });
                    }
                    break;
            }
           // alasql("CREATE TABLE cities (city string, population number)");
            //alasql("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
            
            return exp;
            //console.log(exp);
            //alasql('SELECT label,tomates INTO XLSX("john.xlsx",{headers:false}) FROM ?',exp);
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
                },
                datasetOverride:[]
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
            var args = { prodsIds:prodsIds,dateFrom:$scope.filters.dateFrom,dateTo:$scope.filters.dateTo, dateFormat:vm.groupMode }
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
                            if ($scope.filters.selectedItems[ip]._id === $scope.sortedPlanifs[i]._id.produit)
                            {
                                $scope.sortedPlanifs[i].produitLib = $scope.filters.selectedItems[ip].lib;
                                $scope.sortedPlanifs[i].bgColor = $scope.filters.selectedItems[ip].bgColor;
                                break;
                            }
                        }
                    }
                    switch(vm.groupMode)
                        {
                            case "d":
                                
                                break;
                            case "m":
                                for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                                {
                                    var found = false;
                                    for (var reliLab = 0;reliLab < $scope.cLines.labels.length;reliLab++ )
                                    {
                                        if ($scope.cLines.labels[reliLab] === ((d.getMonth() + 1) + "/" + d.getFullYear()))
                                        {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found)
                                    {
                                        $scope.cLines.labels.push(((d.getMonth() + 1) + "/" + d.getFullYear()));
                                    }
                                }
                                break;
                            case "w":
                                for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                                {
                                    var found = false;
                                    for (var reliLab = 0;reliLab < $scope.cLines.labels.length;reliLab++ )
                                    {
                                        if ($scope.cLines.labels[reliLab] === ("S" + d.getWeek() + "/" + d.getFullYear()))
                                        {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found)
                                    {
                                        $scope.cLines.labels.push("S" + d.getWeek() + "/" + d.getFullYear());
                                    }
                                }
                                break;
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
                        switch(vm.groupMode)
                        {
                            case "d":
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
                                break;
                            case "m":
                                
                                for (var i3 = 0;i3<$scope.cLines.labels.length;i3++)
                                {
                                    found = false;
                                    for (var i2 = 0;i2<response.items.length;i2++)
                                    {
                                        var o = response.items[i2];
                                        if (o._id.produit == $scope.filters.selectedItems[i]._id)
                                        {
                                            if ((o._id.month + "/" + o._id.year) === $scope.cLines.labels[i3]) 
                                            {
                                                sumP+= o.count;
                                                dataTmp.push(o.count);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) { dataTmp.push(0); }
                                }
                                
                                break;  
                            case "w":

                                for (var i3 = 0;i3<$scope.cLines.labels.length;i3++)
                                {
                                    found = false;
                                    for (var i2 = 0;i2<response.items.length;i2++)
                                    {
                                        var o = response.items[i2];
                                        if (o._id.produit == $scope.filters.selectedItems[i]._id)
                                        {
                                            if (("S" + o._id.week + "/" + o._id.year) === $scope.cLines.labels[i3]) 
                                            {
                                                sumP+= o.count;
                                                dataTmp.push(o.count);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) { dataTmp.push(0); }
                                }

                                /*for (var w = new Date($scope.filters.dateFrom).getWeek();w <= new Date($scope.filters.dateTo).getWeek();w++)
                                {
                                    var found = false;
                                    for (var i2 = 0;i2<response.items.length;i2++)
                                    {
                                        var o = response.items[i2];
                                        if (o._id.produit == $scope.filters.selectedItems[i]._id)
                                        {
                                            if (o._id.week == w)
                                            {
                                                sumP+= o.count;
                                                dataTmp.push(o.count);
                                                found = true;
                                            }
                                        }
                                    }
                                    if (!found) { dataTmp.push(0); }
                                    if (!oneLabelPass) {$scope.cLines.labels.push(w);}
                                }*/
                                break;
                        }
                        $scope.cLines.data.push(dataTmp);
                        $scope.cLines.datasetOverride.push({type: 'bar'})
                        $scope.cDonut.data.push(sumP);
                        oneLabelPass = true;


                        //Objectif
                        /*var objs = [];
                        */
                    }

                    if ($scope.filters.showObjectifs)
                    {
                        for (var i = 0;i < $scope.filters.selectedItems.length;i++)
                        {   
                            var objs = [];
                            $scope.cLines.colors.push($scope.filters.selectedItems[i].bgColor);
                            for (var i2 = 0;i2 < $scope.cLines.labels.length;i2++)
                            {
                                objs.push(vm.getObjectif($scope.cLines.labels[i2],$scope.filters.selectedItems[i]._id));
                            }
                            $scope.cLines.datasetOverride.push({label:"Obj. " + $scope.filters.selectedItems[i].lib,type: 'line',borderWidth: 1})
                            $scope.cLines.data.push(objs);

                        }
                    }
                    
                    //$scope.cLines.datasetOverride.push({label: "Objectif",type: 'line'})
                    
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
                    for (var eo = 0;eo < response.items.length;eo++)
                    {
                        var found = false;
                        //console.log("vm.objectifs",response.objectifs[eo]);
                        for (var eo2 = 0;eo2 < vm.objectifs.length;eo2++)
                        {
                            if (response.items[eo].customs.produit === vm.objectifs[eo]._id)
                            {
                                found = true;
                            }
                        }
                        if (!found)
                        {
                            vm.objectifs.push(response.items[eo].customs);
                        }
                    }
                    //vm.objectifs = response.objectifs;
                    
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

Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };
Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};