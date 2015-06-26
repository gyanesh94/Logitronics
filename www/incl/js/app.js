// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var ionic_app = angular.module('home', ['ionic', 'ngMaterial', 'ion-autocomplete', 'pascalprecht.translate']);

ionic_app.run(function ($ionicPlatform, $state) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        $state.go('main.login');
    });
});

ionic_app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main/login');

    $stateProvider.state('main', {
            url: '/main',
            abstract: true,
            views: {
                'main_view': {
                    templateUrl: 'comp/main/main.html',
                    controller: 'main_controller'
                }
            }
        })
        .state('main.login', {
            url: '/login',
            views: {
                'content_view': {
                    templateUrl: 'comp/login/login.html',
                    controller: 'login_controller'
                }
            }
        })
        .state('main.select_receipt', {
            url: '/select_receipt',
            views: {
                'content_view': {
                    templateUrl: 'comp/select_receipt/select_receipt.html',
                    controller: 'select_receipt_controller'
                }
            }
        })
        .state('main.good_receipt', {
            url: '/good_receipt',
            abstract: true,
            views: {
                'content_view': {
                    templateUrl: 'comp/good_receipt/good_receipt.html',
                    controller: 'good_receipt_controller'
                }
            }
        })
        .state('main.good_receipt.customer_name', {
            url: '/customer_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/customer_name.html'
                }
            }
        })
        .state('main.good_receipt.item_delievered_name', {
            url: '/item_delievered_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/item_delievered_name.html'
                }
            }
        })
        .state('main.good_receipt.item_delievered_quantity', {
            url: '/item_delievered_quantity',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/item_delievered_quantity.html'
                }
            }
        })
        .state('main.good_receipt.item_received_name', {
            url: '/item_received_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/item_received_name.html'
                }
            }
        })
        .state('main.good_receipt.item_received_quantity', {
            url: '/item_received_quantity',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/item_received_quantity.html'
                }
            }
        })
        .state('main.good_receipt.acknowledgement', {
            url: '/acknowledgement',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/acknowledgement.html'
                }
            }
        })
        .state('main.payment_receipt', {
            url: '/payment_receipt',
            abstract: true,
            views: {
                'content_view': {
                    templateUrl: 'comp/payment_receipt/payment_receipt.html',
                    controller: 'payment_receipt_controller'
                }
            }
        })
        .state('main.payment_receipt.payment_receipt_information', {
            url: '/payment_receipt_information',
            views: {
                'payment_receipt_content_view': {
                    templateUrl: 'comp/payment_receipt/form/payment_receipt_information.html'
                }
            }
        })
        .state('main.payment_receipt.payment_receipt_acknowledgement', {
            url: '/payment_receipt_acknowledgement',
            views: {
                'payment_receipt_content_view': {
                    templateUrl: 'comp/payment_receipt/form/payment_receipt_acknowledgement.html'
                }
            }
        });
});


ionic_app.constant('images_link_empty', [
    {
        img_url: 'incl/img/ionic.png',
        id: '1'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '2'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '3'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '4'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '5'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '6'
    }
]);

ionic_app.constant('images_link_filled', [
    {
        img_url: 'incl/img/ionic.png',
        id: '1'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '2'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '3'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '4'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '5'
    }, {
        img_url: 'incl/img/ionic.png',
        id: '6'
    }
]);



// Angular Translate

ionic_app.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        LOGIN: 'Login',
        USERNAME: 'Username',
        PASSWORD: 'Password',
        SELECT_RECEIPT: 'Select Receipt',
        LOG_OUT: 'Log Out',
        GOOD_RECEIPT: 'Good Receipt',
        PAYMENT_RECEIPT: 'Payment Receipt',
        ACKNOWLEDGEMENT: 'Acknowledgement',
        GOOD_RECEIPT_DETAILS: 'Good Receipt Details',
        CUSTOMER_NAME: 'Customer Name',
        ITEM_DELIEVERED_NAME: 'Item Delievered Name',
        ITEM_DELIEVERED_QUANTITY: 'Item Delievered Quantity',
        ITEM_RECEIVED_NAME: 'Item Received Name',
        ITEM_RECEIVED_QUANTITY: 'Item Received Quantity',
        VEHICLE_NUMBER: 'Vehicle Number',
        CUSTOMER_DOCUMENT_ID: 'Customer Document Id',
        TAKE_SIGNATURE: 'Take Signature',
        CONFIRM: 'Confirm',
        NEXT: 'Next',
        EMPTY: 'Empty',
        FILLED: 'Filled',
        QUANTITY: 'Quantity',
        PAYMENT_RECEIPT_INFORMATION: 'Payment Receipt Information',
        AMOUNT_PER_ITEM: 'Amount Per Item',
        PAYMENT_RECEIPT_ACKNOWLEDGEMENT: 'Payment Receipt Acknowledgement',
        PAYMENT_RECEIPT_DETAILS: 'Payment Receipt Details'
    });

    $translateProvider.translations('hi', {
        LOGIN: 'लॉग इन',
        USERNAME: 'यूजर का नाम',
        PASSWORD: 'पासवर्ड',
        SELECT_RECEIPT: 'चयन करें रसीद',
        LOG_OUT: 'Log Out',
        GOOD_RECEIPT: 'Good Receipt',
        PAYMENT_RECEIPT: 'Payment Receipt',
        ACKNOWLEDGEMENT: 'Acknowledgement',
        GOOD_RECEIPT_DETAILS: 'Good Receipt Details',
        CUSTOMER_NAME: 'Customer Name',
        ITEM_DELIEVERED_NAME: 'Item Delievered Name',
        ITEM_DELIEVERED_QUANTITY: 'Item Delievered Quantity',
        ITEM_RECEIVED_NAME: 'Item Received Name',
        ITEM_RECEIVED_QUANTITY: 'Item Received Quantity',
        VEHICLE_NUMBER: 'Vehicle Number',
        CUSTOMER_DOCUMENT_ID: 'Customer Document Id',
        TAKE_SIGNATURE: 'Take Signature',
        CONFIRM: 'Confirm',
        NEXT: 'Next',
        EMPTY: 'Empty',
        FILLED: 'Filled',
        QUANTITY: 'Quantity',
        PAYMENT_RECEIPT_INFORMATION: 'Payment Receipt Information',
        AMOUNT_PER_ITEM: 'Amount Per Item',
        PAYMENT_RECEIPT_ACKNOWLEDGEMENT: 'Payment Receipt Acknowledgement',
        PAYMENT_RECEIPT_DETAILS: 'Payment Receipt Details'
    });

    $translateProvider.preferredLanguage('en');
});