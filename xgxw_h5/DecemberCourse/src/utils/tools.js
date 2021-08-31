export default{
    loadScript(src){
        return new Promise((resolve,reject)=>{
            let script = document.createElement('script');
            let body = document.getElementsByTagName('body')[0]
            script.type = 'text/javascript';
            script.src = src;
            if (script.readyState){
                script.onreadystatechange = ()=>{
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {
                script.onload = ()=>{
                    resolve();
                };
                script.onerror = () => {
                    body.removeChild(script);
                    reject();
                }
            }
            body.appendChild(script);
        })
    },
    setRem(){
        return (function (doc, win) {
            let docEl = doc.documentElement,
                resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
                recalc = function () {
                    let clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;
                    let width = clientWidth>=768?768:clientWidth
                    docEl.style.fontSize = 100 * (width / 750) + 'px';
                };
                if (!doc.addEventListener) return;
                win.addEventListener(resizeEvt, recalc, false);
                doc.addEventListener('DOMContentLoaded', recalc, false);
            })(document, window);
    },
    getQueryString(key){
        const reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        const result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
}