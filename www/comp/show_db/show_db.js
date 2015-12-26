ionic_app.controller('show_db_controller', function ($scope, $state, $cordovaSQLite, $cordovaToast, $rootScope) {

    $scope.db_to_home = function () {
        $state.transitionTo('main.select_receipt');
    };


    $scope.db_data = {};
    $scope.db_data.GRS = [];
    $scope.db_data.PRS = [];
    $scope.db_data.ERRS = []
    $scope.db_data.FILES = [];

    $rootScope.$on('db_update', function (event, args) {
        $scope.db_update();
    });


    $scope.db_update = function () {
        $scope.db_data.GRS = [];
        $scope.db_data.PRS = [];
        $scope.db_data.ERRS = []
        $scope.db_data.FILES = [];

        var query = 'SELECT * FROM RECEIPT_DATA';

        $cordovaSQLite.execute(db, query).then(function (result) {
            t_len = result.rows.length;
            for (i = 0; i < t_len; i++) {
                var temp = {};
                temp.ID = result.rows.item(i).ID;
                str = result.rows.item(i).METADATA;
                temp.METADATA = JSON.parse(str);
                if (result.rows.item(i).UPLOADED == 0)
                    temp.UPLOAD = "False";
                else
                    temp.UPLOAD = "True";
                if (result.rows.item(i).VOUCHER_TYPE == "PR") {
                    $scope.db_data.PRS.push(temp);
                }
                if (result.rows.item(i).VOUCHER_TYPE == "GR") {
                    $scope.db_data.GRS.push(temp);
                }
            }
        }, function (err) {
            $cordovaToast.show("Error in Receipt Data Fetch", 'short', 'bottom');
            console.error(err);
        });


        var query = 'SELECT * FROM RECEIPT_FILES';
        $cordovaSQLite.execute(db, query).then(function (result) {
            t_len = result.rows.length;
            for (i = 0; i < t_len; i++) {
                var temp = {};
                temp.FILE_NAME = result.rows.item(i).FILE_NAME;
                if (result.rows.item(i).UPLOADED == 0)
                    temp.UPLOAD = "False";
                else
                    temp.UPLOAD = "True";
                $scope.db_data.FILES.push(temp);
            }
        }, function (err) {
            $cordovaToast.show("Error in Receipt Files Fetch", 'short', 'bottom');
            console.error(err);
        });


        var query = 'SELECT * FROM ERROR_LOG';
        $cordovaSQLite.execute(db, query).then(function (result) {
            t_len = result.rows.length;
            for (i = 0; i < t_len; i++) {
                var temp = {};
                temp.NAME = result.rows.item(i).NAME;
                //            temp.DESCRIPTION = result.rows.item(i).DESCRIPTION;
                temp.DESCRIPTION = result.rows.item(i).DESCRIPTION;
                //            temp.DESCRIPTION = JSON.parse(str);
                $scope.db_data.ERRS.push(temp);
                console.error(temp);
            }

        }, function (err) {
            $cordovaToast.show("Error in Error Log Fetch", 'short', 'bottom');
            console.error(err);
        });
        $state.transitionTo('main.select_receipt');
    };


});