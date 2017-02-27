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
        vm.sumer = 0;
        vm.badPercent = (parseInt(vm.sumer) != 100);
        vm.rule = angular.copy(Rule);
        vm.nbWeekChange = function() {
            vm.rule.weeks = [];
            vm.sumer = 0;
            var percent = parseFloat((100 / vm.rule.nbWeek).toFixed(2));
            for(var i = 1;i <= vm.rule.nbWeek;i++)
            {
                if (i== vm.rule.nbWeek)
                {
                    percent = parseFloat((100 - parseFloat(vm.sumer.toFixed(2))).toFixed(2));
                }
                vm.sumer += percent;
                vm.rule.weeks.push({week:i,percent:percent});
            }
            vm.recalc();
        }
        vm.recalc = function()
        {
            vm.sumer = 0;
            for(var i = 0;i < vm.rule.weeks.length;i++)
            {
                vm.sumer += parseFloat(vm.rule.weeks[i].percent);
            }
            vm.badPercent = (vm.sumer.toFixed(2) != "100.00");
        }
        vm.save = function() {
            if (vm.saving || vm.badPercent) { return; }
            vm.saving = true;
            api.rules.add.post({ id:vm.rule._id, rule: vm.rule } ,
                // Success
                function (response)
                {
                    if (vm.rule._id === -1)
                    {
                        Rules.push(vm.rule);
                        vm.rule._id = response.nid;
                    }
                
                    $mdDialog.hide(vm.rule);
                    vm.saving = false;
                    //$scope.item = response;
                },
                // Error
                function (response)
                {
                    vm.saving = false;
                    console.error(response);
                }
                
            );
            
        }
        vm.close = function() {
           $mdDialog.hide(); 
        }
        vm.recalc();
    }
})();