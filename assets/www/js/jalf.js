// jalf.js - Javascript API to JALF web services
// Copyright Realisation Tremar, 2013
//
// Require:
//   - jQuery 1.10
//

jalf = {
    VERSION: 0.2
};

jalf.login = function(server_uri, user_name, password) {
    return $.post(server_uri, {
        user_name: user_name,
        password: password
    });
}

jalf.getCollectionData = function(collectionUri, params) {
    var deferred = $.Deferred();
    var offset = params['offset'];
    var count = params['count'];

    $.getJSON(collectionUri, {
        offset: offset,
        count: count
    }).done(getAllLinks);
    
    function getAllLinks(collData) {
        var getPromises = startGetRequests(collData.items);
        $.when.apply(null, getPromises).done(function() {
            deferred.resolve(collData);
        });
    }

    function startGetRequests(items) {
        var itemsLength = items.length;
        var getPromises = [];
        if (itemsLength == 0) {
            return getPromises;
        }

        var linkName = getLinkName(items[0]);
        for (var i=0; i < itemsLength; ++i) {
            // The closure is necessary to have "i" frozen as "index"
            // at the time of execution.
            var putDataInItems = function(index) {
                return function(data) {
                    items[index][linkName + '_data'] = data;
                };
            }(i);
            getPromises[i] = $.getJSON(items[i].photo_link).done(putDataInItems);
        }

        return getPromises;
    }

    function getLinkName(item) {
        var linkNames = $.grep(Object.keys(item), function(k) { return k.match(/_link$/); });
        if (linkNames.length > 0) {
            return linkNames[0];
        }
        return null;
    }

    return deferred.promise();
}

