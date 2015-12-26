ionic_app.controller('main_controller', function ($scope, $rootScope, $state, $cordovaFile, $cordovaToast, $ionicDeploy, $cordovaSQLite, switch_preffered_language, app_settings, login_sid, track_event, send_image) {

    $scope.log_out = function () {
        document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $rootScope.$broadcast('log_out_event', {
            message: 'logout'
        });
        $cordovaFile.removeFile(cordova.file.dataDirectory, "sid.txt")
            .then(function (success) {
                login_sid.sid = '';
                track_event.track('Logout', 'Successfull', login_sid.name);
                login_sid.name = '';
                $state.transitionTo('main.login');
            }, function (error) {});
    };

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

    $scope.app_settings_copy = angular.copy(app_settings);

    // function update server base url
    $scope.update_server_base_url = function () {
        app_settings.server_base_url = $scope.app_settings_copy.server_base_url;
        $scope.update_app_settings_file(app_settings);
    };

    $scope.switch_to_english = function () {
        switch_preffered_language.translate_language('en');
    };

    $scope.switch_to_hindi = function () {
        switch_preffered_language.translate_language('hi');
    };

    // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function () {
        $ionicDeploy.update().then(function (res) {
            console.log('Ionic Deploy: Update Success! ', res);
            $cordovaToast.show("Update Successful", 'short', 'bottom');
            track_event.track('Ionic Deploy', "Update Successful", res + " " + login_sid.name);
        }, function (err) {
            console.log('Ionic Deploy: Update error! ', err);
            $cordovaToast.show("Update Error", 'short', 'bottom');
            track_event.track('Ionic Deploy', "Update Error", err + " " + login_sid.name);
        }, function (prog) {
            console.log('Ionic Deploy: Progress... ', prog);
            $cordovaToast.show("Update in Progress... ", 'short', 'bottom');
        });
    };


    // Upload Data
    var me = this;
    me.data_temp_files = null;

    $scope.upload_data = {};
    $scope.upload_data.sync_total = 0;
    $scope.upload_data.button_disable = false;

    me.total_update = function () {
        $scope.upload_data.sync_total = 0;
        var query = 'SELECT * FROM RECEIPT_FILES WHERE UPLOADED = 0';
        $cordovaSQLite.execute(db, query).then(function (result) {
            me.data_temp_files = result;
            $scope.upload_data.sync_total = me.data_temp_files.rows.length;
        }, function (err) {
            $cordovaToast.show("Error in Files DB Fetch", 'short', 'bottom');
            console.error(err);
            me.data_temp_files = null;
        });
    };

    me.total_update();

    $rootScope.$on("receipt_to_db", function (event, args) {
        me.total_update();
    });


    me.send_image_file = function (t_name, t_path, count, t_pid, t_img_suf, t_type) {
        $cordovaFile.readAsText(t_path, t_name).then(function (t_data) {
            send_image.send(t_pid, t_data, 'gr_' + t_pid + t_img_suf, 'Goods Receipt', t_type)
                .success(function (data) {
                    var query = "UPDATE RECEIPT_FILES SET UPLOADED = 1 WHERE FILE_NAME = " + t_name;
                    $cordovaSQLite.execute(db, query);
                    $scope.upload_data.upload(count);
                })
                .error(function (error) {
                    if (typeof error == 'object')
                        error = JSON.stringify(error);
                    $cordovaToast.show(error, 'short', 'bottom');
                    track_event.track('File Not Uploaded ' + t_name, "Error ", error + " " + login_sid.name);
                    var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                    $cordovaSQLite.execute(db, query, ["File Not Uploaded " + t_name, error]);
                    $scope.upload_data.upload(count);
                });
        }, function (error) {
            if (typeof error == 'object')
                error = JSON.stringify(error);
            $cordovaToast.show(error, 'short', 'bottom');
            track_event.track('File Not Read ' + t_name, "Error ", error + " " + login_sid.name);
            var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
            $cordovaSQLite.execute(db, query, ["File Not Read " + t_name, error]);
            $scope.upload_data.upload(count);
        });
    };


    $scope.upload_data.upload = function (count) {
        $scope.upload_data.button_disable = true;
        if (count > 0) {
            count = count - 1;
            t_name = me.data_temp_files.rows.item(count).FILE_NAME;
            t_pid = me.data_temp_files.rows.item(count).PARENT_ID;
            t_path = cordova.file.dataDirectory + "/proof_img/";

            if (t_name.indexOf("_customer_image.txt") != -1) {
                me.send_image_file(t_name, t_path, count, t_pid, '_customer_image.jpg', 'customer_image');
            } else {
                me.send_image_file(t_name, t_path, count, t_pid, '_signature.txt', 'signature');
            }

        }

        if (count == 0) {
            $scope.upload_data.button_disable = false;
            me.total_update();
        }
    };



    // Show DB
    $scope.show_db = {};
    $scope.show_db.pass = '';
    $scope.show_db.show = function () {
        $rootScope.$emit('db_update', {});
        $state.transitionTo('main.show_db');
    };


    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function () {
        console.log('Ionic Deploy: Checking for updates');
        $ionicDeploy.check().then(function (hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            $cordovaToast.show("Update available", 'short', 'bottom');
            $scope.hasUpdate = hasUpdate;
        }, function (err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
            $cordovaToast.show("Unable to check for updates", 'short', 'bottom');
            track_event.track('Ionic Deploy', "Check for update Error", err + " " + login_sid.name);
        });
    }
});