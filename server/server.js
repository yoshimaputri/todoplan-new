const express = require('express');
const webpush = require('web-push');
const bodyparser = require('body-parser');
const cors = require('cors');
const moment = require('moment');

let subscription = null;
const vapidCreds = {
    publicKey: 'BMfD_geBAmZeB5O6zXY24uE3cAc6wNqHXymCu4F3MidAyKZXYNlvCrgy0o3twe7necgyPqCMp3o0KQUDSHwKJLo',
    privateKey: 'VBnfKy6uFh-qmA8TcxUpeeRDFs8Oawkye-bvz8n0TS0',
    subject: 'http://localhost:3000'
}

async function sendNotification(body) {
    await webpush.sendNotification(subscription, body, {
        TTL: 10000,
        vapidDetails: vapidCreds
    }).then((result) => {
        console.log(result.statusCode)
    }).catch((err) => {
        console.log(err)
    })
}

async function sendReminder(body, remindAt) {
    const timeToRemind = (remindAt - moment(Date.now()).unix()) * 1000;
    console.log(timeToRemind)
    if (timeToRemind > 0) {
        setTimeout(() => {
            sendNotification(body);
        }, timeToRemind);
    } else {
        sendNotification(body);
    }
}

let app = express()
app.use(bodyparser.json())
app.use(cors({
    origin: function (_, callback) {
        return callback(null, true);
    }

}));
const port = process.env.PORT || 3001

app.get('/vapidPublicKey', function (req, res) {
    res.send(vapidCreds.publicKey)
});

app.post('/subscribe', function (req, res) {
    console.log("subscribe")
    subscription = req.body
    res.sendStatus(201);
});

app.post('/sendNotification', function (req, res) {
    console.log("sendNotification")
    console.log(subscription)
    let body = JSON.stringify({
        title: "title",
        body: "body"
    })
    webpush.sendNotification(subscription, body, {
        TTL: 10000,
        vapidDetails: vapidCreds
    }).then((result) => {
        console.log(result.statusCode)
    }).catch((err) => {
        console.log(err)
    })
});

app.post('/remind', function (req, res) {
    console.log("remind")
    console.log(req.body)
    body = JSON.stringify({
        title: req.body.title,
        body: req.body.body
    })
    sendReminder(body, req.body.remindAt)
})

app.listen(port, console.log(`Started listening on port ${port}`))