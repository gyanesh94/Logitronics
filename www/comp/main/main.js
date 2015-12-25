ionic_app.controller('main_controller', function ($scope, $rootScope, $state, $cordovaFile, $cordovaToast, $ionicDeploy, $cordovaSQLite, switch_preffered_language, app_settings, login_sid, track_event, create_new_payment_receipt) {

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
    me.data_temp_receipt = null;

    $scope.upload_data = {};
    $scope.upload_data.sync_total = 0;
    $scope.upload_data.button_disable = false;

    me.query_update = function () {
        $scope.upload_data.sync_total = 0;
        var query = 'SELECT * FROM RECEIPT_DATA WHERE UPLOADED = 0 ORDER BY VOUCHER_TYPE DESC, ID DESC';
        $cordovaSQLite.execute(db, query).then(function (result) {
            me.data_temp_receipt = result;
            $scope.upload_data.sync_total = $scope.upload_data.sync_total + me.data_temp_receipt.rows.length;
        }, function (err) {
            $cordovaToast.show("Error in PR Fetch", 'short', 'bottom');
            console.error(err);
            me.data_temp_receipt = null;
        });
    };

    me.query_update();

    $rootScope.$on("receipt_to_db", function (event, args) {
        me.query_update();
    });

    $scope.upload_data.upload = function (count) {
        $scope.upload_data.button_disable = true;
        if (count > 0) {
            count = count - 1;
            if (me.data_temp_receipt.rows.item(count).VOUCHER_TYPE == 'PR') {
                create_new_payment_receipt.create_feed(me.data_temp_receipt.rows.item(count).METADATA)
                    .success(function (data) {
                        var tmp_id = me.data_temp_receipt.rows.item(count).ID;
                        query = "UPDATE RECEIPT_DATA SET UPLOADED = 1 WHERE ID = " + tmp_id;
                        $cordovaSQLite.execute(db, query).then(function (res) {
                            console.log("PR Success");
                            $scope.upload_data.upload(count);
                        }, function (err) {
                            console.error(err);
                        });
                    })
                    .error(function (data) {
                        var message;
                        if (data._server_messages) {
                            message = JSON.parse(data._server_messages);
                            message = message[0];
                        } else {
                            message = "Server Error";
                        }
                        $cordovaToast.show(message, 'short', 'bottom');
                        track_event.track('Payment Receipt', "Error ", message + " " + login_sid.name);
                        var query = "INSERT INTO ERROR_LOG VALUES(?, ?)";
                        $cordovaSQLite.execute(db, query, ["Creating PR", JSON.stringify(message)]);
                        $scope.upload_data.upload(count);
                    });
            }
        }
        if (count == 0) {
            $scope.upload_data.button_disable = false;
            me.query_update();
        }
    };

    

    // Show DB
    $scope.show_db = {};
    $scope.show_db.pass = '';
    $scope.show_db.show = function (){
        if ($scope.show_db.pass == 'error'){
            $scope.show_db.pass = "";
            $state.transitionTo('main.show_db');
        }
        else{
            $cordovaToast.show("Wrong Pass", 'short', 'bottom');
        }
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