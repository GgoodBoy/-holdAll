import {ref} from 'vue'
export default function useChannel(){
    let isWx = ref(false);
    let isIos = ref(false);
    let inApp = ref(false);
    const navigatorType =()=>{
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger' || typeof WeixinJSBridge !== "undefined") {
            isWx.value = true;
        }
        isIos.value = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(isIos.value){
            try {    
                window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
                inApp.value = true;
            }
            catch(err) {
                inApp.value = false;
            }
        }else{
            if(window.android){
            if(window.android.notify){
                inApp.value = true;
            }
            }else{
                inApp.value = false;
            }
        }
    }
    return {
        navigatorType,
        isWx,
        isIos,
        inApp
    }
}
//isWechatBrowser