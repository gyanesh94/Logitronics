ionic_app.controller('good_receipt_controller', function ($scope, $rootScope, $state, $cordovaToast, $cordovaCamera, $cordovaFile, $cordovaGeolocation, get_customer_live, images_link_empty, images_link_filled, get_vehicle_live, create_new_good_receipt, canvas_signature, send_image) {
    var me = this;

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
        customer_image: {},
        loc_lat: '',
        loc_long: ''
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
        customer_image: '',
        take_signature_button_disable: false
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
                $scope.new_good_receipt_search.customer_image = success;
            }, function (error) {
                console.log(error);
            });
        });
    };


    // Create Good Receipt
    me.create_good_receipt = function () {
        $scope.new_good_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
        voucher_id = $scope.new_good_receipt.voucher_id.toString();
        data = {
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
            location_longitude: $scope.new_good_receipt.loc_long
        };
        create_new_good_receipt.create_feed(data)
            .success(function (data) {
                $scope.new_good_receipt_search.confirm_disable = false;
                send_image.send(voucher_id, $scope.new_good_receipt_search.customer_image, 'gr_' + voucher_id + '_customer_image.jpg', 'Goods Receipt', 'customer_image').success(function (data) {
                    $scope.new_good_receipt_search.customer_image = "";
                    $scope.new_good_receipt.customer_image = {};
                });
                send_image.send(voucher_id, canvas_signature.signature, 'gr_' + voucher_id + '_signature.jpg', 'Goods Receipt', 'signature').success(function (data) {});
                delete $scope.new_good_receipt;
                $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);
                delete $scope.new_good_receipt_search;
                $scope.new_good_receipt_search = angular.copy($scope.new_good_receipt_search_object);
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                if (data._server_messages)
                    message = JSON.parse(data._server_messages);
                else
                    message = "Server Error";
                $scope.new_good_receipt_search.confirm_disable = false;
                $cordovaToast.show(message[0], 'short', 'bottom');
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

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                var image_name = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                $scope.new_good_receipt.customer_image = {
                    path: cordova.file.dataDirectory,
                    name: image_name
                };
                me.file_move(image_name);
                $cordovaCamera.cleanup().then(); // only for FILE_URI
            }, function (err) {
                console.log(err);
            });
        }, false);
    };


    // Move File from one location to other
    me.file_move = function (file_name) {
        document.addEventListener('deviceready', function () {
            $cordovaFile.moveFile(cordova.file.externalCacheDirectory, file_name, cordova.file.dataDirectory)
                .then(function (success) {
                    me.read_data_url(cordova.file.dataDirectory, file_name);
                    me.geo_location();
                }, function (error) {
                    console.log(error);
                });
        });
    };


    // Geo Location
    me.geo_location = function () {
        document.addEventListener('deviceready', function () {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: true
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    $scope.new_good_receipt.loc_lat = position.coords.latitude;
                    $scope.new_good_receipt.loc_long = position.coords.longitude;
                    $state.transitionTo('main.good_receipt.take_picture_location');
                }, function (err) {
                    console.log(err);
                });
        });
    };

    $scope.customer_name_next = function () {
        $state.transitionTo('main.good_receipt.item_delievered_name');
    };

    $scope.item_delievered_name_empty_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_empty[index].id;
        $state.transitionTo('main.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_name_filled_next = function (index) {
        $scope.new_good_receipt.item_delievered_name = $scope.new_good_receipt_search.item_images_filled[index].id;
        $state.transitionTo('main.good_receipt.item_delievered_quantity');
    };

    $scope.item_delievered_quantity_next = function () {
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

    $scope.item_received_quantity_next = function () {
        $state.transitionTo('main.good_receipt.acknowledgement');
    };

    $scope.take_signature_button = function () {
        $scope.new_good_receipt_search.take_signature_button_disable = true;
        html2canvas(document.getElementById('get_acknowledgement_information'), {
            onrendered: function (canvas) {
                canvas_signature.back_image = canvas.toDataURL();
                $scope.new_good_receipt_search.take_signature_button_disable = false;
                $state.transitionTo('main.good_receipt.take_signature');
            }
        });
    };

    $scope.take_signature_next = function () {
        canvas_signature.signature = canvas_signature.signature_pad.toDataURL('image/jpeg');
        me.take_img();
    };

    $scope.take_new_image = function () {
        $cordovaFile.removeFile(cordova.file.dataDirectory, $scope.new_good_receipt.customer_image.name)
        me.take_img();
    };

    $scope.confirm_good_receipt = function () {
        me.create_good_receipt();
    };
});



// Signature Pad Controller

ionic_app.controller('take_signature_controller', function ($scope, canvas_signature) {
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
});