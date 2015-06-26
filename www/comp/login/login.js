ionic_app.controller('login_controller', function($scope, $state, switch_preffered_language){
    $scope.login_validation = function(){
        $state.transitionTo('main.select_receipt');
    };
    
    $scope.switch_to_english = function(){
        switch_preffered_language.translate_language('en');
    };
    
    $scope.switch_to_hindi = function(){
        switch_preffered_language.translate_language('hi');
    };
});