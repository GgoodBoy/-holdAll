function htmlFontSize(){ 
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); 
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); 
    var width = w > h ? h : w; 
    width = width > 750 ? 750 : width 
    var fz = ~~(width*100000/75)/10000 
    document.getElementsByTagName("html")[0].style.cssText = "font-size: " + fz +"px"; 
    var realfz = ~~(+window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize.replace("px","")*10000)/10000 
    if (fz !== realfz) { 
      document.getElementsByTagName("html")[0].style.cssText = "font-size: " + fz * (fz / realfz) +"px"; 
    } 
}
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
        htmlFontSize()
        window.addEventListener("resize", htmlFontSize, false);
        // return (function (doc, win) {
        //     let docEl = doc.documentElement,
        //         resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
        //         recalc = function () {
        //             let clientWidth = docEl.clientWidth;
        //             if (!clientWidth) return;
        //             let width = clientWidth>=768?768:clientWidth
        //             docEl.style.fontSize = 100 * (width / 750) + 'px';
        //         };
        //         if (!doc.addEventListener) return;
        //         win.addEventListener(resizeEvt, recalc, false);
        //         doc.addEventListener('DOMContentLoaded', recalc, false);
        // })(document, window);
    },
    getQueryString(key){
        const reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        const result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
}