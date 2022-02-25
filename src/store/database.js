// DOCUMENTATION
// https://github.com/louischatriot/nedb

const Datastore = require.main.require('nedb');
const path = require('path');

const directory = 'data';
const dbPath = {
    Members: path.join(directory, 'members.db'),
    VoiceChannels: path.join(directory, 'voice.db'),
    SocialClubs: path.join(directory, 'clubs.db'),
    ProcessQueue: path.join(directory, 'queue.db'),
    Schedule: path.join(directory, 'schedule.db'),
    Roles: path.join(directory, 'roles.db'),
    Guilds: path.join(directory, 'guilds.db'),
    Help: path.join(directory, 'help.db'),
};


exports.Type = {
    MEMBER: 'Members',
    VOICE: 'VoiceChannels',
    CLUBS: 'SocialClubs',
    QUEUE: 'ProcessQueue',
    ROLES: 'Roles',
    SCHEDULE: 'Schedule',
    GUILDS: 'Guilds',
    HELP: 'Help',
};

// CREATE AND INITIALIZE DATABASE
var db = {};
db.Members = new Datastore({
    filename: dbPath.Members, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: true
});
db.VoiceChannels = new Datastore({
    filename: dbPath.VoiceChannels, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: true
});
db.SocialClubs = new Datastore({ filename: dbPath.SocialClubs, autoload: true, corruptAlertThreshold: 0, onload: err => {if (err)  console.error('Error loading db!', err) },
    timestampData: true
});
db.ProcessQueue = new Datastore({
    filename: dbPath.ProcessQueue, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: true
});
db.Schedule = new Datastore({
    filename: dbPath.Schedule, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: false
});
db.Config = new Datastore({
    filename: dbPath.Config, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: false
});

db.Guilds = new Datastore({
    filename: dbPath.Guilds, autoload: true, corruptAlertThreshold: 0,
    onload: err => {
        if (err) {
            console.error('Error loading db!', err);
        }
    },
    timestampData: false
});


exports.init = function (target) {
    return new Promise(function (resolve, reject) {
        db[target].loadDatabase(function (err) {
            if (err) reject(err);
            resolve();
        });
    });
};
// https://www.npmjs.com/package/nedb#persistence
exports.bake = function (target) {
    // return new Promise(function (resolve, reject) {
    db[target].persistence.compactDatafile();
    // if(db[target].compaction.done) console.log("COMPACT DONE");
    //     if (err) reject(err);
    //     resolve(newDoc);
    // });
};

exports.insert = function (target, data) {
    return new Promise(function (resolve, reject) {
        db[target].insert(data, function (err, newDoc) {
            if (err) reject(err);
            resolve(newDoc);
        });
    });
};

exports.update = function (target, query, update, options = {}) {
    return new Promise(function (resolve, reject) {
        db[target].update(query, update, options, function (err, replaced) {
            if (err) reject(err);
            resolve(replaced);
        });
    });
};

exports.remove = function (target, data) {
    return new Promise(function (resolve, reject) {
        db[target].remove(data, function (err, removed) {
            if (err) reject(err);
            resolve(removed);
        });
    });
};

exports.find = function (target, data) {
    return new Promise(function (resolve, reject) {
        db[target].find(data, function (err, docs) {
            if (err) reject(err);
            resolve(docs);
        });
    });
};
exports.findOne = function (target, data) {
    return new Promise(function (resolve, reject) {
        db[target].findOne(data, function (err, docs) {
            if (err) reject(err);
            resolve(docs);
        });
    });
};
// exports.sort = function (target, data) {
//     return new Promise(function (resolve, reject) {
//         db[target].find(data, function (err, docs) {
//             if (err) reject(err);
//             resolve(docs);
//         });
//     });
// };