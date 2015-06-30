ionic_app.controller('payment_receipt_controller', function ($scope, $state, $cordovaToast, get_stock_owner, create_new_payment_receipt) {
    var me = this;

    $scope.new_payment_receipt = {
        quantity: '',
        amount_per_item: '',
        stock_owner: {},
        voucher_id: '',
        transaction_type: 'Refill',
        item: 'FC19'
    };

    $scope.new_payment_receipt_search = {
        stock_owner_search: function (query) {
            filters = {};
            fields = ['name', 'description'];
            return get_stock_owner.live_feed(query, filters, fields);
        },
        confirm_disable: false
    };


    // Create Payment Receipt
    me.create_payment_receipt = function () {
        $scope.new_payment_receipt_search.confirm_disable = true;
        now_date = moment().format("YYYY-MM-DD");
        now_time = moment().format("HH:mm:ss");
        qty = $scope.new_payment_receipt.quantity;
        amt_per_item = $scope.new_payment_receipt.amount_per_item;
        total = qty * amt_per_item;
        data = {
            stock_owner: $scope.new_payment_receipt.stock_owner.value,
            qty: qty,
            docstatus: 1,
            transaction_type: $scope.new_payment_receipt.transaction_type,
            id: $scope.new_payment_receipt.voucher_id.toString(),
            stock_owner: $scope.new_payment_receipt.stock_owner.value,
            qty: qty,
            amount_per_item: amt_per_item,
            total: total,
            company: "VK Logistics",
            stock_date: now_date,
            posting_date: now_date,
            posting_time: now_time,
            fiscal_year: "2015-16",
            item: $scope.new_payment_receipt.item
        }
        create_new_payment_receipt.create_feed(data)
            .success(function (data) {
                $scope.new_payment_receipt_search.confirm_disable = false;
                $state.transitionTo('main.select_receipt');
            })
            .error(function (data) {
                message = JSON.parse(data._server_messages);
                $scope.new_payment_receipt_search.confirm_disable = false;
                $cordovaToast.show(message[0], 'short', 'bottom');
            });
    };

    $scope.payment_receipt_next = function () {
        $state.transitionTo('main.payment_receipt.payment_receipt_acknowledgement');
    };

    $scope.payment_receipt_acknowledgement = function () {
        me.create_payment_receipt();
    }
});