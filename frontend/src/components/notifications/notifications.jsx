import incrementBadgeCount from '../../App'

let unreadMessagesCount = 0;

function pushNotify(text, image) {
    if(!text) {
        console.log('xd')
        return false
    }

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } 
    else if (Notification.permission === "granted") {
        let data = {
            title: "Eduapp",
            icon: './assets/logo.png',
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }        
        }
        new Notification(text, data)
        .then((res)=>{
            console.log("Notification : ", res);
            incrementBadgeCount() 
        })
        .catch((err)=>{
            console.log("Notification ERROR : ", err);
        })
    }
    // The user has previously denied or blocked the notifications. 
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                let data = {
                    title: "Thanks for subscribing",
                    icon: './assets/logo.png',
                    vibrate: [
                        100, 50, 100
                    ],
                    data: {
                        dateOfArrival: Date.now(),
                        primaryKey: 1
                    }
                };
                return new Notification(text, data)
                .then((res)=>{
                    console.log("Notification : ", res);
                    incrementBadgeCount() 
                })
                .catch((err)=>{
                    console.log("Notification ERROR : ", err);
                })

            }


        });} else if (Notification.permission === "blocked") { 
        console.log("The user has blocked notifications");
    }
}


// Badge

async function instanceBadge() {
    try{
    navigator && 
    navigator.setClientBadge(unreadMessagesCount).setAppBadge(unreadMessagesCount); 
    }
    catch(err){
        console.log('badge instance error',err)
    }
}

// async function incrementBadgeCount() {
//     await navigator.setAppBadge(++unreadMessagesCount);
// }

async function resetBadge() {
    await navigator.setAppBadge(0);
    unreadMessagesCount = 0;
}

export default pushNotify;

export {
    instanceBadge,
    resetBadge
};
