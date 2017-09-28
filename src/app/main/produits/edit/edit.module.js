(function ()
{
    'use strict';

    angular
        .module('app.produits.edit', ['color.picker','ui.grid.selection'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.produits_edit', {
            url      : '/produits/edit',
            params : {
                id:null
            },
            views    : {
                'content@app': {
                    templateUrl: 'app/main/produits/edit/edit.html',
                    controller : 'ProduitsEditController as vm'
                }
            },
            resolve  : {
                prodResolv: function (apiResolver,$stateParams)
                {
                    if ($stateParams.id && ($stateParams.id != -1))
                    {
                         return apiResolver.resolve('products.get@get', {'id': $stateParams.id });
                    }
                    else {
                        return {};
                    }  
                },
                monthsResolv: function (apiResolver,$stateParams)
                {
                    var months = [
                        {id:1,lib:"Janvier",weeks:[]},
                        {id:2,lib:"Février",weeks:[]},
                        {id:3,lib:"Mars",weeks:[]},
                        {id:4,lib:"Avril",weeks:[]},
                        {id:5,lib:"Mai",weeks:[]},
                        {id:6,lib:"Juin",weeks:[]},
                        {id:7,lib:"Juillet",weeks:[]},
                        {id:8,lib:"Aout",weeks:[]},
                        {id:9,lib:"Septembre",weeks:[]},
                        {id:10,lib:"Octobre",weeks:[]},
                        {id:11,lib:"Novembre",weeks:[]},
                        {id:12,lib:"Decembre",weeks:[]}
                    ];
                    var weeksUsed = [];
                    for (var d = new Date(new Date().getFullYear(),0,1);d <= new Date(new Date().getFullYear(),11,31);d.setDate(d.getDate() + 3))
                    {
                        var w = d.getWeek();
                        var found = false;
                        for (var iw = 0;iw < weeksUsed.length;iw++)
                        {
                            if ((d.getMonth() + "-"  + w) == weeksUsed[iw])
                            {
                                found = true;
                            }
                        }
                        if (!found)
                        {
                            weeksUsed.push(d.getMonth() + "-" + w);
                            months[d.getMonth()].weeks.push(w);
                        }
                    }
                    return months;
                }
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/produits/edit');

/*msNavigationServiceProvider.saveItem('users', {
            title : 'UTILISATEURS',
            group : true,
            state    : 'app.users_list',
            weight: 1
        });*/
        // Navigation
        
/*
        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();