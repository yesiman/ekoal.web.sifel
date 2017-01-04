(function ()
{
    'use strict';

    angular
        .module('app.planifs.edit')
        .controller('PlanifsEditController',PlanifsEditController)
        .directive('datatableWrapper', datatableWrapperDirective)
        .directive('datatableAddButton', datatableAddButtonDirective);

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
            }
            $scope.item.lines.push(item);
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
        $scope.valid = function(){
            var toSave = {
                produit: $scope.item.produit._id,
                producteur: $scope.item.producteur._id,
                parcelle: ($scope.item.parcelle?$scope.item.parcelle._id:null),
                surface:$scope.item.surface,
                datePlant:$scope.item.datePlant,
                lines:$scope.item.lines
            };

            /*$scope.item.type = parseInt($scope.item.type);
            */
            api.planifs.add.post({ id:-1, planif: toSave } ,
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
        $scope.removePlanifLine = function(ev,il) {
            // Appending dialog to document.body to cover sidenav in docs app
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
                angular.forEach($scope.item.lines, function(value, key) {
                    if (value._id) {
                        if (value._id === il._id)
                        {
                            $scope.item.lines.splice(increm);
                        }
                    }
                    else {
                        if (value.id === il.id)
                        {
                            $scope.item.lines.splice(increm);
                        }
                    }
                    increm++;
                });

                for (var i = 0;i < $scope.item.lines.length;i++)
                {

                    var o = $scope.item.lines[i];

                    console.log(o[key]);
                    
                }
            }, function() {
                
            });
        };
    }

    function datatableWrapperDirective($timeout, $compile) {
        return {
            restrict: 'E',
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            link: link
        };

        function link(scope, element) {
            // Using $timeout service as a "hack" to trigger the callback function once everything is rendered
            $timeout(function () {
                // Compiling so that angular knows the button has a directive
                $compile(element.find('.datatable-add-button'))(scope);
            }, 0, false);
        }
    }

    /** @ngInject */
    function datatableAddButtonDirective()
    {
        return {
            restrict   : 'C',
            template: '<h1>test</h1>'
        };
    }
})();