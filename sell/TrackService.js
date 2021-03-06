var eb = require('../EventBus');
var ee = require('../EventEmitter');

var ServerEvents = require('./ServerEvents');
var Events = require('./Events');
var Promise = require('bluebird');
var lib = require('../../components/functions');

class TrackService {

    findAll(params) {
        return new Promise(function (resolve, reject) {
            eb().send(ServerEvents.FIND_ALL_TRACKS, params, null, function (err, msg) {
                if (!!err || !!msg.failureCode || !!(msg.body || {}).responseCode) {
                    reject(err || msg);

                    console.log("Error " + ServerEvents.FIND_ALL_TRACKS, err || msg);
                    return;
                }

                resolve(msg.body);
            });
        });
    }

    find(id) {
        return new Promise(function (resolve, reject) {
            eb().send(ServerEvents.FIND_TRACK, id, null, function (err, msg) {
                if (!!err || !!msg.failureCode || !!(msg.body || {}).responseCode) {
                    reject(err || msg);

                    console.log("Error " + ServerEvents.FIND_TRACK, err || msg);
                    return;
                }

                resolve(msg.body);
            });
        });
    }

    create(tracks) {
        return new Promise(function (resolve, reject) {

            tracks.forEach(tk => {
                tk.productId = tk.id
                delete tk.id;
            });

            console.log("SEND." + ServerEvents.CREATE_TRACK, JSON.stringify(tracks));

            eb().send(ServerEvents.CREATE_TRACK, tracks, null, function (err, msg) {
                if (!!err || !!msg.failureCode || !!(msg.body || {}).responseCode) {
                    reject(err || msg);

                    console.log("Error " + ServerEvents.CREATE_TRACK, err || msg);
                    return;
                }

                resolve(msg.body);

                ee.emit(Events.TRACK_CREATED, msg.body);

                console.log(Events.TRACK_CREATED, tracks);
            });
        });
    }

    update(productId, tracks) {

        tracks.forEach(tk => {
            tk.productId = tk.productId || tk.id;
            delete tk.id;
        });

        return new Promise(function (resolve, reject) {

            console.log("SEND." + ServerEvents.UPDATE_TRACK, JSON.stringify({productId, tracks}));

            eb().send(ServerEvents.UPDATE_TRACK, {productId, tracks}, null, function (err, msg) {
                if (!!err || !!msg.failureCode || !!(msg.body || {}).responseCode) {
                    reject(err || msg);

                    console.log("Error " + ServerEvents.UPDATE_TRACK, err || msg);
                    return;
                }

                resolve(msg.body);

                ee.emit(Events.TRACK_UPDATED, msg.body);
            });
        });
    }


}

module.exports = new TrackService();