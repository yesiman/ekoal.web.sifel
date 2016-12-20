(function ()
{
    'use strict';

    angular
        .module('app.planifs.edit')
        .controller('PlanifsEditController',PlanifsEditController);

    /** @ngInject */
    function PlanifsEditController($scope,$state, api,$stateParams,$mdDialog,$q)
    {
        $scope.current =  {userForm : {}};
        $scope.head = {
            ico:"icon-account-box",
            title:"Mise à jour planification"
        };
        $scope.id = $stateParams.id;
        $scope.planif  = {
            lines: [],
            datePlant: new Date()
        };
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
                    methodArgs = { pid:1,nbp:20,req:$scope.planif.produitSearch };
                    break;
                case 2:
                    methodBase = api.users.getAllByType;
                    methodArgs = { pid:1,nbp:1000, idt:4 };
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
            $scope.planif.lines.push(item);
            console.log(item);
        }
        $scope.showPlanif = function(ev){
    
            var item = {
                dateRec:new Date(),
                qte:0
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
        
        $scope.valid = function(){
            console.log("b",$scope.planif);
            
            var toSave = {
                produit: $scope.planif.produit._id,
                producteur: $scope.planif.producteur._id,
                surface:$scope.planif.surface,
                datePlant:$scope.planif.datePlant,
                lines:$scope.planif.lines
            };

            /*$scope.item.type = parseInt($scope.item.type);
            */
            api.planifs.add.post({ id:-1, planif: toSave } ,
                function (response)
                {
                    //$state.go("app.planifs_list");
                },
                function (response)
                {
                    console.error(response);
                }
            );
        }
        
    }
})();