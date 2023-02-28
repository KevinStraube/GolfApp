import * as Notifications from 'expo-notifications';

export async function sendPushNotification(token, title, body) {
    /*
    const appConfig = require('../app.json');
    const projectId = appConfig?.expo?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({
        projectId
    })).data;
    */
    console.log("TOKEN:", token);
    const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
            host: "exp.host",
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-type": "application/json",
        },
        body: JSON.stringify(message),
    });
}