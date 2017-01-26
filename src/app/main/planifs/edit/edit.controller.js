(function ()
{
    'use strict';

    angular
        .module('app.planifs.edit')
        .controller('PlanifsEditController',PlanifsEditController);

    /** @ngInject */
    function PlanifsEditController($scope,$state, api,$stateParams,$mdDialog,$q,planifResolv,$rootScope,standardizer)
    {
        $scope.current =  {userForm : {}};
        var vm = this;
        vm.dtInstance = {};
        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType  : 'simple',
            lengthMenu  : [10, 20, 30, 50, 100],
            pageLength  : 20,
            scrollY     : 'auto',
            responsive  : true,
            language: standardizer.getDatatableLanguages()
        };
        vm.rules = [];
        vm.selectedRule = {};
        //
        vm.ruleChanged = function() {
            var startDate = $scope.item.datePlant;
            startDate.setDate(startDate.getDate() + vm.selectedRule.delai);
            var wStart = startDate.getWeek();
            var surfacePercent = ((100/1)*$scope.item.surface) / 100;
            //PASSAGE TOUTES LIGNES EN A SUPPRIMER
            for (var i = 0;i < vm.selectedRule.nbWeek;i++)
            { 
                var valueQte = (vm.selectedRule.weeks[i].percent/100) * $scope.item.produit.customs.rendement; //PRODUCT DEFAULT RENDEMENT
                var oIt = { 
                    semaine:wStart + i,
                    qte:valueQte*surfacePercent
                }
                $scope.validLine(oIt);
            }
            
            /*angular.forEach($scope.item.lines, function(value) {
                if (value._id) {
                    $scope.item.linesToRem.push(value._id);
                }
            });
            $scope.item.lines = [];
            var surfacePercent = ((100/1000)*$scope.item.surface) / 100;
            angular.forEach(vm.selectedRule.lines, function(value) {
                var myDate = new Date($scope.item.datePlant);
                myDate.setDate(myDate.getDate() + value.nbJours);
                var oIt = { 
                    dateRec:myDate,
                    qte:value.qte*surfacePercent
                }
                $scope.validLine(oIt);
            });*/
        }

        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour planification"
        };
        $scope.id = $stateParams.id;

        $scope.item  = planifResolv;
        if ($rootScope.user.type == 4)
        {
            $scope.item.producteur = $rootScope.user;
        }
        
        if (!$scope.item.lines)
        {
            $scope.item.lines = [];
            $scope.item.linesToRem = [];
            $scope.item.datePlant = new Date();
        }
        else {
            $scope.item.datePlant = new Date($scope.item.datePlant);
        }
        var mdDialogCtrl = function ($scope, item,onCancel,onValid) { 
            $scope.item = item;
            $scope.onCancel = onCancel;
            $scope.onValid = onValid;   
        }
        $scope.searchText = "";



        $scope.querySearch = function(query, type) {
            var deferred = $q.defer();
            //$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            var methodBase;
            var methodArgs;
            switch (type)
            {
                case 1:
                    methodBase = api.products.getAllByLib;
                    methodArgs = { pid:1,nbp:20,req:$scope.item.produitSearch };
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4 };
                    break;
                case 3:
                    methodBase = api.users.getParcelles;
                    methodArgs = { id:$scope.item.producteur._id };
                    break;
            }
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


        $scope.closeMe = function()
        {
            $mdDialog.hide();
        }
        $scope.validLine = function(item){
            if (!item._id)
            {
                item.id = "tmp" + ($scope.item.lines.length + 1);
                $scope.item.lines.push(item);
            }else {
                var increm = 0;
                angular.forEach($scope.item.lines, function(value) {
                    if (value._id == item._id) {
                        $scope.item.lines[increm] = item;
                    }
                    increm++;
                });
            }
            
            $mdDialog.hide();
        }
        $scope.showPlanif = function(ev,il){
    
            var item;
            if (il)
            {
                item = il;
                il.dateRec = new Date(il.dateRec);
            } 
            else 
            {
                item = {dateRec:new Date(),
                qte:0};
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
        $scope.productChange = function() {
            if ($scope.item.produit)
            {
                //LOAD PRODUCTS RULES
                api.rules.getAllByProduit.get({ id:$scope.item.produit._id},
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
            }   
        }
        $scope.valid = function(){
            var toSave = {
                produit: $scope.item.produit._id,
                producteur: $scope.item.producteur._id,
                parcelle: ($scope.item.parcelle?$scope.item.parcelle._id:null),
                surface:$scope.item.surface,
                datePlant:$scope.item.datePlant,
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
                console.log($scope.item.linesToRem);
            }, function() {
                
            });
        };
    }
})();