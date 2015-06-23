// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var ionic_app = angular.module('home', ['ionic','ngMaterial']);

ionic_app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

ionic_app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/main/login');

    $stateProvider.state('main', {
            url: '/main',
            abstract: true,
            views: {
                'main_view': {
                    templateUrl: '/comp/main/main.html',
                    controller: 'main_controller'
                }
            }
        })
        .state('main.login', {
            url: '/login',
            views: {
                'content_view': {
                    templateUrl: '/comp/login/login.html',
                    controller: 'login_controller'
                }
            }
        })
        .state('main.select_receipt', {
            url: '/select_receipt',
            views: {
                'content_view': {
                    templateUrl: '/comp/select_receipt/select_receipt.html',
                    controller: 'select_receipt_controller'
                }
            }
        })
        .state('main.good_receipt', {
            url: '/good_receipt',
            abstract: true,
            views: {
                'content_view': {
                    templateUrl: '/comp/good_receipt/good_receipt.html',
                    controller: 'good_receipt_controller'
                }
            }
        })
        .state('main.good_receipt.customer_name', {
            url: '/customer_name',
            views: {
                'good_receipt_content_view': {
                    templateUrl: '/comp/good_receipt/form/customer_name.html'
                }
            }
        })
        .state('main.payment_receipt', {
            url: '/payment_receipt',
            views: {
                'content_view': {
                    templateUrl: '/comp/payment_receipt/payment_receipt.html',
                    controller: 'payment_receipt_controller'
                }
            }
        });
});


ionic_app.constant('images_link', {
    img1: 'incl/img/ionic.png',
    img2: 'incl/img/ionic.png',
    img3: 'incl/img/ionic.png',
    img4: 'incl/img/ionic.png',
    img5: 'incl/img/ionic.png',
    img6: 'incl/img/ionic.png',
    img7: 'incl/img/ionic.png',
    img8: 'incl/img/ionic.png',
    img9: 'incl/img/ionic.png',
    img10: 'incl/img/ionic.png',
    img11: 'incl/img/ionic.png',
    img12: 'incl/img/ionic.png'
});