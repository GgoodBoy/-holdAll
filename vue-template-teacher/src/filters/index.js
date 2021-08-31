const covering = function(val) {
    if (val < 10) {
        return "0" + val;
    }
    return val + "";
};
const millisecondToDate = (mss) => {
    if (!mss) return "00:00:00";
    var hours = covering(parseInt((mss % (60 * 60 * 24)) / (60 * 60)));
    var minutes = covering(parseInt((mss % (60 * 60)) / 60));
    var seconds = covering(parseInt(mss % 60));
    return hours + ":" + minutes + ":" + seconds;
}
export {
    millisecondToDate
}
