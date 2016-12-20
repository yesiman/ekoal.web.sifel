(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController($scope,api)
    {
        $scope.user = {email: ""};
        // Methods
        $scope.recover = function() {
            api.mailing.sendMailRecover.post({ email:$scope.user.email },
                // Success
                function (response)
                {
                    console.log(response);
                    //if (response.success)
                    //{
                        
                    //}
                },
                // Error
                function (response)
                {
                    console.error(response);
                }
            );
        }
    }
})();