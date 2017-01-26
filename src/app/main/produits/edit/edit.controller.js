(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController)
        .directive('objectifLine', objectifLine);

    /** @ngInject */
    function ProduitsEditController($scope,$state, api,$stateParams,prodResolv,standardizer,rulesResolv,monthsResolv,$mdDialog,$document)
    {
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
        
        vm.rules = rulesResolv.items;
        $scope.item = prodResolv;
        if ($scope.item.custom)
        {
            vm.mois = $scope.item.custom.objectif;
        }
        else {
            vm.mois = monthsResolv;
        }
        vm.cpOptions = {
            format: 'hex',
            swatchOnly:true 
        }


        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour produit"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
            if ($scope.item.custom)
            {
                $scope.item.custom.objectif = vm.mois;
            }
            api.products.add.post({ id:$scope.id, product: $scope.item } ,
                // Success
                function (response)
                {
                    $state.go("app.produits_list");
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
        $scope.addRule = function(ev,r) {
            $mdDialog.show({
                controller         : 'RulesEditController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/produits/edit/dialogs/rule/rule-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Rule : (r?r:{produit:$scope.id,weeks:[],_id:-1}),
                    Rules: vm.rules,
                    event: ev
                }
            });


            //$state.go("app.produits_edit.rules_edit", {id:-1,idProduit:$scope.item._id, prod:$scope.item });
        }
        
    }

    /** @ngInject */
    function objectifLine()
    {
        return {
            restrict   : 'E',
            transclude : true,
            templateUrl: 'app/main/produits/edit/templates/objectifLine.html',
            link: function(scope) {
                scope.it = scope.m;
                if (!scope.it.rendements)
                {scope.it.rendements = {};}
                scope.expandStateIco = "icon-plus";
                scope.expanded = false;
                scope.expandClick = function()
                {
                    if (scope.expanded)
                    {
                        scope.expandStateIco = "icon-plus";
                        scope.expanded = false;
                    }
                    else {
                        scope.expandStateIco = "icon-minus";
                        scope.expanded = true;
                    }
                }
                scope.recalc = function(t,o)
                {
                    if (t === "m")
                    {
                        angular.forEach(scope.it.weeks, function(value) {
                            scope.it.rendements[value] = scope.it.rendement / scope.it.weeks.length;
                        });
                    }
                    else {
                        scope.it.rendement = 0;
                        angular.forEach(scope.it.weeks, function(value) {
                            scope.it.rendement += scope.it.rendements[value];
                        });
                        console.log(scope.it.rendement);
                    }
                    
                    console.log("t",t);
                    console.log("o",o);
                    console.log(scope.it);
                }
            }
        };
    }
})();