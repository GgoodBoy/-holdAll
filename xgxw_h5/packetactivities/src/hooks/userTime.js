export default function useTurn(){
    let timeNumber;
    const setTimePack =(startNum,lengthTime)=>{
        let date = new Date()
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
        let m = date.getMinutes();
        if (Number(h) == Number(startNum) && Number(m) < lengthTime) {
            timeNumber = 1;
        } else if (Number(h) > Number(startNum) ) {
            timeNumber = 2;
        } else if (Number(h) == Number(startNum) && Number(m) >= lengthTime) { 
            timeNumber = 2;
        } else if (Number(h) < Number(startNum)) { 
            timeNumber = 3;
        }
        return timeNumber;
    }
    return {
        setTimePack
    }
}
//isWechatBrowser