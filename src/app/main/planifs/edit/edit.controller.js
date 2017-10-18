(function ()
{
    'use strict';

    angular
        .module('app.planifs.edit')
        .controller('PlanifsEditController',PlanifsEditController);

    /** @ngInject */
    function PlanifsEditController($scope,$state, api,$stateParams,$mdDialog,$q,planifResolv,$rootScope,standardizer,$mdSidenav)
    {
        $scope.current =  {userForm : {}};
        var vm = this;
        
        vm.rules = [];
        vm.selectedRule = {};
        
        var semaineHtml = '<div class="ui-grid-cell-contents">';
        semaineHtml += "S{{row.entity.semaine}} / {{row.entity.anne}}";
        semaineHtml += '</div>'
        var qteHtml = '<div class="ui-grid-cell-contents">';
        qteHtml += "{{row.entity.qte.val}} {{(row.entity.qte.unit == 1?'kilos':'tonnes')}}";
        qteHtml += '</div>'
        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showPlanif($event,row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.removePlanifLine($event,row.entity)"><md-tooltip>Supprimer</md-tooltip><md-icon class="rem" md-font-icon="icon-table-row-remove"></md-icon></md-button>';
        actionsHtml += '</div>';
        vm.gridRecoltsOptions = standardizer.getGridOptionsStd();
        vm.gridRecoltsOptions.useExternalPagination = false;
        vm.gridRecoltsOptions.useExternalSorting = false;
        vm.gridRecoltsOptions.columnDefs = [
            { field: 'semaine', sort:{priority:0}, displayName: 'Semaine récolte', cellTemplate:semaineHtml },
            { field: 'qte.val', displayName: 'Quantité', cellTemplate:qteHtml },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];   
        vm.gridRecoltsOptions.onRegisterApi =  function(gridApi) {
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
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }

        var actionsHtml = '<div class="ui-grid-cell-contents text-center">';
        actionsHtml += '<md-button class="md-icon-button" aria-label="Settings" ng-click="grid.appScope.showMessage(row.entity)"><md-tooltip>Editer</md-tooltip><md-icon class="edit" md-font-icon="icon-table-edit"></md-icon></md-button>';
        actionsHtml += '</div>';

        var statusHtml = '<div class="ui-grid-cell-contents">';
        statusHtml += '<span class="status {{grid.appScope.getStatusBg(row.entity)}}">{{grid.appScope.getStatusLib(row.entity)}}</span>';
        statusHtml += '</div>';

        var anoHtml = '<div class="ui-grid-cell-contents text-center">';
        anoHtml += '<md-tooltip>{{grid.appScope.getAnoIcoTooltip(row.entity)}}</md-tooltip><md-icon class="{{grid.appScope.getAnoIcoColor(row.entity)}}" md-font-icon="icon-message"></md-icon>';
        anoHtml += '</div>';

        var anoHtml = '<div class="ui-grid-cell-contents text-center">';
        anoHtml += '<md-tooltip>{{grid.appScope.getMsgStaIcoTooltip(row.entity)}}</md-tooltip><md-icon class="{{grid.appScope.getMsgStaIcoColor(row.entity)}}" md-font-icon="{{grid.appScope.getMsgStaIco(row.entity)}}"></md-icon>';
        anoHtml += '</div>';
        
        vm.gridAlertsOptions = standardizer.getGridOptionsStd();
        vm.gridAlertsOptions.useExternalPagination = false;
        vm.gridAlertsOptions.useExternalSorting = false;
        vm.gridAlertsOptions.columnDefs = [
            { field: 'dateAlert', sort:{priority:0}, displayName: "Date d'envoi" },
            { field: 'Status', displayName: 'Status', cellTemplate:statusHtml },
            { field: 'Ano', displayName: '', cellTemplate:anoHtml },
            { name: 'Actions', cellTemplate: actionsHtml, width: "150" }];   
        vm.gridAlertsOptions.onRegisterApi =  function(gridApi) {
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
                //vm.parcellePsize = pageSize;
                //$scope.getParcelles(newPage,pageSize);
            });
        }

        //
        vm.ruleChanged = function() {
            for (var i = 0;i< vm.rules.length;i++)
            {
                if (vm.rules[i]._id == $scope.item.rule)
                {
                    vm.selectedRule = vm.rules[i];
                    if (vm.selectedRule.rendement){
                        //console.log(vm.selectedRule.rendement);
                        $scope.rendementUpdatable = vm.selectedRule.rendement;
                    }
                    $scope.item.lines = [];
                    var startDate = new Date($scope.item.datePlant);
                    startDate.setDate(startDate.getDate() + vm.selectedRule.delai);
                    var wStart = startDate.getWeek();
                    var surfacePercent = ((100/1)*$scope.item.surface) / 100;
                    
                    //PASSAGE TOUTES LIGNES EN A SUPPRIMER
                    for (var i = 0;i < vm.selectedRule.nbWeek;i++)
                    { 
                        var valueQte = (vm.selectedRule.weeks[i].percent/100) * $scope.rendementUpdatable.val; //PRODUCT DEFAULT RENDEMENT
                        var oIt = { 
                            semaine:startDate.getWeek(),
                            mois:startDate.getMonth() + 1,
                            anne:startDate.getFullYear(),
                            startAt:new Date(startDate),
                            percent:vm.selectedRule.weeks[i].percent,
                            qte:{
                                val: parseFloat((valueQte*surfacePercent).toFixed(2)),
                                unit:$scope.rendementUpdatable.unit
                            }
                        }
                        $scope.validLine(oIt,true);
                        startDate.setDate(startDate.getDate() + 7);
                    }
                    break;
                }
            }
            
        }
        vm.productChange = function() {
        
//console.log($scope.item.produit);
        if ($scope.item.produit)
        {
                //LOAD PRODUCTS RULES
                api.rules.getAllByProduit.post({ pid:1,nbp:100, id:$scope.item.produit._id,req:""},
                    function (response)
                    {
                        vm.rules = response.items;
                    },
                    // Error
                    function (response)
                    {
                        console.error(response);
                        //return null;
                    }
                );
                $scope.rendementUpdatable = angular.copy($scope.item.produit.rendement);    
            }
        }
        vm.producteurChange = function(it) {
            if ($scope.item.producteur)
            {
                it.textShow = it.codeAhd + "-" + it.name + " " + it.surn;
                var methodArgs = { pid:1,nbp:100,id:$scope.item.producteur._id,req:"" };
                api.users.getParcelles.post(methodArgs,
                    function (response)
                    {
                        vm.parcelles = response.items;
                    },
                    function (response)
                    {
                        console.error(response);
                    }
                );
            }
            else
            {
                $scope.item.parcelle = null;
                $scope.item.surface = "";
            }
        }

        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour planification"
        };
        $scope.id = $stateParams.id;
        $scope.item  = planifResolv;


        $scope.getStatusBg = function(alert)
        {
            if (alert.sent)
            {
                return "md-light-green-200-bg"
            }
            else {
                return "md-orange-200-bg"
            }
            //STATUS EXPIRE
        }

         
        $scope.showMessage = function(alert)
        {
            $scope.curMessage = alert;
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav("right")
            .toggle()
            .then(function () {
                //$log.debug("toggle " + navID + " is done");
            });
        }

        $scope.getStatusLib = function(alert) {

            if (alert.sent)
            {
                return "Envoyé";
            }
            else {
                return "Non envoyé";
            }
            //STATUS EXPIRE
            //return alert.reply;
        }
        $scope.getAnoIcoColor = function(alert)
        {
            if (alert.sent)
            {
                if (alert.reply)
                {
                    return "green-200-fg"
                }
                else {
                    return "orange-200-fg"
                }
            }
            else {
                return "grey-400-fg"
            }
            //STATUS EXPIRE
        }
        $scope.getAnoIcoTooltip = function(alert)
        {
            if (alert.sent)
            {
                if (alert.reply)
                {
                    return "Une réponse à été reçue"
                }
                else {
                    return "En attente d'une réponse"
                }
            }
            else {
                return "Non envoyé"
            }
            //STATUS EXPIRE
        }
        $scope.getMsgStaIcoTooltip = function(alert)
        {
            if (alert.reply)
            {
                if (alert.reply.toUpperCase().startsWith("OUI"))
                {
                    return "Livraison confirmée";
                }
                else {
                    return "Livraison non confirmée";
                }
            }
            else {
                return "";
            }
        }
        $scope.getMsgStaIco = function(alert)
        {
            if (alert.reply)
            {
                if (alert.reply.toUpperCase().startsWith("OUI"))
                {
                    return "icon-check";
                }
                else {
                    return "icon-message-alert";
                }
            }
            else {
                return "";
            }
        }
        $scope.getMsgStaIcoColor = function(alert)
        {
            if (alert.reply)
            {
                if (alert.reply.toUpperCase().startsWith("OUI"))
                {
                    return "icon-check";
                }
                else {
                    return "icon-message-alert";
                }
            }
            else {
                return "";
            }
        }


        vm.productChange();
        if ($rootScope.user.type == 4)
        {
            $scope.item.producteur = $rootScope.user;
        }
        
        if (!$scope.item.lines)
        {
            $scope.item.lines = [];
            $scope.item.alertsParams = {};
            $scope.item.alerts = [];
            $scope.item.linesToRem = [];
            $scope.item.datePlant = new Date();
        }
        else {
            $scope.item.datePlant = new Date($scope.item.datePlant);
        }
        
        $scope.searchText = "";


        vm.gridRecoltsOptions.totalItems = $scope.item.lines.length;
        vm.gridRecoltsOptions.data = $scope.item.lines;

        vm.gridAlertsOptions.totalItems = $scope.item.alerts.length;
        vm.gridAlertsOptions.data = $scope.item.alerts;
        //
        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.products.getAllByLibActif;
                    methodArgs = { pid:1,nbp:20,req:$scope.item.produitSearch,actifs:1 };
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
                    break;
                case 2:
                    methodBase = api.users.getAllByTypeActifs;
                    methodArgs = { pid:1,nbp:1000, idt:4,req:$scope.item.producteurSearch,actifs:1 };
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
                    break;
                case 3:
                    //console.log(vm.parcelles);
                    return(vm.parcelles);
                    
                    //break;
            }
           
            return deferred.promise;
        }
        //vm.parcelles = $scope.querySearch("",3);
        //
        vm.getDateOfISOWeek = function(weekNo, y) {
            var d1 = new Date();
            d1.setFullYear(y);
            var numOfdaysPastSinceLastMonday = eval(d1.getDay()- 1);
            d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
            var weekNoToday = d1.getWeek();
            var weeksInTheFuture = eval( weekNo - weekNoToday );
            d1.setDate(d1.getDate() + eval( 7 * weeksInTheFuture ));
            return new Date(d1);
            //var rangeIsFrom = eval(d1.getMonth()+1) +"/" + d1.getDate() + "/" + y;
            //d1.setDate(d1.getDate() + 6);
            //var rangeIsTo = eval(d1.getMonth()+1) +"/" + d1.getDate() + "/" + y ;
            //return rangeIsFrom + " to "+rangeIsTo;
        }
        //
        $scope.closeMe = function()
        {
            $mdDialog.hide();
        }
        $scope.validLine = function(item,fromrule){
            
            if (!fromrule)
            {
                var firstMonday = "";
                var d = vm.getDateOfISOWeek(item.semaine,item.anne);
                //var w = d.getTime() + 604800000 * (week-1);
                //var n1 = new Date(w);
                //var n2 = new Date(w + 518400000)
                //semaine:startDate.getWeek(),
                item.mois = d.getMonth() + 1;
                item.startAt = d;    
            }
            //
            if ((!item._id) && ((!item.id)))
            {
                item.id = "tmp" + ($scope.item.lines.length + 1);
                $scope.item.lines.push(item);
            }else {
                var increm = 0;
                angular.forEach($scope.item.lines, function(value) {
                    if (item._id)
                    {
                        if (value._id == item._id) {
                            $scope.item.lines[increm] = item;
                        }
                    }
                    else {
                        if (value.id == item.id) {
                            $scope.item.lines[increm] = item;
                        }
                    }
                    increm++;
                });
            }
            
            vm.gridRecoltsOptions.totalItems = $scope.item.lines.length;
            vm.gridRecoltsOptions.data = $scope.item.lines;
            $mdDialog.hide();
        }
        
        var mdDialogCtrl = function ($scope, item,onCancel,onValid) { 
            $scope.dialog = { 
                weeks:[],
                years:[]
            };
            for (var i = 1;i < 53;i++)
            {
                $scope.dialog.weeks.push(i);
            }
            for (var i = 2010;i < 2030;i++)
            {
                $scope.dialog.years.push(i);
            }
            $scope.item = item;
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;   
        }

        $scope.showPlanif = function(ev,il){
    
            var item;
            if (il)
            {
                item = il;
            } 
            else 
            {
               
                if ($scope.item.lines.length > 0)
                {
                    //On se position semaine après dernière saisie
                    console.log($scope.item.lines[$scope.item.lines.length - 1]);
                    var dtt = new Date($scope.item.lines[$scope.item.lines.length - 1].startAt);
                    var dt = new Date(dtt.setTime( dtt.getTime() + 7 * 86400000 ));
                    item = {
                        semaine:dt.getWeek(),
                        anne:dt.getFullYear(),
                        qte:0
                    };
                }
                else {
                    var dt = new Date();
                    item = {
                        semaine:dt.getWeek(),
                        anne:dt.getFullYear(),
                        qte:0
                    };
                }
            }
            //$scope.dialogItems = response.items;
            var locals = {item: item, onCancel: $scope.closeMe, onValid: $scope.validLine };
            $mdDialog.show({
                templateUrl: 'app/main/planifs/edit/dialogs/addEdit.html',
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
        //
        $scope.parcelleChange = function() {
            if ($scope.item.parcelle)
            {
                $scope.item.surface = $scope.item.parcelle.surface;
            }   
        }
        //
        
        $scope.valid = function(){
            //vm.doPlanifDaysLine();
            var startDate = new Date($scope.item.datePlant);
            startDate.setDate(startDate.getDate() + vm.selectedRule.delai)
            var toSave = {
                alertsParams:$scope.item.alertsParams,
                produit: $scope.item.produit._id,
                producteur: $scope.item.producteur._id,
                parcelle: ($scope.item.parcelle?$scope.item.parcelle._id:null),
                rule: ($scope.item.rule?$scope.item.rule:null),
                rendement:$scope.item.produit.rendement,
                surface:$scope.item.surface,
                datePlant:$scope.item.datePlant,
                dateRecStart:startDate,
                lines:$scope.item.lines,
                linesToRem:$scope.item.linesToRem
            };

            /*$scope.item.type = parseInt($scope.item.type);
            */

            api.planifs.add.post({ id:($scope.item._id?$scope.item._id:-1), planif: toSave } ,
                function (response)
                {
                    $state.go("app.planifs_list");
                },
                function (response)
                {
                    console.error(response);
                }
            );
        }
        //SUPPRESSION LIGNE PLANIFICATION
        $scope.removePlanifLine = function(ev,il) {
            var confirm = $mdDialog.confirm()
                .title('Êtes vous sur de vouloir supprimer cette ligne?')
                .textContent('(Cette action sera prise en compte après sauvegarde)')
                .ariaLabel('Supprimer')
                .targetEvent(ev)
                .ok('Valider')
                .cancel('Annuler');
            $mdDialog.show(confirm).then(function() {
                //loop on array and remove
                var increm = 0;
                
                angular.forEach($scope.item.lines, function(value) {
                    if (value._id) {
                        if (value._id === il._id)
                        {
                            $scope.item.linesToRem.push(il._id);
                            $scope.item.lines.splice(increm,1);
                        }
                    }
                    else {
                        if (value.id === il.id)
                        {
                            $scope.item.lines.splice(increm,1);
                        }
                    }
                    increm++;
                });
            }, function() {
                
            });
        };
    }
})();