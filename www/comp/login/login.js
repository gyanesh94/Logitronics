ionic_app.controller('login_controller', function ($scope, $state, $cordovaToast, switch_preffered_language, login_authentication) {

    $scope.login_object = {
        username: '',
        password: '',
        disable: false,
        full_name: ''
    };
    $scope.login = angular.copy($scope.login_object);
    $scope.login_validation = function () {
        $scope.login.disable = true;
        login_authentication.login_authenticate($scope.login.username, $scope.login.password)
            .success(function (data) {
                $scope.login.full_name = data.full_name;
                $scope.login.disable = false;
                delete $scope.login;
                $scope.login = angular.copy($scope.login_object);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                $scope.login.disable = false;
                $cordovaToast.show(data.message, 'short', 'bottom');
            });
    };

    $scope.switch_to_english = function () {
        switch_preffered_language.translate_language('en');
    };

    $scope.switch_to_hindi = function () {
        switch_preffered_language.translate_language('hi');
    };
});