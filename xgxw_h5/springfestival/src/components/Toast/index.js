import Vue from 'vue'
import index from './index.vue'
const toast = {
    show:false,
    queue:[]
}
window.toast = toast;
export default {
    install(Vue){
        const Toast = (opts)=> {
            if(toast.show){
                if(!opts.type){
                    toast.queue[0]._data.type = ''
                }
                toast.queue[0]._data = Object.assign(toast.queue[0]._data,opts)
                return;
            }else{
                const ToastComp = Vue.extend(index);
                const comp = toast.queue[0] = new ToastComp()
                comp.$mount(document.createElement('div'))
                document.body.appendChild(comp.$el);
                comp.visible = true;
                if(typeof opts=='string'){
                    comp._data.message = opts;
                }else{
                    comp._data = Object.assign(comp._data,opts)
                }
                comp.remove = ()=> {
                    Toast.clear()
                }
                toast.show = true;
            }
        }
        Toast.loading = (opts) => {
            if(typeof opts=='string'){
                let temp = {
                    message:opts,
                    type:'loading'
                }
                Toast(temp)
            }else{
                opts.type = 'loading';
                Toast(opts)
            }
        }
        Toast.clear = ()=> {
            toast.queue.forEach(toast => {
                const parent = toast.$el.parentNode;
                if (parent) {
                    parent.removeChild(toast.$el);
                }
                toast.$destroy();
            });
            toast.show = false;
        }
        Vue.prototype.$toast = Toast;
    }
}