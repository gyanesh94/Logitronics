ionic_app.controller('main_controller', function($scope, $state){
    $scope.log_out = function() {
        $state.transitionTo('main.login');
    };
});