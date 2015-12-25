ionic_app.controller('show_db_controller', function ($scope, $state, $cordovaSQLite, $cordovaToast) {

    $scope.db_data = {};
    $scope.db_data.GRS = [];
    $scope.db_data.PRS = [];
    $scope.db_data.ERRS = []

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



    var query = 'SELECT * FROM ERROR_LOG';
    $cordovaSQLite.execute(db, query).then(function (result) {
        var temp = {}
        t_len = result.rows.length;
        for (i = 0; i < t_len; i++) {
            temp.NAME = result.rows.item(i).NAME;
            temp.DESCRIPTION = result.rows.item(i).DESCRIPTION;
            $scope.db_data.ERRS.push(temp);
        }

    }, function (err) {
        $cordovaToast.show("Error in Error Log Fetch", 'short', 'bottom');
        console.error(err);
    });


});