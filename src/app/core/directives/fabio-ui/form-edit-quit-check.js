(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('formEditQuitCheck', formEditQuitCheckDirective);

    /** @ngInject */
    function formEditQuitCheckDirective($timeout,$mdDialog, $window)
    {
        return {
            restrict   : 'A',
            link: function(scope) {
                scope.goBackOk = false;
                $timeout(function(){
                    scope.$on('$locationChangeStart', function( event, next ) {
                        if (!scope.goBackOk){event.preventDefault();}
                        else {return;}
                        
                         var confirm = $mdDialog.confirm()
                            .title('Confirmation')
                            .textContent('Les modifications non sauvegardées seront perdues.')
                            .targetEvent(event)
                            .ok('Continuer')
                            .cancel('Annuler');
                        $mdDialog.show(confirm).then(function() {
                            scope.goBackOk = true;
                            $window.history.back();
                        }, function() {
                            scope.goBackOk = false;
                        });


                        //var answer = confirm("Are you sure you want to leave this page?")
                        //if (!answer) {
                            
                        //}
                    });
                });  
            }            
        };
    }
    
})();