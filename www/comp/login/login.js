ionic_app.controller('login_controller', function($scope, $state){
    $scope.login_validation = function(){
        $state.transitionTo('main.select_receipt');
    };
});