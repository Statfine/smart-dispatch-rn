/**
 * app执行通知
 */
import NotifService from './NotifService';
import { navigate } from './NavigationService';

let notifRef;
let notifTimer;

// 初始化notifRef
function notificationListenerInit() {
  const onNotif = (notif) => {
    console.log('NOTIFICATION:', notif);
    navigate(notif.data.screen);
  };
  const onRegister = (token) => {
    console.log('onRegister:', token);
  };

  notifRef = new NotifService(onRegister, onNotif);
}

//  执行推送
export function monitorNotification() {
  if (!notifTimer) {
    notifTimer = setInterval(() => {
      notifRef.localNotif();
    }, 10000);
  }
}

// 关闭推送
export function closeNotification() {
  if (notifTimer) {
    clearInterval(notifTimer);
    notifTimer = null;
  }
}

export default notificationListenerInit;
