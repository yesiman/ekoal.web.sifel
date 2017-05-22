(function ()
{
    'use strict';

    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource)
    {
        /**
         * You can use this service to define your API urls. The "api" service
         * is designed to work in parallel with "apiResolver" service which you can
         * find in the "app/core/services/api-resolver.service.js" file.
         *
         * You can structure your API urls whatever the way you want to structure them.
         * You can either use very simple definitions, or you can use multi-dimensional
         * objects.
         *
         * Here's a very simple API url definition example:
         *
         *      api.getBlogList = $resource('http://api.example.com/getBlogList');
         *
         * While this is a perfectly valid $resource definition, most of the time you will
         * find yourself in a more complex situation where you want url parameters:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'});
         *
         * You can also define your custom methods. Custom method definitions allow you to
         * add hardcoded parameters to your API calls that you want to sent every time you
         * make that API call:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'}, {
         *         'getFromHomeCategory' : {method: 'GET', params: {blogCategory: 'home'}}
         *      });
         *
         * In addition to these definitions, you can also create multi-dimensional objects.
         * They are nothing to do with the $resource object, it's just a more convenient
         * way that we have created for you to packing your related API urls together:
         *
         *      api.blog = {
         *                   list     : $resource('http://api.example.com/blog'),
         *                   getById  : $resource('http://api.example.com/blog/:id', {id: '@id'}),
         *                   getByDate: $resource('http://api.example.com/blog/:date', {id: '@date'}, {
         *                       get: {
         *                            method: 'GET',
         *                            params: {
         *                                getByDate: true
         *                            }
         *                       }
         *                   })
         *       }
         *
         * If you look at the last example from above, we overrode the 'get' method to put a
         * hardcoded parameter. Now every time we make the "getByDate" call, the {getByDate: true}
         * object will also be sent along with whatever data we are sending.
         *
         * All the above methods are using standard $resource service. You can learn more about
         * it at: https://docs.angularjs.org/api/ngResource/service/$resource
         *
         * -----
         *
         * After you defined your API urls, you can use them in Controllers, Services and even
         * in the UIRouter state definitions.
         *
         * If we use the last example from above, you can do an API call in your Controllers and
         * Services like this:
         *
         *      function MyController (api)
         *      {
         *          // Get the blog list
         *          api.blog.list.get({},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the id of 3
         *          var id = 3;
         *          api.blog.getById.get({'id': id},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the date by using custom defined method
         *          var date = 112314232132;
         *          api.blog.getByDate.get({'date': date},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *      }
         *
         * Because we are directly using $resource service, all your API calls will return a
         * $promise object.
         *
         * --
         *
         * If you want to do the same calls in your UI Router state definitions, you need to use
         * "apiResolver" service we have prepared for you:
         *
         *      $stateProvider.state('app.blog', {
         *          url      : '/blog',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver)
         *              {
         *                  return apiResolver.resolve('blog.list@get');
         *              }
         *          }
         *      });
         *
         *  You can even use parameters with apiResolver service:
         *
         *      $stateProvider.state('app.blog.show', {
         *          url      : '/blog/:id',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver, $stateParams)
         *              {
         *                  return apiResolver.resolve('blog.getById@get', {'id': $stateParams.id);
         *              }
         *          }
         *      });
         *
         *  And the "Blog" object will be available in your BlogController:
         *
         *      function BlogController(Blog)
         *      {
         *          var vm = this;
         *
         *          // Data
         *          vm.blog = Blog;
         *
         *          ...
         *      }
         */

        var api = {};

        // Base Url
        api.baseUrl = 'https://sifel-srv.herokuapp.com/';
        // USERS
        api.users = {
            login: $resource(api.baseUrl + 'users/login', {user:'@user'} , {
                post: {
                    method: 'POST'
                }
            }),
            clearAll: $resource(api.baseUrl + 'users/clearAll', {} , {
                get: {
                    method: 'GET'
                }
            }),
            refreshToken: $resource(api.baseUrl + 'users/refreshToken', {} , {
                get: {
                    method: 'GET'
                }
            }),
            add: $resource(api.baseUrl + 'users/add/:id', {id:'@id',user:'@user'} , {
                post: {
                    method: 'POST'
                }
            }),
            addParcelle: $resource(api.baseUrl + 'users/addParcelle/:id', {id:'@id',parcelle:'@parcelle'} , {
                post: {
                    method: 'POST'
                }
            }),
            deleteParcelle: $resource(api.baseUrl + 'users/deleteParcelle/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            get: $resource(api.baseUrl + 'users/get/:id', {id:'@id',withParc:'@withParc'} , {
                get: {
                    method: 'GET'
                }
            }),
            getParcelles: $resource(api.baseUrl + 'users/getParcelles/:pid/:nbp/:id', {pid:'@pid',nbp:'@nbp',id:'@id',req:'@req'} , {
                post: {
                    method: 'POST'
                }
            }),
            delete: $resource(api.baseUrl + 'users/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            getAll: $resource(api.baseUrl + 'users/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp', levels:'@levels',txtFilter:'@txtFilter'} , {
                post: {
                    method: 'POST'
                }
            }),
            getAllByType: $resource(api.baseUrl + 'users/getAllByType/:pid/:nbp/:idt/:req', {pid:'@pid',nbp:'@nbp',idt:'@idt',req:'@req'} , {
                get: {
                    method: 'GET'
                }
            }),
            getAllByOrga: $resource(api.baseUrl + 'users/getAllByOrga/:pid/:nbp/:ido', {pid:'@pid',nbp:'@nbp',ido:'@ido',req:'@req'} , {
                post: {
                    method: 'POST'
                }
            })
        }
        // USERS GROUPS
        api.usersGroups = {
            add: $resource(api.baseUrl + 'usersGroups/add/:id', {id:'@id',group:'@group'} , {
                post: {
                    method: 'POST'
                }
            }),
            get: $resource(api.baseUrl + 'usersGroups/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            delete: $resource(api.baseUrl + 'usersGroups/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            getAll: $resource(api.baseUrl + 'usersGroups/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp'} , {
                get: {
                    method: 'GET'
                }
            })
        }
        // ORGAS
        api.orgas = {
            add: $resource(api.baseUrl + 'orgas/add/:id', {id:'@id',orga:'@orga'} , {
                post: {
                    method: 'POST'
                }
            }),
            get: $resource(api.baseUrl + 'orgas/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            delete: $resource(api.baseUrl + 'orgas/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            getAll: $resource(api.baseUrl + 'orgas/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp'} , {
                get: {
                    method: 'GET'
                }
            })
        }
        // PRODUCTS GROUPS
        api.productsGroups = {
            add: $resource(api.baseUrl + 'productsGroups/add/:id', {id:'@id',group:'@group'} , {
                post: {
                    method: 'POST'
                }
            }),
            get: $resource(api.baseUrl + 'productsGroups/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            delete: $resource(api.baseUrl + 'productsGroups/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            getAll: $resource(api.baseUrl + 'productsGroups/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp'} , {
                get: {
                    method: 'GET'
                }
            })
        }
        // PRODUCTS
        api.products = {
            add: $resource(api.baseUrl + 'products/add/:id', {id:'@id',product:'@product'} , {
                post: {
                    method: 'POST'
                }
            }),
            get: $resource(api.baseUrl + 'products/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            delete: $resource(api.baseUrl + 'products/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            getAllByLib: $resource(api.baseUrl + 'products/getAllByLib/:pid/:nbp/:req', {pid:'@pid',nbp:'@nbp',req:'@req'} , {
                get: {
                    method: 'GET'
                }
            }),
            getAll: $resource(api.baseUrl + 'products/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp'} , {
                get: {
                    method: 'GET'
                }
            }),
            getAllFromDouane: $resource(api.baseUrl + 'products/getAllFromDouane/:level/:parent', {level:'@level',parent:'@parent'} , {
                get: {
                    method: 'GET'
                }
            })
        }
        api.planifs = {
            get: $resource(api.baseUrl + 'planifs/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            add: $resource(api.baseUrl + 'planifs/add/:id', {id:'@id',planif:'@planif'} , {
                post: {
                    method: 'POST'
                }
            }),
            getAll: $resource(api.baseUrl + 'planifs/getAll/:pid/:nbp', {pid:'@pid',nbp:'@nbp',produits:'@produits',producteurs:'@producteurs',dateFrom:'@dateFrom',dateTo:'@dateTo'} , {
                post: {
                    method: 'POST'
                }
            }),
            delete: $resource(api.baseUrl + 'planifs/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            }),
            groupDec: $resource(api.baseUrl + 'planifs/groupDec', {produits:'@produits',producteurs:'@producteurs',dateFrom:'@dateFrom',dateTo:'@dateTo',decalIn:'@decalIn'} , {
                post: {
                    method: 'POST'
                }
            }),
            groupDup: $resource(api.baseUrl + 'planifs/groupDup', {produits:'@produits',producteurs:'@producteurs',dateFrom:'@dateFrom',dateTo:'@dateTo',decalIn:'@decalIn'} , {
                post: {
                    method: 'POST'
                }
            }),
            groupChangeRule: $resource(api.baseUrl + 'planifs/groupChangeRule', {produits:'@produits',producteurs:'@producteurs',dateFrom:'@dateFrom',dateTo:'@dateTo',newRule:'@newRule'} , {
                post: {
                    method: 'POST'
                }
            })
        }
        api.rules = {
            get: $resource(api.baseUrl + 'rules/get/:id', {id:'@id'} , {
                get: {
                    method: 'GET'
                }
            }),
            add: $resource(api.baseUrl + 'rules/add/:id', {id:'@id',rule:'@rule'} , {
                post: {
                    method: 'POST'
                }
            }),
            getAllByProduit: $resource(api.baseUrl + 'rules/getAllByProduit/:pid/:nbp/:id', {pid:'@pid',nbp:'@nbp',id:'@id',req:'@req'} , {
                post: {
                    method: 'POST'
                }
            }),
            delete: $resource(api.baseUrl + 'rules/delete/:id', {id:'@id'} , {
                delete: {
                    method: 'DELETE'
                }
            })
        }
        api.stats = {
            prevsByDay: $resource(api.baseUrl + 'stats/prevsByDay/', { prodsIds:'@prodsIds',dateFrom:'@dateFrom',dateTo:'@dateTo', dateFormat:'@dateFormat', unit:'@unit' } , {
                post: {
                    method: 'POST'
                }
            }),
            prevsByProd: $resource(api.baseUrl + 'stats/prevsByProd/', { prodsIds:'@prodsIds',dateFrom:'@dateFrom',dateTo:'@dateTo', dateFormat:'@dateFormat', unit:'@unit' } , {
                post: {
                    method: 'POST'
                }
            }),
            prevsPlanifsLines: $resource(api.baseUrl + 'stats/prevsPlanifsLines/:pid/:nbp', { prodsIds:'@prodsIds',dateFrom:'@dateFrom',dateTo:'@dateTo', dateFormat:'@dateFormat',pid:'@pid',nbp:'@nbp', unit:'@unit' } , {
                post: {
                    method: 'POST'
                }
            }),
            prevsPlanifsLinesApplyPercent: $resource(api.baseUrl + 'stats/prevsPlanifsLinesApplyPercent/', { prodsIds:'@prodsIds',dateFrom:'@dateFrom',dateTo:'@dateTo', dateFormat:'@dateFormat',percent:'@percent' } , {
                post: {
                    method: 'POST'
                }
            })
        }
        api.mailing = {
            sendMailRecover: $resource(api.baseUrl + 'mailing/sendMailRecover/', { email:'@email' } , {
                post: {
                    method: 'POST'
                }
            })
        }
        api.twilio = {
            testTwilio: $resource(api.baseUrl + 'messaging/testTwilio/', { message:'@message' } , {
                post: {
                    method: 'POST'
                }
            }),
            testSmsF: $resource(api.baseUrl + 'messaging/testSmsF/', { } , {
                post: {
                    method: 'POST'
                }
            })
        }
        
        return api;
    }

})();