import {incrementBadgeCount} from '../../App'

let unreadMessagesCount = 0;

function pushNotify(text) {
    if(!text) {
        console.log('xd')
        return false
    }

    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } 
    else if (Notification.permission === "granted") {
        var notify = new Notification('Eduapp!', {
            body: text,
        });

        incrementBadgeCount() 
    }
    // The user has previously denied or blocked the notifications. 
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                var notify = new Notification('Eduapp!', {
                    body: text,
                });
                incrementBadgeCount() 

            }


        });}
        else if (Notification.permission === "blocked") { 
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
async function resetBadge() {
    await navigator.setAppBadge(0);
    unreadMessagesCount = 0;
}

export default pushNotify;

export {
    instanceBadge,
    resetBadge
};
