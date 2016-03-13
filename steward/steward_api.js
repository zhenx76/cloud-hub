var WebSocket = require('ws');
var when = require('when');
var logger = require('winston');

var reqno = 101;
var callbacks = {};
var ws_console, ws_manage;

function add_callback(cb) {
    callbacks[reqno.toString()] = cb;
    return reqno++;
}

function create_activity(ws, name, armed, event, task, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/activity/create/' + name
        , requestID : add_callback(cb)
        , name      : name
        , armed     : armed
        , event     : event
        , task      : task
    }));
}

function create_device(ws, name, whatami, info, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/device/create/' + name
        , requestID : add_callback(cb)
        , name      : name
        , whatami   : whatami
        , info      : info || {}
    }));
}

function create_event(ws, name, actor, observe, parameter, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/event/create/' + name
        , requestID : add_callback(cb)
        , name      : name
        , actor     : actor
        , observe   : observe
        , parameter : JSON.stringify(parameter) || ''
    }));
}

function create_group(ws, name, type, operator, members, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/group/create/' + name
        , requestID : add_callback(cb)
        , name      : name
        , type      : type     || ''
        , operator  : operator || ''
        , members   : members  || []
    }));
}

function create_task(ws, name, actor, perform, parameter, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/task/create/' + name
        , requestID : add_callback(cb)
        , name      : name
        , actor     : actor
        , perform   : perform
        , parameter : JSON.stringify(parameter) || ''
    }));
}

function list_activity(ws, activityID, options, cb) {
    if ((activityID !== '') && (parseInt(activityID, 10) <= 0)) throw new Error('activityID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/activity/list/' + activityID
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_actors(ws, prefix, options, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/actor/list/' + prefix
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_device(ws, deviceID, options, cb) {
    if ((deviceID !== '') && (parseInt(deviceID, 10) <= 0)) throw new Error('deviceID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/device/list/' + deviceID
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_event(ws, eventID, options, cb) {
    if ((eventID !== '') && (parseInt(eventID, 10) <= 0)) throw new Error('eventID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/event/list/' + eventID
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_group(ws, groupID, options, cb) {
    if ((groupID !== '') && (parseInt(groupID, 10) <= 0)) throw new Error('groupID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/group/list/' + groupID
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_task(ws, taskID, options, cb) {
    if ((taskID !== '') && (parseInt(taskID, 10) <= 0)) throw new Error('taskID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/task/list/' + taskID
        , requestID : add_callback(cb)
        , options   : options || {}
    }));
}

function list_users(ws, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/user/list/'
        , requestID : add_callback(cb)
        , options   : { depth: 'all' }
    }));
}

function modify_activity(ws, activityID, name, armed, event, task, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/activity/modify/' + activityID
        , requestID : add_callback(cb)
        , name      : name
        , armed     : armed
        , event     : event
        , task      : task
    }));
}

function modify_group(ws, groupID, name, type, operator, members, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/group/modify/' + groupID
        , requestID : add_callback(cb)
        , name      : name
        , type      : type     || ''
        , operator  : operator || ''
        , members   : members  || []
    }));
}

function perform_activity(ws, activityID, cb) {
    if (parseInt(activityID, 10) <= 0) throw new Error('activityID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/activity/perform/' + activityID
        , requestID : add_callback(cb)
    }));
}

function perform_actors(ws, prefix, perform, parameter, cb) {
    ws.send(JSON.stringify({ path      : '/api/v1/actor/perform/' + prefix
        , requestID : add_callback(cb)
        , perform   : perform
        , parameter : JSON.stringify(parameter) || ''
    }));
}

function perform_device(ws, deviceID, perform, parameter, cb) {
    if (parseInt(deviceID, 10) <= 0) throw new Error('deviceID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/device/perform/' + deviceID
        , requestID : add_callback(cb)
        , perform   : perform
        , parameter : JSON.stringify(parameter) || ''
    }));
}

function perform_group(ws, groupID, perform, parameter, cb) {
    if (parseInt(groupID, 10) <= 0) throw new Error('groupID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/group/perform/' + groupID
        , requestID : add_callback(cb)
        , perform   : perform
        , parameter : JSON.stringify(parameter) || ''
    }));
}

function perform_task(ws, taskID, cb) {
    if (parseInt(taskID, 10) <= 0) throw new Error('taskID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/task/perform/' + taskID
        , requestID : add_callback(cb)
    }));
}

function delete_activity(ws, activityID, cb) {
    if (parseInt(activityID, 10) <= 0) throw new Error('activityID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/activity/delete/' + activityID
        , requestID : add_callback(cb)
    }));
}

function delete_device(ws, deviceID, cb) {
    if (parseInt(deviceID, 10) <= 0) throw new Error('deviceID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/device/delete/' + deviceID
        , requestID : add_callback(cb)
    }));
}

function delete_event(ws, eventID, cb) {
    if (parseInt(eventID, 10) <= 0) throw new Error('eventID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/event/delete/' + eventID
        , requestID : add_callback(cb)
    }));
}

function delete_group(ws, groupID, cb) {
    if (parseInt(groupID, 10) <= 0) throw new Error('groupID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/group/delete/' + groupID
        , requestID : add_callback(cb)
    }));
}

function delete_task(ws, taskID, cb) {
    if (parseInt(taskID, 10) <= 0) throw new Error('taskID must be positive integer');

    ws.send(JSON.stringify({ path      : '/api/v1/task/delete/' + taskID
        , requestID : add_callback(cb)
    }));
}

var steward_opts = {
    hostname: '127.0.0.1',
    port: "8887",
    protocol: 'ws:',
    secure: false
};

function start_steward() {
    return when.promise(function(resolve, reject) {
        // Socket for streaming updates from steward
        logger.info('connecting to steward');
        ws_console = new WebSocket(steward_opts.protocol + '//' + steward_opts.hostname + ':' + steward_opts.port + '/console');

        ws_console.onopen = function (event) {
            logger.info("steward console interface opened");

            // Global socket for ongoing commands to steward
            ws_manage = new WebSocket(steward_opts.protocol + '//' + steward_opts.hostname + ':' + steward_opts.port + '/manage');

            ws_manage.onopen = function (event) {
                logger.info("steward management interface opened");

                // With both socket setup, the init is considered done,
                // Kick start the promise chain
                resolve(event);
            };

            ws_manage.onmessage = function (event) {
                var message, requestID, cb;

                try {
                    message = JSON.parse(event.data);
                    if (!message) throw new Error("invalid JSON: " + this.responseText);

                    requestID = message.requestID.toString();
                    cb = callbacks[requestID];
                    if (typeof cb !== 'undefined' && cb) {
                        if (message.hasOwnProperty("error")) {
                            cb(new Error(message.error.diagnostic));
                        } else {
                            if (message.hasOwnProperty("result")) {
                                if (message.result.hasOwnProperty("status") && message.result.status !== "success") {
                                    cb(new Error(message.result.status));
                                } else {
                                    cb(null, message.result);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            ws_manage.onclose = function (event) {
            };

            ws_manage.onerror = function (event) {
                console.log(event);
                ws_manage.close();
            };
        };

        ws_console.onmessage = function (event) {
            try {
                var message = JSON.parse(event.data);
                if (!message) throw new Error("invalid JSON: " + this.responseText);

                //console.log(message);
            } catch (ex) {
                console.log(ex.message);
            }
        };

        ws_console.onclose = function (event) {
        };

        ws_console.onerror = function (event) {
            console.log(event);
            ws_console.close();
        };
    });
}

module.exports = {
    init: start_steward,
    create_activity: create_activity,
    create_device: create_device,
    create_event: create_event,
    create_group: create_group,
    create_task: create_task,
    list_activity: list_activity,
    listActors: function() {
        return when.promise(function(resolve, reject) {
            list_actors(ws_manage, '', {'depth': 'all'}, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    listAllDevices: function() {
        return when.promise(function(resolve, reject) {
            list_device(ws_manage, '', {'depth': 'flat'}, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    listDevice: function(deviceID) {
        return when.promise(function(resolve, reject) {
            list_device(ws_manage, deviceID, {'depth': 'flat'}, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    list_event: list_event,
    list_group: list_group,
    list_task: list_task,
    list_users: list_users,
    modify_activity: modify_activity,
    modify_group: modify_group,
    perform_activity: perform_activity,
    perform_actors: perform_actors,
    perform_device: perform_device,
    perform_group: perform_group,
    perform_task: perform_task,
    delete_activity: delete_activity,
    delete_device: delete_device,
    delete_event: delete_event,
    delete_group: delete_group,
    delete_task: delete_task
};
