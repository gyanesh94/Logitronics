ionic_app.controller('good_receipt_controller', function ($scope, $state, getFeedMockAccount, images_link) {
    $scope.new_good_receipt = {
        customer_name: {},
        item_delievered_name: '',
        item_delievered_quantity: '',
        item_received_name: '',
        item_received_qty: '',
        done: '',
        time_stamp: ''
    };
    $scope.new_good_receipt_search = {
        search: '',
        customer_search: function (query) {
            return getFeedMockAccount.getFeed();
        },
        item_images: images_link,
        customer_list: [1,3,5,67,8,]
    };
});