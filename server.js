var express = require('express');
var app = express();
var admin = require('firebase-admin');
var bodyParser = require('body-parser');
var request = require('request-promise');
var cors = require('cors');
var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var abc = {};
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'bizmatetest-62c5b',
        clientEmail: 'firebase-adminsdk-fvvdv@bizmatetest-62c5b.iam.gserviceaccount.com',
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZ0MmkupaLe2TT\n2Q0cGkE/t/LOOTaw5US/Ctipjo7IOspxnXSNJW6vuGrnoWEGCqmLgwur9VQmv2zG\nPFxZkZvT4LZVPwQIYq9AmjhmE8uCQYkF9l5ZmedHI27uV47l5PyX4Zp+oeuKqLZ+\nvxPDYv4HPc2JvU4uoTqxYn4Ycyl2onB78lYss8zbCzhH8zqOF0irfP+deRi+Zye7\nV1rttQrzzqUb95Ql+JTEK9XWbydKXDUvMRgfXXGcGbaT82dwNaYLp/uuKGXQMhmU\n+7QNyp26+7nGMlXP3ORwzB65sPBFvsazFJbQEHfBlGl2RbUWu5k07Tal2EX2PEz/\nnyats4f9AgMBAAECggEAD2g7JzWSmg2xqWGQUZVS2bq9iFRYN8WT6g6OmlnM5EFy\nWfyJBsXn0TKyjy1lY0vER+vOWszI9c+zFkelQamw09kwlJGXS6+NVXzDMgdC7TUN\nB/iwHlbqWugY+++CGmVq76Rj7QKvmliKRidmcrrxHJqEzDIxkk9Ry0PcBwc4Xt2H\ns+RoNbgwI8kv13+BbdiX7VA+miTLacc/BrsKwp10VMLWd+cBEWfqChsMHqo9txpa\nSd0d5HNhKm3fBz7R97WiHp29eZtTcEBmYckMmNSbS1hkbDCXfRU+8kReobBBaMbU\ntsikmnEmtkAKWWSyTaGxA4sdSBXQAJnFaMy2qgzs8QKBgQD4ViaLYl7lc7BgkmGm\n7qPh/kOp5cKfse+avHFDgT0Xn5zgRpuewMM1RJjjI8JjEQ5hDyY+Ygjz56OX8Fjc\nc1JB8OZrOlJLr0VXc61t09fB7Q3zVE6Bvv/4m/ExAMzZMQ/aru6Ll+tXwJ8qblXf\nTIIlV2O/Z1sP/OvWNHcf4mKjDQKBgQDgiYXRqJwfKqWQ6r428/tth4nh2iZoHmti\nh85/e5Z6XWS9p61xFgUKyQCDBnvDQJNt7E29MwlhnuwiMcwmJiXnG3fLjK8SGmrd\n0G970Chj8g/cTwQOEWb6Ii1zfylcrH3pe8F2HM80Dh1fwRjXVPVsc9jNpKyPSb7M\njQ0iiwD8sQKBgQCgE8By1q0/EMzf41vpJCklsyXgrYdAM42028XS8srzoGKaO0lz\nEuSCQL6go9tYypTPQdmwGreUqXtNpJNTP08FzIhrFEQaH1f+YEWp5wVML0dv06dr\ngTg1BCh8Ivzo//QtTdfcycfdX//5dPgLoaC++08EAVa0vp8zC8zCE8brPQKBgFoy\nJBVCW+SRJwz9nwdIHtmytoqJLSBqB8z+rM69AIeK+KrOrndc1w2sDI6VjiWyzQY9\nBEVaOQyD4GskAdPZQySA/jBABRuKjR8pWX8s8OylEgX3n7Ne/jTAge2BSUY27CVc\nVyxxCjLo8JfEY4wsTqIQLyj8W2z7vK9CgeI8YFshAoGAeJe4xum2FpO0+hHZn+/c\nG0LZznT4/V8hUKqYE2L5q691DvX39IjHYMGQaMVAqvs8S1+DPzE6e+kZtvDsuYLb\nV/k5lqFQGfBTjVSKfSv9w2rvqU6Ysk8A6BYpsgumCoX615nBJOJQuU6TFL+dSRHc\niTBaXhtdOhRz8/lZLkVGPLw=\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: 'https://bizmatetest-62c5b.firebaseio.com'
});
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin, Cache-Control');
    res.header('Access-Control-Allow-Credentials', true);
    next();
}
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(allowCrossDomain);
app.options('*', cors());
app.post('/enviarNotificacion', cors(), function (req, res) {
    var empresaId = req.body.empresaId;
    //var token = req.body.token;
    //var geo = req.body.geo;
    //res.send(user_id + ' ' + token + ' ' + geo);
    admin.database().ref('/TOKENS/' + empresaId).once('value', snap => {
        if (snap.val()) {
            if (!snap.val().fechaConexion && snap.val().token) {
                console.log('Se envía notificación al siguiente token');
                //return sendNotification(snap.val().token);                
                var objNotificacion = {
                    "notification": {
                        "title": "BizMate",
                        "body": "Tiene notificaciones pendientes.",
                        "sound": "default",
                        "icon": "my_notification_icon",
                        "color": "#4fd2c2",
                        "click_action": "FCM_PLUGIN_ACTIVITY",
                        "tag": "BizMateNotification"
                    },
                    "data": {},
                    "to": snap.val().token,
                    "priority": "high",
                    "collapse_key": "BizMateNotification"
                };
                var options = {
                    uri: "https://fcm.googleapis.com/fcm/send",
                    method: "POST",
                    json: true,   // <--Very important!!!
                    body: objNotificacion,
                    headers: {
                        'Content-Type': 'application/json', 'Authorization': 'key=AAAAnHBDU3M:APA91bGMbH9eC623D6me16qbA4lS5IiLaaSyxhXg_NgwV8zEJFLhDpvz7wlRUKq2W2eNzbs7a3wweErsGkFeAfwf6sMoxIi4AUkdmQ0BE2o1jmAHgwUkHwSjAPDiuQk1DOK0F8nlDj-g'
                    }
                };
                return request(options).then(function (response) {
                    res.send('enviado correctamente');
                    return console.log('exito');
                })
               .catch(function (err) {
                   res.send(err);
                   return console.log('error');
               });
            }
            else {
                res.send('no se envia notificacion');
                return console.log('No se envía notificación');
            }
        }
        else {
            res.send('no info de la empresa');
            return console.log('no info de la empresa');
        }
    });
});
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' URI no encontrada' });
});
var server = http.createServer(app);
server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || process.env.PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || '0.0.0.0', function () {
    console.log('Servidor escuchando en puerto 8080. con nueva fecha: ' + (new Date()));
});
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});
wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin 
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    clients.push(connection);
    console.log('***Nuevo cliente conectado. Fecha: ' + (new Date()));
    connection.on('message', function (message) {
        var index = clients.indexOf(connection);
        if (message.type === 'utf8') {
            var signal;
            try { signal = JSON.parse(message.utf8Data); } catch (e) { console.log(e); };
            switch (signal.funcion) {
                case 'Welcome':
                    console.log('Usuario conectado: ' + signal.datos);
                    connection.empresaId = signal.datos;
                    admin.database().ref('TOKENS/' + signal.datos + '/fechaConexion').set(admin.database.ServerValue.TIMESTAMP);
                    break;
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        admin.database().ref('TOKENS/' + connection.empresaId + '/fechaConexion').remove();
        var i = clients.indexOf(connection);
        clients.splice(i, 1);
        console.log('>>>Cliente desconectado. Fecha: ' + (new Date()));
        console.log('clientes conectados:' + clients.length + " id:" + i);
    });
    setTimeout(function timeout() {
        connection.sendUTF(Date.now());
    }, 500);
});

//wsServer.on('close', function (val) {
//    console.log('se cierra');
//    console.log(val);
//});
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed. 
    return true;
}

