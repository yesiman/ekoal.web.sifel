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
    function StatsPrevsController($scope,$state, api,$stateParams,$mdDialog,$q,$rootScope,$filter,standardizer)
    {
        var vm = this;
        vm.groupMode = "w";
        vm.objectifs = [];
        //
        $scope.head = {
            ico:"icon-account-box",
            title:"Statistiques",
            btadd:false,
            btimport:false,
            btexport:false
        };
        //
        var monday = new Date;
        monday.setHours(0);
        monday.setMinutes(0);
        monday.setSeconds(0);
        var sunday = new Date(monday);
        sunday.setMonth(sunday.getMonth() + 6);
        sunday.setHours(23);
        sunday.setMinutes(59);
        sunday.setSeconds(59);
        sunday.setMilliseconds(59);
        var filters = $rootScope.filters.StatsPrevsController;
        if (filters)
        {
            filters.dateFrom = new Date(filters.dateFrom);
            filters.dateTo = new Date(filters.dateTo);
            $scope.filters = filters;
            console.log($rootScope.filters.StatsPrevsControllerObjectifs);
            vm.objectifs  = $rootScope.filters.StatsPrevsControllerObjectifs;
        }
        else {
            $scope.filters = {
                tags: [],
                searchText: "",
                autocompleteDemoRequireMatch:true,
                selectedItem:null,
                selectedItems:[],
                dateFrom: new Date(),
                dateTo: sunday,
                showObjectifs:true,
                groupMode:"w",
                unitMode:1
            }
        }
        //On a passe prod en arg
        if ($stateParams.selectedItems.length > 0)
        {
            var found = false;
            for (var i = 0;i< $scope.filters.selectedItems.length;i++)
            {
                if ($scope.filters.selectedItems[i]._id == $stateParams.selectedItems[0]._id)
                {
                    found = true;
                    break;
                }
            }
            if (!found) { $scope.filters.selectedItems.push($stateParams.selectedItems[0]); }
        }
        //
        $scope.removeProduit = function(it) {
            for (var i = 0;i< $scope.filters.selectedItems.length;i++)
            {
                if ($scope.filters.selectedItems[i]._id == it)
                {
                    $scope.filters.selectedItems.splice(i,1);
                    break;
                }
            }
            $scope.refresh();
        }
        //
        $scope.filters.produitChange = function(it) {
            if (!it) { return; }
            var found = false;
            for (var i = 0;i< $scope.filters.selectedItems.length;i++)
            {
                if ($scope.filters.selectedItems[i]._id == it._id)
                {
                    found = true;
                    break;
                }
            }
            if (!found) { $scope.filters.selectedItems.push(it);$scope.refresh(); }
            $scope.filters.searchText = "";
        }
        //
        $scope.export = function(chartId) { 
            switch (chartId)
            {
                case 1:
                    
                    break;
            }
            return exp;
        }
        
        $scope.getProdsIds = function()
        {
            var prodsIds = [];
            for (var i = 0;i < $scope.filters.selectedItems.length;i++)
            {
                prodsIds.push($scope.filters.selectedItems[i]._id);
            }
            return prodsIds;
        }
        $scope.getSeries = function(series,colors) {
            var ret = series;
            for (var i = 0;i < $scope.filters.selectedItems.length;i++)
            {   
                var found = false;
                for (var reliSeries = 0;reliSeries<series.length;reliSeries++)
                {
                    if (series[reliSeries] == $scope.filters.selectedItems[i].lib)
                    {
                        found = true;
                    }
                }
                if (!found)
                {
                    ret.push($scope.filters.selectedItems[i].lib);
                }
            }
            
            return ret;
        }
        $scope.getColors = function(series,colors) {
            var ret = [];
            for (var i = 0;i < $scope.filters.selectedItems.length;i++)
            {   
               ret.push($scope.filters.selectedItems[i].bgColor);
            }
            return ret;
        }
        $scope.getObjectif = function(lab, pId)
        {
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
                            for (var eo = 0;eo < element.lines.length;eo++)
                            {
                                var element2 = element.lines[eo];
                                var sid = w;
                                if (element2.rendements)
                                {
                                    if (element2.rendements[sid])
                                    {
                                        return element2.rendements[sid].val;
                                    }
                                }
                            }
                        }
                    } 
                    break;
                case "m":
                    for (var ei = 0;ei < vm.objectifs.length;ei++)
                    {
                        var element = vm.objectifs[ei];
                        if(element.produit === pId)
                        {
                            for (var eo = 0;eo < element.lines.length;eo++)
                            {
                                var element2 = element.lines[eo];
                                var sid = lab.substring(0,lab.indexOf("/"));
                                if (element2.id == sid)
                                {
                                    if (element2.rendement)
                                    {
                                        return standardizer.getPoidsInAskVal(element2.rendement,$scope.filters.unitMode);
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
                            for (var eo = 0;eo < element.lines.length;eo++)
                            {
                                var element2 = element.lines[eo];
                                var sid = lab.substring(0,lab.indexOf("/"));
                                sid = sid.replace("S","");
                                if (element2.rendements)
                                {
                                    if (element2.rendements[sid])
                                    {
                                        return standardizer.getPoidsInAskVal(element2.rendements[sid],$scope.filters.unitMode);
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            return 0;
        }
        $scope.getLabels = function(labels) {
            var ret = labels;
            switch($scope.filters.groupMode)
            {
                case "d":
                    break;
                case "m":
                    for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                    {
                        var found = false;
                        for (var reliLab = 0;reliLab < ret.length;reliLab++ )
                        {
                            if (ret[reliLab] === ((d.getMonth() + 1) + "/" + d.getFullYear()))
                            {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                        {
                            ret.push(((d.getMonth() + 1) + "/" + d.getFullYear()));
                        }
                    }
                    break;
                case "w":
                    
                    for (var d = new Date($scope.filters.dateFrom);d <= $scope.filters.dateTo;d.setDate(d.getDate() + 1))
                    {
                        var found = false;
                        for (var reliLab = 0;reliLab < ret.length;reliLab++ )
                        {
                            if (ret[reliLab] === ("S" + d.getWeek() + "/" + d.getFullYear()))
                            {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                        {
                                ret.push("S" + d.getWeek() + "/" + d.getFullYear());
                        }
                    }
                    break;
            }
            return ret;
        }
        
        $scope.refresh = function(clearSeries) {
            $rootScope.loadingProgress = true;
            $scope.clearSeries = true;
            $rootScope.filters.StatsPrevsController = $scope.filters;
            $rootScope.filters.StatsPrevsControllerObjectifs = vm.objectifs;
            //console.log("$scope.filters",filters);
            $scope.refreshPrevsByProdukt();
            $scope.refreshPrevsByProdukteur();
            $scope.refreshPrevsByLines();
            $rootScope.loadingProgress = false;
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
                        if (response.items[eo].objectif)
                        {
                            for (var eo2 = 0;eo2 < vm.objectifs.length;eo2++)
                            {
                                if (vm.objectifs[eo2])
                                {
                                    if (response.items[eo].objectif.produit === vm.objectifs[eo2].produit)
                                    {
                                        found = true;
                                    }
                                }
                                
                            }
                            if ((!found) && response.items[eo])
                            {
                                vm.objectifs.push(response.items[eo].objectif);
                            }
                        }
                    }
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

        //$scope.$on("$destroy", function(){
        //    d3.selectAll('.nvtooltip').remove();
        //});
        //$scope.refresh();

        
        
    }
})();

Date.prototype.getWeek = function() { 

  // Create a copy of this date object  
  var target  = new Date(this.valueOf());  

  // ISO week date weeks start on monday, so correct the day number  
  var dayNr   = (this.getDay() + 6) % 7;  

  // Set the target to the thursday of this week so the  
  // target date is in the right year  
  target.setDate(target.getDate() - dayNr + 3);  

  // ISO 8601 states that week 1 is the week with january 4th in it  
  var jan4    = new Date(target.getFullYear(), 0, 4);  

  // Number of days between target date and january 4th  
  var dayDiff = (target - jan4) / 86400000;    

  if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    return Math.ceil(dayDiff / 7);    
  }
  else {  // jan 4th is on the next week (so next week is week 1)
    return Math.ceil(dayDiff / 7); 
  }
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