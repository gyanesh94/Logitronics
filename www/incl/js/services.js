// Switch Preffered Language

ionic_app.service('switch_preffered_language', ['$translate', function($translate){
    this.translate_language = function (preferred_language) {
        $translate.use(preferred_language);
    };
}]);


// Get Customer Accounts from API

ionic_app.service('getCustomerLive', ['$http', '$q', function ($http, $q) {
    this.liveFeed = function (search, company) {
        filters = {};
        filters.group_or_ledger = "Ledger";
        filters.company = company;
        var snd = {
            txt: search,
            doctype: 'Account',
            filters: JSON.stringify(filters),
            cmd: 'frappe.widgets.search.search_link',
            _type: 'POST'
        };

        var promise = $q.defer();

        $http.post(serverBaseUrl, $.param(snd)).success(function (data) {
            promise.resolve(data.results);
        });

        return promise.promise;
    };
}]);


ionic_app.service('getFeedMockAccount', ['$http', '$q', function ($http, $q) {
    this.getFeed = function () {
        var feed = {
            "results": [
                {
                    "description": "Ledger",
                    "value": "A K Multimetals Pvt. LTD - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A L COLD FORGE PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A P ORGANICS PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A R CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A S CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A.P. AUTO INDUSTRIES - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AAR AAR INDUSTRY - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. AFD II - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC  - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL ROLLING MILLS - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STRIPS PVT. LTD. - AL"
    }
  ]
        };
        var promise = $q.defer();
        promise.resolve(feed['results']);
        return promise.promise;

    };
}]);


ionic_app.service('getFeedMockVehicle', ['$http', '$q', function ($http, $q) {
    this.getFeed = function () {
        var feed = {
            "results": [
                {
                    "description": "Ledger",
                    "value": "A K Multimetals Pvt. LTD - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A L COLD FORGE PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A P ORGANICS PVT. LTD. - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A R CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A S CATERING HOUSE - AL"
    },
                {
                    "description": "Ledger",
                    "value": "A.P. AUTO INDUSTRIES - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AAR AAR INDUSTRY - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. AFD II - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC  - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL LTD. ARC - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STEEL ROLLING MILLS - AL"
    },
                {
                    "description": "Ledger",
                    "value": "AARTI STRIPS PVT. LTD. - AL"
    }
  ]
        };
        var promise = $q.defer();
        promise.resolve(feed['results']);
        return promise.promise;

    };
}]);