ionic_app.controller('good_receipt_controller', function ($scope, $state, getFeedMockAccount, images_link_empty, images_link_filled, getFeedMockVehicle) {

    $scope.new_good_receipt = {
        customer_name: {},
        item_delievered_name: '',
        item_delievered_quantity: '',
        item_received_name: '',
        item_received_quantity: '',
        done: false,
        time_stamp: '',
        vehicle_number: '',
        customer_document_id: ''
    };

    $scope.new_good_receipt_search = {
        vehicle_search: function (query) {
            return getFeedMockVehicle.getFeed();
        },
        customer_search: function (query) {
            return getFeedMockAccount.getFeed();
        },
        item_images_empty: images_link_empty,
        item_images_filled: images_link_filled
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

    $scope.confirm_good_receipt = function () {
        $state.transitionTo('main.select_receipt');
    };
});