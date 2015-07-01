ionic_app.controller('good_receipt_controller', function ($scope, $state, $cordovaToast, get_customer_live, images_link_empty, images_link_filled, get_vehicle_live, create_new_good_receipt, canvas_signature) {
    var me = this;

    $scope.new_good_receipt_object = {
        customer_name: {},
        item_delievered_name: '',
        item_delievered_quantity: '',
        item_received_name: '',
        item_received_quantity: '',
        done: false,
        time_stamp: '',
        vehicle_number: '',
        customer_document_id: '',
        voucher_id: '',
        signature_data: ''
    };

    $scope.new_good_receipt = angular.copy($scope.new_good_receipt_object);

    $scope.new_good_receipt_search = {
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
        confirm_disable: false
    };


    // Create Good Receipt
    me.create_good_receipt = function () {
        $scope.new_good_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
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
            goods_receipt_number: $scope.new_good_receipt.voucher_id,
            signature_data: canvas_signature.signature
        };
        create_new_good_receipt.create_feed(data)
            .success(function (data) {
                $scope.new_good_receipt_search.confirm_disable = false;
                delete $scope.new_good_receipt;
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                message = JSON.parse(data._server_messages);
                $scope.new_good_receipt_search.confirm_disable = false;
                $cordovaToast.show(message[0], 'short', 'bottom');
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
        html2canvas(document.getElementById('asd_asd'), {
            onrendered: function (canvas) {
                canvas_signature.back_image = canvas.toDataURL({
                    format: 'png',
                    quality: 0.7
                });
                $state.transitionTo('main.good_receipt.take_signature');
            }
        });
    };

    $scope.confirm_good_receipt = function () {
        canvas_signature.signature = canvas_signature.signature_pad.toDataURL();
        me.create_good_receipt();
    };
});



// Signature Pad Controller

ionic_app.controller('take_signature_controller', function ($scope, canvas_signature) {

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