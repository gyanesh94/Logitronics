ionic_app.controller('payment_receipt_controller', function ($scope, $state) {

    $scope.new_payment_receipt = {
        quantity: '',
        amount_per_item: ''
    };

    $scope.payment_receipt_next = function () {
        $state.transitionTo('main.payment_receipt.payment_receipt_acknowledgement');
    };
    
    $scope.payment_receipt_acknowledgement = function () {
        $state.transitionTo('main.select_receipt');
    };
});