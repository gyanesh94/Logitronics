ionic_app.controller('main_controller', function ($scope, $rootScope, $state) {
    $scope.log_out = function () {
        document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $rootScope.$broadcast('log_out_event', {
            message: 'logout'
        });
        $state.transitionTo('main.login');
    };
});