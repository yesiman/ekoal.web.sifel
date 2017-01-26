(function ()
{
    'use strict';

    angular
        .module('app.produits.edit')
        .controller('RulesEditController',RulesEditController);

    /** @ngInject */
    function RulesEditController($mdDialog, Rule, Rules, api)
    {
        var vm = this;
        vm.rule = Rule;
        vm.nbWeekChange = function() {
            vm.rule.weeks = [];
            var percent = 100 / vm.rule.nbWeek;
            for(var i = 1;i <= vm.rule.nbWeek;i++)
            {
                vm.rule.weeks.push({week:i,percent:percent});
            }
        }
        vm.save = function() {
            api.rules.add.post({ id:vm.rule._id, rule: vm.rule } ,
                // Success
                function (response)
                {
                    if (vm.rule._id === -1)
                    {
                        Rules.push(vm.rule);
                    }
                    vm.close();
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
            
        }
        vm.close = function() {
           $mdDialog.hide(); 
        }
    }
})();