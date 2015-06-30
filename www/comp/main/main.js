ionic_app.controller('main_controller', function($scope, $state){
    $scope.log_out = function() {
        document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $state.transitionTo('main.login');
    };
});