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

                    

                    msNavigationService.saveItem('dash', {
                        title : 'TABLEAU DE BOARD',
                        group : true,
                        state    : 'app.dashboards_server',
                        weight: 1
                    });
                    if ($rootScope.user.type == 1)
                    {
                        // Navigation
                        msNavigationService.saveItem('opes', {
                            title : 'OP',
                            group : true,
                            state    : 'app.opes_list',
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
                        msNavigationService.deleteItem('planifs');
                        msNavigationService.deleteItem('planifs.list'); 
                        msNavigationService.deleteItem('planifs.new');
                    }
                    else {
                        msNavigationService.saveItem('planifs', {
                            title : 'PLANIFICATIONS',
                            group : true,
                            weight: 2,
                            state    : 'app.planifs_list',
                        });
                        
                        msNavigationService.saveItem('planifs.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.planifs_list',
                            weight: 2,
                        });
                        msNavigationService.saveItem('planifs.edit', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.planifs_edit',
                            weight: 2
                        });
                        msNavigationService.saveItem('planifs.stats', {
                            title : 'Statistiques',
                            icon  : 'icon-chart-line',
                            state    : 'app.stats_prevs',
                            weight: 2
                        });
                        msNavigationService.deleteItem('opes');
                        msNavigationService.deleteItem('opes.list'); 
                        msNavigationService.deleteItem('opes.new');
                    }
                    if (($rootScope.user.type < 3) && !($rootScope.user.type == 1))
                    {
                        // Navigation
                        msNavigationService.saveItem('produits', {
                            title : 'PRODUITS',
                            group : true,
                            weight: 1,
                            state    : 'app.produits_list',
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
                        msNavigationService.saveItem('produits.groups', {
                            title : 'Groupes',
                            icon  : 'icon-group',
                            group : true,
                            state    : 'app.produits_groups_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.groups.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.produits_groups_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.groups.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.produits_groups_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.categories', {
                            title : 'Catégories',
                            icon  : 'icon-arrange-send-to-back',
                            group : true,
                            state    : 'app.produits_categories_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.categories.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.produits_categories_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.categories.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.produits_categories_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.conditionnements', {
                            title : 'Conditionnements',
                            icon  : 'icon-cube-outline',
                            group : true,
                            state    : 'app.produits_condit_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.conditionnements.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.produits_condit_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('produits.conditionnements.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.produits_condit_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                    }
                    else {
                        msNavigationService.deleteItem('produits');
                        msNavigationService.deleteItem('produits.list'); 
                        msNavigationService.deleteItem('produits.new'); 
                        msNavigationService.deleteItem('produits.groups');
                        msNavigationService.deleteItem('produits.groups.list'); 
                        msNavigationService.deleteItem('produits.groups.new'); 
                    }
                    if ($rootScope.user.type < 4)
                    {
                        msNavigationService.saveItem('users', {
                            title : 'UTILISATEURS',
                            group : true,
                            weight: 1,
                            state    : 'app.users_list',
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
                            stateParams: {id:-1,profil:false},
                            weight: 1
                        });
                        msNavigationService.saveItem('users.groups', {
                            title : 'Groupes producteurs',
                            icon  : 'icon-group',
                            group : true,
                            weight: 1
                        });
                        msNavigationService.saveItem('users.groups.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.users_groups_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('users.groups.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.users_groups_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        
                    }
                    else {
                        msNavigationService.deleteItem('users');
                        msNavigationService.deleteItem('users.list'); 
                        msNavigationService.deleteItem('users.new'); 
                        msNavigationService.deleteItem('users.groups');
                        msNavigationService.deleteItem('users.groups.list'); 
                        msNavigationService.deleteItem('users.groups.new'); 
                    }
                    //AGREAGE
                    if ($rootScope.user.type < 4 && !($rootScope.user.type == 1))
                    {
                        msNavigationService.saveItem('agreage', {
                            title : 'AGREAGE',
                            group : true,
                            weight: 4
                        });
                        msNavigationService.saveItem('agreage.stations', {
                            title : 'Stations',
                            icon  : 'icon-truck',
                            state    : 'app.stations_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('agreage.stations.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.stations_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('agreage.stations.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.stations_edit',
                            stateParams: {id:-1,profil:false},
                            weight: 1
                        });
                        //
                        msNavigationService.saveItem('agreage.bons', {
                            title : 'Bons',
                            icon  : 'icon-file-hidden',
                            state    : 'app.bons_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('agreage.bons.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.bons_list',
                            weight: 1
                        });
                        msNavigationService.saveItem('agreage.bons.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.bons_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        msNavigationService.saveItem('agreage.stats', {
                            title : 'Statistiques',
                            icon  : 'icon-chart-line',
                            state    : 'app.stats_agreag',
                            weight: 2
                        });
                        //
                        msNavigationService.saveItem('facturation', {
                            title : 'FACTURATION',
                            group : true,
                            weight: 5,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 2);
                            }
                        });
                        msNavigationService.saveItem('facturation.clients', {
                            title : 'Clients',
                            icon:'icon-account-outline',
                            state    : 'app.clients_list',
                            weight: 1,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 2);
                            }
                        });
                        msNavigationService.saveItem('facturation.clients.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.clients_list',
                            weight: 1,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 2);
                            }
                        });
                        /*msNavigationService.saveItem('facturation.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.facturation_list',
                            weight: 1,
                            hidden: function()
                            {
                                return ($rootScope.user.type > 2);
                            }
                        });*/
                        msNavigationService.saveItem('facturation.list', {
                            title : 'Liste',
                            icon  : 'icon-view-list',
                            state    : 'app.factu_list',
                            stateParams: {},
                            weight: 1
                        });
                        msNavigationService.saveItem('facturation.new', {
                            title : 'Nouveau',
                            icon  : 'icon-plus-circle-outline',
                            state    : 'app.factu_edit',
                            stateParams: {id:-1},
                            weight: 1
                        });
                        
                    }
                    else {
                        msNavigationService.deleteItem('agreage');
                        msNavigationService.deleteItem('agreage.stations'); 
                        msNavigationService.deleteItem('agreage.stations.list'); 
                        msNavigationService.deleteItem('agreage.stations.new'); 
                        msNavigationService.deleteItem('agreage.bons'); 
                        msNavigationService.deleteItem('agreage.bons.list'); 
                        msNavigationService.deleteItem('agreage.bons.new'); 
                        msNavigationService.deleteItem('agreage.stats'); 
                        msNavigationService.deleteItem('facturation');
                        msNavigationService.deleteItem('facturation.clients');
                        msNavigationService.deleteItem('facturation.clients.list'); 
                        msNavigationService.deleteItem('facturation.clients.new'); 
                    }
                    
                }
            };
            return service;
        };
    }
})();