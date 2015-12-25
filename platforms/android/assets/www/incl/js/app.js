// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var ionic_app = angular.module('home', ['ionic', 'ngMaterial', 'ionic.service.core', 'ionic.service.deploy', 'ion-autocomplete', 'pascalprecht.translate', 'ngCordova']);

var db = null;

ionic_app.run(function ($ionicPlatform, $state, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // Google Analytics
        if (typeof analytics !== undefined) {
            analytics.startTrackerWithId("UA-64798388-1");
            analytics.debugMode();
            console.log("Google Analytics Deployed");
        } else {
            console.log("Google Analytics Unavailable");
        }


        // Sqlite DB Check
        db = $cordovaSQLite.openDB("my.db");

        var query = "CREATE TABLE IF NOT EXISTS RECEIPT_DATA (ID INTEGER PRIMARY KEY, METADATA TEXT, VOUCHER_TYPE TEXT, UPLOADED INTEGER DEFAULT 0)";
        $cordovaSQLite.execute(db, query, []).then(function (res) {
            console.log("Receipt_Data Table Created");
        }, function (err) {
            console.error(err);
        });
        var query = "CREATE TABLE IF NOT EXISTS RECEIPT_FILES (FILE_NAME TEXT, PARENT_ID INTEGER, UPLOADED INTEGER DEFAULT 0, FOREIGN KEY (PARENT_ID) REFERENCES RECEIPT_DATA(ID))";
        $cordovaSQLite.execute(db, query, []).then(function (res) {
            console.log("Receipt_Files Table Created");
        }, function (err) {
            console.error(err);
        });
        var query = "CREATE TABLE IF NOT EXISTS ERROR_LOG (NAME TEXT, DESCRIPTION TEXT)";
        $cordovaSQLite.execute(db, query, []).then(function (res) {
            console.log("Error_Log Table Created");
        }, function (err) {
            console.error(err);
        });

        $state.go('main.login');
    });
});

ionic_app.config(function ($stateProvider, $urlRouterProvider) {

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
            },
            resolve: {
                resA: function ($cordovaFile, $q, app_settings) {
                    var promise = $q.defer();
                    document.addEventListener('deviceready', function () {
                        $cordovaFile.checkFile(cordova.file.dataDirectory, "app_settings.txt")
                            .then(function (success) {
                                $cordovaFile.readAsText(cordova.file.dataDirectory, "app_settings.txt")
                                    .then(function (success) {
                                        var data = JSON.parse(success);
                                        $.each(data, function (key, value) {
                                            app_settings[key] = value;
                                        });
                                        promise.resolve();
                                    }, function (error) {
                                        console.log("Read As Text Error");
                                        console.log(error);
                                        promise.resolve();
                                    });
                            }, function (error) {
                                console.log("Check File Error");
                                console.log(error);
                                promise.resolve();
                            });
                    });
                    return promise.promise;
                },
                resB: function ($cordovaFile, $q, $state, login_sid) {
                    var promise = $q.defer();
                    document.addEventListener('deviceready', function () {
                        $cordovaFile.checkFile(cordova.file.dataDirectory, "sid.txt")
                            .then(function (success) {
                                $cordovaFile.readAsText(cordova.file.dataDirectory, "sid.txt")
                                    .then(function (success) {
                                        var data = JSON.parse(success);
                                        $.each(data, function (key, value) {
                                            login_sid[key] = value;
                                        });
                                        if (typeof analytics !== "undefined") {
                                            analytics.setUserId(login_sid.name);
                                        }
                                        promise.resolve();
                                        $state.go('main.select_receipt');
                                    }, function (error) {
                                        console.log("Read As Text Error");
                                        console.log(error);
                                        promise.resolve();
                                    });
                            }, function (error) {
                                console.log("Check SID File Error");
                                console.log(error);
                                promise.resolve();
                            });
                    });
                    return promise.promise;
                }
            }
        })
        .state('main.show_db', {
            url: '/show_db',
            views: {
                'content_view': {
                    templateUrl: 'comp/show_db/show_db.html',
                    controller: 'show_db_controller'
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
        .state('main.good_receipt.take_signature', {
            url: '/take_signature',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/take_signature.html',
                    controller: 'take_signature_controller'
                }
            }
        })
        .state('main.good_receipt.take_picture_location', {
            url: '/take_signature',
            views: {
                'good_receipt_content_view': {
                    templateUrl: 'comp/good_receipt/form/take_picture_location.html'
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


// Ionic App Deploy
ionic_app.config(['$ionicAppProvider', function ($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
        // The App ID (from apps.ionic.io) for the server
        app_id: 'a3f534c8',
        // The public API key all services will use for this app
        api_key: 'a967e07802022c1a7df978b819f9e76e431c560c5f2603d5'
    });
}])


ionic_app.constant('images_link_empty', [
    {
        img_url: 'incl/img/ec19.jpg',
        id: 'EC19',
        name: 'EC19'
    }, {
        img_url: 'incl/img/ec35.jpg',
        id: 'EC35',
        name: 'EC35'
    }, {
        img_url: 'incl/img/ec475vot.jpg',
        id: 'EC47.5',
        name: 'EC47.5'
    }, {
        img_url: 'incl/img/ionic.png',
        id: 'EC47.5L',
        name: 'EC47.5LOT'
    }
]);

ionic_app.constant('images_link_filled', [
    {
        img_url: 'incl/img/fc19.jpg',
        id: 'FC19',
        name: 'FC19'
    }, {
        img_url: 'incl/img/fc35.jpg',
        id: 'FC35',
        name: 'FC35'
    }, {
        img_url: 'incl/img/fc475vot.jpg',
        id: 'FC47.5',
        name: 'FC47.5'
    }, {
        img_url: 'incl/img/ionic.png',
        id: 'FC47.5L',
        name: 'FC47.5LOT'
    }
]);


// Signature
ionic_app.value('canvas_signature', {
    back_image: '',
    signature: '',
    signature_pad: ''
});


// File Settings
ionic_app.value('app_settings', {
    server_base_url: 'http://192.168.1.10:8080'
});

// Login Session ID
ionic_app.value('login_sid', {
    sid: '',
    name: ''
});


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
        ITEM_DELIEVERED_NAME: 'Item Delivered Name',
        ITEM_DELIEVERED_QUANTITY: 'Item Delivered Quantity',
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
        PAYMENT_RECEIPT_DETAILS: 'Payment Receipt Details',
        SIGNATURE: 'Signature',
        SAVE: 'Save',
        CLEAR: 'Clear',
        STOCK_OWNER: 'Stock Owner',
        VOUCHER_ID: 'Voucher ID',
        TRANSACTION_TYPE: 'Transaction Type',
        TV_OUT: 'TV Out',
        REFILL: 'Refill',
        NEW_CONNECTION: 'New Connection',
        ITEM: 'Item',
        TAKE_NEW_IMAGE: 'Take New Image',
        SKIP: 'Skip',
        DETAILS: 'Details'
    });

    $translateProvider.translations('hi', {
        LOGIN: 'लॉग इन',
        USERNAME: 'यूजर का नाम',
        PASSWORD: 'पासवर्ड',
        SELECT_RECEIPT: 'चयन करें रसीद',
        LOG_OUT: 'लॉग आउट',
        GOOD_RECEIPT: 'चालान',
        PAYMENT_RECEIPT: 'भुगतान रसीद',
        ACKNOWLEDGEMENT: 'प्राप्ति सूचना',
        GOOD_RECEIPT_DETAILS: 'चालान विवरण',
        CUSTOMER_NAME: 'ग्राहक का नाम',
        ITEM_DELIEVERED_NAME: 'आइटम वितरित नाम',
        ITEM_DELIEVERED_QUANTITY: 'आइटम वितरित मात्रा',
        ITEM_RECEIVED_NAME: 'आइटम प्राप्त नाम',
        ITEM_RECEIVED_QUANTITY: 'आइटम प्राप्त मात्रा',
        VEHICLE_NUMBER: 'वाहन संख्या',
        CUSTOMER_DOCUMENT_ID: 'ग्राहक दस्तावेज़ ID',
        TAKE_SIGNATURE: 'हस्ताक्षर लें',
        CONFIRM: 'पुष्टि करें',
        NEXT: 'अगला',
        EMPTY: 'खाली',
        FILLED: 'भरा हुआ',
        QUANTITY: 'मात्रा',
        PAYMENT_RECEIPT_INFORMATION: 'भुगतान रसीद सूचना',
        AMOUNT_PER_ITEM: 'आइटम प्रति राशि',
        PAYMENT_RECEIPT_ACKNOWLEDGEMENT: 'भुगतान रसीद पावती',
        PAYMENT_RECEIPT_DETAILS: 'भुगतान रसीद विवरण',
        SIGNATURE: 'हस्ताक्षर',
        SAVE: 'सहेजें',
        CLEAR: 'साफ़ करें',
        STOCK_OWNER: 'विक्रेता',
        VOUCHER_ID: 'वाउचर आईडी',
        TRANSACTION_TYPE: 'सौदे का प्रकार',
        TV_OUT: 'टीवी आउट',
        REFILL: 'रिफिल',
        NEW_CONNECTION: 'नया कनेक्शन',
        ITEM: 'आइटम',
        TAKE_NEW_IMAGE: 'नई छवि ले',
        SKIP: 'स्किप',
        DETAILS: 'विवरण'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
});