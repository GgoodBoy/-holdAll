// const crypto = require('crypto');
const timeFormDate = (val, date, flag) => {
    let time = new Date(val);
    let year = time.getFullYear();
    let month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    let h = (time.getHours()) < 10 ? '0' + (time.getHours()) : (time.getHours());
    let m = (time.getMinutes()) < 10 ? '0' + (time.getMinutes()) : (time.getMinutes());
    let s = (time.getSeconds()) < 10 ? '0' + (time.getSeconds()) : (time.getSeconds());
    if(date){
        if(flag){
            return `${year}-${month}-${day} ${h}:${m}:${s}`;
        }else
            return `${year}-${month}-${day}`;
    }else {
        return `${year}年${month}月${day}日`;
    }
}
const formatSeconds = (value) => {
    let h = parseInt(value/3600)
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let hStr = h<10?`0${h}`:h;
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    return `${hStr}:${mStr}:${sStr}`
}

const compress = (img)=>{
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    var quality = 0.99
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var tCanvas = document.createElement('canvas');
    var tctx = canvas.getContext('2d');
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
    var ndata = canvas.toDataURL('image/jpeg', quality);
    console.log('压缩前：' + initSize);
    console.log('压缩后：' + ndata.length);
    console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
}     
/**
 * @desc 函数防抖 , 某段时间后执行一次，期间有操作则重新计时，常用语搜索、输入框验证
 * @param {*} fn 目标函数
 * @param {*} wait 间隔
 */
const debounce = (fn, wait = 500)=>{
    let timer = null;
    return function () {
        let now = !timer;
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
        }, wait);
        if (now) {
            fn.apply(this, arguments);
        }
    }
}
/**
 * @desc 函数节流，一段时间内只执行一次，常用于点击事件，防止重复点击
 * @param {*} fn 
 * @param {*} wait 
 */
const throttle = (fn, wait = 500)=>{
    let last = 0;
    return function () {
        let now = Date.now();
        if (now - last > wait) {
            fn.apply(this, arguments);
            last = now;
        };
    }
}
// const Md5 = (str)=>{
//     const hash = crypto.createHash('md5');
//     hash.update(str);
//     return hash.digest('hex')
// }
let utils = {
    timeFormDate,
    formatSeconds,
    compress,
    // Md5
}
export default utils;