ionic_app.controller('set_controller', function ($scope, $state, app_settings, $cordovaToast, $cordovaFile) {

    $scope.db_to_home = function () {
        $state.transitionTo('main.login');
    };

    $scope.app_settings = {}
    $scope.app_settings.server_base_url = app_settings.server_base_url;

    // update app settings file
    $scope.update_app_settings_file = function (data) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.writeFile(cordova.file.dataDirectory, "app_settings.txt", JSON.stringify(data), true)
                .then(function (success) {
                    $cordovaToast.show("Settings Updated", 'short', 'bottom');
                }, function (error) {
                    $cordovaToast.show("Settings Not Updated", 'short', 'bottom');
                });
        });
    };


    // function update server base url
    $scope.app_settings.update_server_base_url = function () {
        app_settings.server_base_url = $scope.app_settings.server_base_url;
        console.error(app_settings);
        $scope.update_app_settings_file(app_settings);
    };

});