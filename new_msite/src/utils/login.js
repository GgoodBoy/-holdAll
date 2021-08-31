export default function (path) {
    if (!this.$getCookie('uInfo')) {
        if(path){
            sessionStorage.setItem('rediectUrl',path)
        }
        this.$router.push('/auth')
        return false;
    }else {
        return true;
    }
};
