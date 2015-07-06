ionic_app.controller('login_controller', function ($scope, $state, $cordovaToast, $ionicHistory, $cordovaFile, login_authentication, login_sid, track_event) {

    $ionicHistory.clearHistory();

    if (typeof analytics !== "undefined") {
        analytics.trackView("Login View");
    }

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
                sid = {
                    sid: data.sid,
                    name: data.full_name
                };
                if (typeof analytics !== "undefined") {
                    analytics.setUserId(sid.name);
                }
                track_event.track('Login', 'Successful', sid.name);
                login_sid.sid = sid.sid;
                login_sid.name = sid.name
                $scope.record_sid(sid);
                delete $scope.login;
                $scope.login = angular.copy($scope.login_object);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                $scope.login.disable = false;
                if (data) {
                    if (data.message) {
                        $cordovaToast.show(data.message, 'short', 'bottom');
                        track_event.track('Login', 'Failure', data.message + " " + scope.login.username);
                    }
                }
                track_event.track('Login', 'Login Failure', scope.login.username);
            });
    };
});