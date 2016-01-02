ionic_app.controller('main_controller', function ($scope, $rootScope, $state, $cordovaFile, $cordovaToast, $ionicDeploy, $cordovaSQLite, switch_preffered_language, app_settings, login_sid, track_event, send_image, upload_error_data, send_error_data, app_version) {


    $scope.app_version = app_version.version;

    // Log Out Functionalities

    $scope.log_out = function () {
        document.cookie = "sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        $rootScope.$broadcast('log_out_event', {
            message: 'logout'
        });

        login_sid.name = '';
        login_sid.sid = '';

        $cordovaFile.writeFile(cordova.file.dataDirectory, "sid.txt", JSON.stringify(login_sid), true)
            .then(function (success) {
                track_event.track('Logout', 'Successfull', login_sid.name);
                $cordovaToast.show("Logout Successfully", 'short', 'bottom');
                $state.transitionTo('main.login');
            }, function (error) {});


        //        $cordovaFile.removeFile(cordova.file.dataDirectory, "sid.txt")
        //            .then(function (success) {
        //                login_sid.sid = '';
        //                track_event.track('Logout', 'Successfull', login_sid.name);
        //                login_sid.name = '';
        //                $state.transitionTo('main.login');
        //            }, function (error) {});

    };

    $rootScope.$on("error_403", function (event, args) {
        $scope.log_out();
    });


    // App dev Settings
    $scope.app_set = {};
    $scope.app_set.pass = "";
    $scope.app_set.go = function () {
        if ($scope.app_set.pass.toString() == "123456780") {
            $scope.app_set.pass = "";
            $state.transitionTo("main.set");
        } else {
            $cordovaToast.show("Wrong Pass", "short", "bottom");
        }
    };


    // Switching Preffered Language
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
        }, function (error) {
            console.log('Ionic Deploy: Update error! ', error);
            $cordovaToast.show("Update Error " + error, 'short', 'bottom');

            t_send_error = {};
            t_send_error.NAME = "Update Error";
            t_send_error.DESCRIPTION = error;
            send_error_data.send_data(t_send_error, device);

            track_event.track('Ionic Deploy', "Update Error", error + " " + login_sid.name);
        }, function (prog) {
            console.log('Ionic Deploy: Progress... ', prog);
            $cordovaToast.show("Update in Progress... ", 'short', 'bottom');
        });
    };



    // Send Error to Server
    $scope.send_error_data = {};
    $scope.send_error_data.button = false;
    $scope.send_error_data.send = function () {
        $scope.send_error_data.button = true;
        var query = 'SELECT * FROM ERROR_LOG';
        $cordovaSQLite.execute(db, query)
            .then(function (result) {
                var data = [];
                t_len = result.rows.length;
                for (i = 0; i < t_len; i++) {
                    var temp = {};
                    temp.NAME = result.rows.item(i).NAME;
                    temp.DESCRIPTION = result.rows.item(i).DESCRIPTION;
                    temp.DATE = result.rows.item(i).DATE_TIME;
                    data.push(temp);
                }
                upload_error_data.send_data(data, device)
                    .success(function (data) {
                        $scope.send_error_data.button = false;
                        $cordovaToast.show("Error Log Uploaded", 'short', 'bottom');
                    })
                    .error(function (error) {
                        $scope.send_error_data.button = false;
                        $cordovaToast.show("Error Log Unable to Upload " + error, 'short', 'bottom');
                        console.error(error);
                        var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                        $cordovaSQLite.execute(db, query, ["Error Log Upload ", JSON.stringify(error)]);
                    });
            }, function (error) {
                $scope.send_error_data.button = false;
                $cordovaToast.show("Error in Error Log Fetch" + error, 'short', 'bottom');
                console.error(error);
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
            me.data_temp_files = null;
            me.data_temp_files = result;
            $scope.upload_data.sync_total = me.data_temp_files.rows.length;
        }, function (error) {
            $cordovaToast.show("Error in Files DB Fetch " + error, 'short', 'bottom');
            console.error(error);
            me.data_temp_files = null;
            $scope.upload_data.sync_total = 0;
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
                    var query = "UPDATE RECEIPT_FILES SET UPLOADED = 1 WHERE FILE_NAME = '" + t_name + "'";
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
                    t_send_error = {};
                    t_send_error.NAME = "File Not Uploaded " + t_name;
                    t_send_error.DESCRIPTION = error;
                    send_error_data.send_data(t_send_error, device);
                    $scope.upload_data.upload(count);
                });
        }, function (error) {
            if (typeof error == 'object')
                error = JSON.stringify(error);
            $cordovaToast.show(error, 'short', 'bottom');
            track_event.track('File Not Read ' + t_name, "Error ", error + " " + login_sid.name);
            var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
            $cordovaSQLite.execute(db, query, ["File Not Read " + t_name, error]);
            t_send_error = {};
            t_send_error.NAME = "File Not Read " + t_name;
            t_send_error.DESCRIPTION = error;
            send_error_data.send_data(t_send_error, device);
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
                me.send_image_file(t_name, t_path, count, t_pid, '_signature.jpg', 'signature');
            }
        }
        if (count == 0) {
            $scope.upload_data.button_disable = false;
            me.data_temp_files = null;
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
            if (hasUpdate) {
                $cordovaToast.show("Update available", 'short', 'bottom');
                $scope.hasUpdate = hasUpdate;
            } else {
                $cordovaToast.show("Latest Version Installed", 'short', 'bottom');
            }
        }, function (error) {
            console.error('Ionic Deploy: Unable to check for updates', error);
            $cordovaToast.show("Unable to check for updates " + error, 'short', 'bottom');
            t_send_error = {};
            t_send_error.NAME = "Ionic Deploy: Unable to check for updates";
            t_send_error.DESCRIPTION = error;
            send_error_data.send_data(t_send_error, device);
            track_event.track('Ionic Deploy', "Check for update Error", error + " " + login_sid.name);
        });
    }
});