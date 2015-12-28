ionic_app.controller('good_receipt_controller', function ($scope, $rootScope, $state, $ionicHistory, $cordovaToast, $cordovaCamera, $cordovaFile, $cordovaGeolocation, $cordovaSQLite, get_customer_live, images_link_empty, images_link_filled, get_vehicle_live, create_new_good_receipt, canvas_signature, send_image, track_event, login_sid, send_error_data) {
    var me = this;

    if (typeof analytics !== "undefined") {
        analytics.trackView("Good Receipt View");
    }

    $scope.new_good_receipt_object = {
        customer_name: {},
        item_delievered_name: '',
        item_delievered_quantity: '',
        item_received_name: '',
        item_received_quantity: '',
        done: false,
        vehicle_number: '',
        customer_document_id: '',
        voucher_id: '',
        customer_image: '',
        loc_lat: '',
        loc_long: '',
        signature: '',
        process_id: ''
    };

    $scope.new_good_receipt_search_object = {
        vehicle_search: function (query) {
            filters = {};
            fields = ['name', 'description'];
            return get_vehicle_live.live_feed(query, filters, fields);
        },
        customer_search: function (query) {
            filters = {};
            fields = ['name', 'description'];
            return get_customer_live.live_feed(query, filters, fields);
        },
        item_images_empty: images_link_empty,
        item_images_filled: images_link_filled,
        confirm_disable: false,
        take_signature_button_disable: false,
        take_signature_next_disable: false
    };

    $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);

    $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);


    // Log Out Event
    $scope.$on('log_out_event', function (event, args) {
        delete $scope.new_good_receipt;
        $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);
        delete $scope.new_good_receipt_search;
        $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);
    });


    // Read Data As URL
    me.read_data_url = function (path, file) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.readAsDataURL(path, file).then(function (success) {
                $scope.new_good_receipt.customer_image = success;
                $cordovaCamera.cleanup().then(); // only for FILE_URI
                $cordovaFile.removeFile(path, file);
                $scope.new_good_receipt_search.take_signature_next_disable = false;
                $state.transitionTo('main.good_receipt.take_picture_location');
            }, function (error) {
                if (typeof error == 'object')
                    error = JSON.stringify(error);
                console.error(error);
                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["Image jpg to Base64 Error", error]);
                $cordovaCamera.cleanup().then(); // only for FILE_URI
                $scope.new_good_receipt_search.take_signature_next_disable = false;
                t_send_error = {};
                t_send_error.NAME = "Image jpg to Base64 Error";
                t_send_error.DESCRIPTION = error;
                send_error_data.send_data(t_send_error, device);
                $state.transitionTo('main.good_receipt.take_picture_location');
            });
        });
    };

    // Check Dir Exists for saving images
    $scope.check_dir_exist = function (path, dirname) {
        return $cordovaFile.checkDir(path, dirname);
    };


    // Save Image Base64 to File
    $scope.save_img_to_file = function () {
        path = cordova.file.dataDirectory + "/proof_img/";
        file_name = 'gr_' + $scope.new_good_receipt.voucher_id;
        $cordovaFile.writeFile(path, file_name + '_customer_image.txt', $scope.new_good_receipt.customer_image, true)
            .then(function (success) {

                send_image.send($scope.new_good_receipt.voucher_id, $scope.new_good_receipt.customer_image, 'gr_' + $scope.new_good_receipt.voucher_id + '_customer_image.jpg', 'Goods Receipt', 'customer_image')
                    .success(function (data) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID, UPLOADED) VALUES(?, ?, 1)";
                        $cordovaSQLite.execute(db, query, [file_name + '_customer_image.txt', $scope.new_good_receipt.voucher_id]);
                    })
                    .error(function (error) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID) VALUES(?, ?)";
                        $cordovaSQLite.execute(db, query, [file_name + '_customer_image.txt', $scope.new_good_receipt.voucher_id]);
                        t_send_error = {};
                        t_send_error.NAME = "Error in sending Customer image";
                        t_send_error.DESCRIPTION = file_name + '_customer_image.txt ' + error;
                        send_error_data.send_data(t_send_error, device);
                    });

            }, function (error) {
                send_image.send($scope.new_good_receipt.voucher_id, $scope.new_good_receipt.customer_image, 'gr_' + $scope.new_good_receipt.voucher_id + '_customer_image.jpg', 'Goods Receipt', 'customer_image')
                    .success(function (data) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID, UPLOADED) VALUES(?, ?, 1)";
                        $cordovaSQLite.execute(db, query, ['NO FILE CREATED Customer Image ' + $scope.new_good_receipt.voucher_id, $scope.new_good_receipt.voucher_id]);
                    });
                if (typeof error == 'object')
                    error = JSON.stringify(error);
                console.log("1");
                console.error(error);
                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["Customer Image Not Stored " + $scope.new_good_receipt.voucher_id, error]);
                t_send_error = {};
                t_send_error.NAME = "Customer Image Not Stored";
                t_send_error.DESCRIPTION = $scope.new_good_receipt.voucher_id + ' ' + error;
                send_error_data.send_data(t_send_error, device);
                $cordovaToast.show("Collect Document Copy From Customer", 'long', 'bottom');
            });

        $cordovaFile.writeFile(path, file_name + '_signature.txt', canvas_signature.signature, true)
            .then(function (success) {
                send_image.send($scope.new_good_receipt.voucher_id, canvas_signature.signature, 'gr_' + $scope.new_good_receipt.voucher_id + '_signature.jpg', 'Goods Receipt', 'signature')
                    .success(function (data) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID, UPLOADED) VALUES(?, ?, 1)";
                        $cordovaSQLite.execute(db, query, [file_name + '_signature.txt', $scope.new_good_receipt.voucher_id]);
                    })
                    .error(function (error) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID) VALUES(?, ?)";
                        $cordovaSQLite.execute(db, query, [file_name + '_signature.txt', $scope.new_good_receipt.voucher_id]);
                        t_send_error = {};
                        t_send_error.NAME = "Error in sending Signature";
                        t_send_error.DESCRIPTION = file_name + '_signature.txt ' + error;
                        send_error_data.send_data(t_send_error, device);
                    });
            }, function (error) {
                send_image.send($scope.new_good_receipt.voucher_id, canvas_signature.signature, 'gr_' + $scope.new_good_receipt.voucher_id + '_signature.jpg', 'Goods Receipt', 'signature')
                    .success(function (data) {
                        var query = "INSERT INTO RECEIPT_FILES (FILE_NAME, PARENT_ID, UPLOADED) VALUES(?, ?, 1)";
                        $cordovaSQLite.execute(db, query, ['NO FILE CREATED Signature ' + $scope.new_good_receipt.voucher_id, $scope.new_good_receipt.voucher_id]);
                    });
                if (typeof error == 'object')
                    error = JSON.stringify(error);
                console.log("2");
                console.error(error);
                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["Customer Signature Not Stored " + $scope.new_good_receipt.voucher_id, error]);
                t_send_error = {};
                t_send_error.NAME = "Signarure Not Stored";
                t_send_error.DESCRIPTION = $scope.new_good_receipt.voucher_id + ' ' + error;
                send_error_data.send_data(t_send_error, device);
                $cordovaToast.show("Collect Document Copy From Customer", 'long', 'bottom');
            });

        $ionicHistory.clearHistory();
        $state.transitionTo('main.good_receipt.final');
    };


    // Create Good Receipt
    me.create_good_receipt = function () {
        $scope.new_good_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
        voucher_id = $scope.new_good_receipt.voucher_id.toString();
        final_data = {
            docstatus: 1,
            customer: $scope.new_good_receipt.customer_name.value,
            item_delivered: $scope.new_good_receipt.item_delievered_name,
            delivered_quantity: $scope.new_good_receipt.item_delievered_quantity,
            item_received: $scope.new_good_receipt.item_received_name,
            received_quantity: $scope.new_good_receipt.item_received_quantity,
            transaction_date: now_date,
            posting_date: now_date,
            posting_time: now_time,
            vehicle: $scope.new_good_receipt.vehicle_number.value,
            goods_receipt_number: voucher_id,
            customer_document_id: $scope.new_good_receipt.customer_document_id,
            location_latitude: $scope.new_good_receipt.loc_lat,
            location_longitude: $scope.new_good_receipt.loc_long,
            process_id: $scope.new_good_receipt.process_id
        };

        $scope.new_good_receipt.signature = canvas_signature.signature;

        create_new_good_receipt.create_feed(final_data)
            .success(function (data) {
                $scope.new_good_receipt.voucher_id = data.data.name;
                $scope.new_good_receipt_search.confirm_disable = false;

                var query = "INSERT INTO RECEIPT_DATA (ID, METADATA, VOUCHER_TYPE, UPLOADED) VALUES(?, ?, 'GR', 1)";
                $cordovaSQLite.execute(db, query, [$scope.new_good_receipt.voucher_id, JSON.stringify(final_data)]).then(
                    function (success) {
                        $cordovaFile.createDir(cordova.file.dataDirectory, "proof_img", false).then(
                            function (success) {
                                console.log("5");
                                console.error(success);
                                $scope.save_img_to_file();
                            },
                            function (error) {
                                console.log("3");
                                if (typeof error == 'object')
                                    error = JSON.stringify(error);
                                console.error(error);
                                $cordovaSQLite.execute(db, query, ["Can't Create Main Image Storage Dir", error]);
                                $scope.save_img_to_file();

                            });
                    });
            })
            .error(function (data) {
                $scope.new_good_receipt_search.confirm_disable = false;
                error = '';
                if (data._server_messages) {
                    error = JSON.parse(data._server_messages);
                    error = error[0];
                } else {
                    error = "Server Error";
                }

                if (typeof error == 'object')
                    error = JSON.stringify(error);
                $cordovaToast.show(error + " Contact to admin", 'long', 'bottom');
                track_event.track('Goods Receipt', "Error", error + " " + login_sid.name);

                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["GR Not Send", error]);

                t_send_error = {};
                t_send_error.NAME = "GR Not Send";
                t_send_error.DESCRIPTION = error;
                send_error_data.send_data(t_send_error, device);

                console.error(error);
            });
    };


    // Take Image from camera
    me.take_img = function () {
        document.addEventListener("deviceready", function () {

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                cameraDirection: Camera.Direction.FRONT
            };

            me.geo_location();

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                var image_path = imageURI.substring(0, imageURI.lastIndexOf('/') + 1);
                me.read_data_url(image_path, image_name);
            }, function (error) {
                if (typeof error == 'object')
                    error = JSON.stringify(error);
                $cordovaToast.show("Camera Not Working - " + error, 'short', 'bottom');
                track_event.track('Camera', "Error", "Camera Not Working " + login_sid.name);
                var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                $cordovaSQLite.execute(db, query, ["Camera Error", error]);
                $scope.new_good_receipt_search.take_signature_next_disable = false;
                console.error(error);

                t_send_error = {};
                t_send_error.NAME = "Camera Error";
                t_send_error.DESCRIPTION = error;
                send_error_data.send_data(t_send_error, device);

                if (error != "Camera cancelled.")
                    $state.transitionTo('main.good_receipt.take_picture_location');
            });
        }, false);
    };


    // Geo Location
    me.geo_location = function () {
        document.addEventListener('deviceready', function () {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.new_good_receipt.loc_lat = position.coords.latitude;
                    $scope.new_good_receipt.loc_long = position.coords.longitude;
                }, function (error) {
                    if (typeof error == 'object')
                        error = JSON.stringify(error);
                    track_event.track('Geolocation', "Error", "Location not taken " + login_sid.name);
                    console.error(error);
                    var query = "INSERT INTO ERROR_LOG (NAME, DESCRIPTION) VALUES(?, ?)";
                    $cordovaSQLite.execute(db, query, ["GPRS Error", error]);

                    t_send_error = {};
                    t_send_error.NAME = "GPRS Error";
                    t_send_error.DESCRIPTION = error;
                    send_error_data.send_data(t_send_error, device);
                });
        });
    };

    $scope.customer_name_next = function () {
        f = 1;
        if (!("value" in $scope.new_good_receipt.customer_name)) {
            $cordovaToast.show('Enter Customer Name', 'short', 'bottom');
            f = 0;
        } else if ($scope.new_good_receipt.voucher_id == '') {
            $cordovaToast.show('Enter Voucher ID', 'short', 'bottom');
            f = 0;
        } else if ($scope.new_good_receipt.vehicle_number == '') {
            $cordovaToast.show('Enter Vehicle Number', 'short', 'bottom');
            f = 0;
        }
        if (f == 1) {
            var d = new Date();
            $scope.new_good_receipt.process_id = $scope.new_good_receipt.customer_name + "#" + d.getTime();
            $scope.new_good_receipt.item_delievered_name = '';
            $scope.new_good_receipt.item_delievered_quantity = '';
            $scope.new_good_receipt.item_received_name = '';
            $scope.new_good_receipt.item_received_quantity = '';
            $state.transitionTo('main.good_receipt.item_delievered_name');
        }
    };

    $scope.item_delievered_name_empty_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_empty[index].id;
        $state.transitionTo('main.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_name_filled_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_filled[index].id;
        $state.transitionTo('main.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_name_skip = function () {
        $scope.new_good_receipt.item_delievered_name = '';
        $scope.new_good_receipt.item_delievered_quantity = '';
        $state.transitionTo('main.good_receipt.item_received_name');
    };

    $scope.item_delievered_quantity_next = function () {
        if ($scope.new_good_receipt.item_delievered_quantity == '')
            $cordovaToast.show('Enter Delievered Quantity', 'short', 'center');
        else
            $state.transitionTo('main.good_receipt.item_received_name');
    };

    $scope.item_received_name_empty_next = function (index) {
        $scope.new_good_receipt.item_received_name = $scope.new_good_receipt_search.item_images_empty[index].id;
        $state.transitionTo('main.good_receipt.item_received_quantity');
    };

    $scope.item_received_name_filled_next = function (index) {
        $scope.new_good_receipt.item_received_name = $scope.new_good_receipt_search.item_images_filled[index].id;
        $state.transitionTo('main.good_receipt.item_received_quantity');
    };

    $scope.item_received_name_skip = function () {
        $scope.new_good_receipt.item_received_name = '';
        $scope.new_good_receipt.item_received_quantity = '';
        $state.transitionTo('main.good_receipt.acknowledgement');
    };

    $scope.item_received_quantity_next = function () {
        if ($scope.new_good_receipt.item_received_quantity == '')
            $cordovaToast.show('Enter Received Quantity', 'short', 'center');
        else
            $state.transitionTo('main.good_receipt.acknowledgement');
    };

    $scope.take_signature_button = function () {
        $scope.new_good_receipt_search.take_signature_button_disable = true;
        html2canvas(document.getElementById('get_acknowledgement_information'), {
            onrendered: function (canvas) {
                canvas_signature.back_image = canvas.toDataURL();
                $scope.new_good_receipt_search.take_signature_button_disable = false;
                $rootScope.$emit('signature_canvas_clear', {});
                $state.transitionTo('main.good_receipt.take_signature');
            }
        });
    };

    $scope.take_signature_next = function () {
        canvas_signature.signature = canvas_signature.signature_pad.toDataURL('image/jpeg');
        $scope.new_good_receipt_search.take_signature_next_disable = true;
        me.take_img();
    };

    $scope.take_new_image = function () {
        me.take_img();
    };

    $scope.confirm_good_receipt = function () {
        me.create_good_receipt();
    };

    $scope.home = function () {
        $rootScope.$emit('receipt_to_db', {});
        $rootScope.$emit('signature_canvas_clear', {});
        delete $scope.new_good_receipt;
        $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);
        delete $scope.new_good_receipt_search;
        $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);
        track_event.track('Goods Receipt', 'Confirmed', final_data.id + " " + login_sid.name);
        $state.transitionTo('main.select_receipt');
    };
});



// Signature Pad Controller

ionic_app.controller('take_signature_controller', function ($scope, $rootScope, canvas_signature) {
    if (typeof analytics !== "undefined") {
        analytics.trackView("Take Signature");
    }

    document.getElementById("signature_canvas_div").innerHTML = "<canvas id='signatureCanvas' style='border: 1px solid black;'></canvas>";
    var canvas = document.getElementById('signatureCanvas'),
        ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 170;
    var background = new Image();
    background.src = canvas_signature.back_image;

    background.onload = function () {
        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    };

    canvas_signature.signature_pad = new SignaturePad(canvas);

    $scope.clear_canvas = function () {
        canvas_signature.signature_pad.clear();
        background.src = canvas_signature.back_image;
    };

    $rootScope.$on('signature_canvas_clear', function () {
        $scope.clear_canvas();
    });
});