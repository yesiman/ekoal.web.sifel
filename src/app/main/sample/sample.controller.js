(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData,api)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;
        vm.send = function()
        {
            api.twilio.testTwilio.post();
        }
        // Methods

        //////////
    }
})();
