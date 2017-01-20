(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('ProduitsEditController',ProduitsEditController)
        .directive('objectifLine', objectifLine);

    /** @ngInject */
    function ProduitsEditController($scope,$state, api,$stateParams,prodResolv,standardizer,rulesResolv,monthsResolv)
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
        vm.mois = monthsResolv;
        vm.rules = rulesResolv.items;
        vm.cpOptions = {
            format: 'hex',
            swatchOnly:true
        }

        console.log(vm.mois);

        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour produit"
        };
        $scope.id = $stateParams.id;
        $scope.valid = function(){
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
        $scope.addRule = function() {
            $state.go("app.rules_edit", {id:-1,idProduit:$scope.item._id, prod:$scope.item });
        }
        $scope.item = prodResolv;
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