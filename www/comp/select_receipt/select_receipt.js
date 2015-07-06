ionic_app.controller('select_receipt_controller', function ($scope, $state, $ionicHistory) {

    $ionicHistory.clearHistory();
    
    if (typeof analytics !== "undefined") {
        analytics.trackView("Select Receipt View");
    }
    
    $scope.good_receipt_form = function () {
        $state.transitionTo('main.good_receipt.customer_name');
    };

    $scope.payment_receipt_form = function () {
        $state.transitionTo('main.payment_receipt.payment_receipt_information');
    };
});