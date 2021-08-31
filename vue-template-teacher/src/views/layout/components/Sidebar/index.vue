<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="logo-wrap">
            <img class="logo"
                 :src="'./static/images/logo-new.png'"
                 alt=""
                 srcset="">
        </div>
        <el-menu :show-timeout="200"
                 :default-active="defaultActiveLink"
                 :collapse="isCollapse"
                 :unique-opened="true"
                 mode="vertical"
                 background-color="#3A393E"
                 text-color="#ACACAC"
                 active-text-color="#B4272D"
                 ref="menu"
                 >
                 <div v-for="(route,index) in routeArr" ref="menuItem" :class="route.isSelect?'is-selected':''" :key="index">
                     <sidebar-item 
                          :item="route"
                          :index="String(index)" 
                          :data-index="index"
                          :base-path="route.path"
                          :defaultActiveLink="defaultActiveLink"
                          :menuDom="menuDom"
                          />
                 </div>
            
        </el-menu>
    </el-scrollbar>
</template>

<script>
import { mapGetters,mapState } from "vuex";
import SidebarItem from "./SidebarItem";//routeArr
const addPath = ['/adultHomeSetting','/childHomeSetting']
export default {
    data(){
        return {
            routeArr:[],
            defaultActiveLink:'0',
            menuDom:{}
        }
    },
    components: { SidebarItem },
    computed: {
        ...mapGetters(["sidebar"]),
        ...mapState(['user']),
        routes() {
            return this.$router.options.routes;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
    },
    created(){
        let temp = JSON.parse(JSON.stringify(this.$router.options.routes))
        // console.log("temp",temp);
        console.log("this.$router.options",this.$router.options);
        let compare = JSON.parse(window.localStorage.getItem('permissions'));
        let arr = [ ];
        let str = addPath.join(',');
        temp.forEach((item,index)=>{
            let child = item.children;
            if(child&&child.length>0){
                let brr = [ ];
                child.forEach((option,index)=>{
                    if(option.meta.code && option.meta.code!='')
                        compare.includes(option.meta.code) && brr.push(option)
                    if(option.meta.title == '首页')    
                        brr.push(option)
                })
                if(brr.length>0){
                    item.child = brr;
                    arr.push(item)
                }
            }
        });
        this.routeArr = arr;
        let parent = arr.find(item=>{
            if(item.path!='/'){
                return this.$route.path.includes(item.path.split('Manage')[0])
            }
        })
        let parentIndex = arr.findIndex(item=>{
            if(item.path!='/'){
                return this.$route.path.includes(item.path.split('Manage')[0])
            }
        })
        if(parent&&parent.children&&parent.children.length==1){
            this.defaultActiveLink = `${parentIndex}`
            let home = addPath.find(item=>item.includes(this.$route.path));
            if(home){
                this.defaultActiveLink = `${parentIndex}-1`
            }
        }else{
            let hiddenIndex = 0;
            let showNumber = 0;
            let index = parent.children.findIndex(option=>{
                    if(option.hidden)
                        hiddenIndex++     
                    return option.hidden == false && this.$route.path.includes(option.path)
            });
            parent.children.forEach(elemets=>{
                if(!elemets.hidden){
                    showNumber++;
                }
            });
            if(showNumber>1||parent.meta.childrenLength>1){
                let flag = addPath.find(item=>this.$route.path.includes(item))
                if(flag){
                    this.defaultActiveLink = `${parentIndex}-${index-hiddenIndex}-0`
                }else{
                    this.defaultActiveLink = `${parentIndex}-${index-hiddenIndex}`
                }
            }else{
                this.defaultActiveLink = `${parentIndex}`
            }
            console.log('this.defaultActiveLink',this.defaultActiveLink)
        }
    },
    mounted(){
        this.menuDom = this.$refs.menu;
    },
    methods:{
    }
};
</script>
<style scoped lang="scss">
.logo-wrap {
    background: #9e0e00;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 9;
    .logo {
        width: 180px;
        transition: 0.3s;
    }
}
</style>
<style>
.hideSidebar .logo-wrap .logo {
    width: 130px;
    max-width: none;
    margin-right: -96px;
}
</style>
