(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $rootScope,$cookies,$http,dynamicMenu)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;


        $rootScope.user = $cookies.getObject("appAuth");
        if ($rootScope.user)
        {
            $http.defaults.headers.common['x-access-token'] = $rootScope.user.token;
            dynamicMenu.init();
        }

        
        
        
        //////////
    }
})();