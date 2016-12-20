(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $rootScope,$cookies,$http,dynamicMenu,$state)
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
        $rootScope.$on('unauthorized', function() {
            //console.log("unauthorized.called");
            //main.currentUser = UserService.setCurrentUser(null);
            $state.go('app.pages_auth_login');
        });
        
        
        
        //////////
    }
})();