import * as Notifications from 'expo-notifications';

export async function sendPushNotification() {
    const appConfig = require('../app.json');
    const projectId = appConfig?.expo?.extra?.eas?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({
        projectId
    })).data;
    console.log("TOKEN:", token);
    const message = {
        to: "ExponentPushToken[YjKBUTAbLCihr9deIRE2aI]",
        sound: "default",
        title: "New Match!",
        body: "Body of message",
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