(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('dynamicMenu', dynamicMenu);

    /** @ngInject **/
    function dynamicMenu()
    {
        /* ----------------- */
        /* Provider          */
        /* ----------------- */
        //var $rootScope = angular.injector(['ng']).get('$rootScope');

        
        /* ----------------- */
        /* Service           */
        /* ----------------- */
        this.$get = function ($rootScope,msNavigationService)
        {
            var service = {
                init: function init()
                {
                    if ($rootScope.user.type == 1)
                    {
                        // Navigation
                        msNavigationService.saveItem('opes', {
                            title : 'OP',
                            group : true,
                            weight: 1
                        });
                        msNavigationService.saveItem('opes.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.opes_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('opes.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.opes_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        // Navigation
                        msNavigationService.saveItem('produits', {
                            title : 'PRODUITS',
                            group : true,
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.produits_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.produits_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                    }
                    if ($rootScope.user.type < 4)
                    {
                        msNavigationService.saveItem('users', {
                            title : 'UTILISATEURS',
                            group : true,
                            weight: 1,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 3);
                            }
                        });
                        msNavigationService.saveItem('users.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.users_list',
                            weight: 1,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 3);
                            }
                        });
                        msNavigationService.saveItem('users.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.users_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                    }
                    else {
                        msNavigationService.deleteItem('users');
                        msNavigationService.deleteItem('users.list'); 
                    }
                }
            };
            return service;
        };
    }
})();