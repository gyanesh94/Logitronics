ionic_app.controller('login_controller', function ($scope, $state, $cordovaToast, $cordovaFile, switch_preffered_language, login_authentication, login_sid) {

    $scope.login_object = {
        username: '',
        password: '',
        disable: false,
        full_name: ''
    };
    $scope.login = angular.copy($scope.login_object);

    // Record Sid
    $scope.record_sid = function (data) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.writeFile(cordova.file.dataDirectory, "sid.txt", JSON.stringify(data), true)
                .then(function (success) {}, function (error) {});
        });
    };


    $scope.login_validation = function () {
        $scope.login.disable = true;
        login_authentication.login_authenticate($scope.login.username, $scope.login.password)
            .success(function (data) {
                $scope.login.disable = false;
                $scope.login.full_name = data.full_name;
                sid = {
                    sid: data.sid
                };
                login_sid.sid = sid.sid;
                $scope.record_sid(sid);
                delete $scope.login;
                $scope.login = angular.copy($scope.login_object);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                $scope.login.disable = false;
                if (data)
                    if (data.message)
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