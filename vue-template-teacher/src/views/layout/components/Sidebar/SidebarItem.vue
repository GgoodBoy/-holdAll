<template>
    <div>
        <div v-if="filterChildren.length>0" class="menu-wrapper">
            <el-submenu :index="index" :data-index="index" v-if="flag" class="first-menu">
                <template slot="title">
                    <i :class="item.meta.icon"/>
                    <span>{{item.meta.title}}</span>
                </template>
                <div v-for="(option,i) in filterChildren" :key="i">
                    <div v-if="option.children&&option.children.length>0" class="second-menu" ref="secondMenu" :class="option.isSelect?'selected':''" @click="selectSecondMenu(option,i)" :data-index="`${index}-${i}`">
                        <el-submenu  :index="`${index}-${i}`" :data-index="`${index}-${i}`">
                            <template slot="title">
                                <span class="second-menu-t">{{option.meta.title}}</span>
                            </template>
                            <el-menu-item class="menu-module" v-for="(unit,_index) in option.meta.module" :key="_index" :index="`${index}-${i}-${_index}`" :data-index="`${index}-${i}-${_index}`" @click.native="$event.stopPropagation()">
                                <p class="des" v-show="unit.des">{{unit.des}}
                                    <el-tooltip class="item" effect="light"  placement="right" v-show="unit.tips.length>0">
                                        <i class="el-icon-question"></i>
                                        <div slot="content">
                                            <p v-for="o in unit.tips" :key="o">{{o}}</p>
                                        </div>
                                    </el-tooltip>
                                </p>
                                <div class="menu-module-list clearfix" :style="{marginTop:(unit.des?0:'10px')}">
                                    <p v-for="(o,i) in unit.list" :key="i" @click.stop="chooseModule(unit,o)">{{o.value}}</p>
                                </div>
                            </el-menu-item>
                        </el-submenu>
                    </div>
                    <el-menu-item v-else :index="`${index}-${i}`" :data-index="`${index}-${i}`"  style="paddingLeft:80px" @click="selectSingleMenu(index)">
                        <router-link :to='option.path'>{{option.meta.title}}</router-link>
                    </el-menu-item>
                </div>
            </el-submenu>
            <el-menu-item v-else :index="index" style="paddingLeft:40px" :data-index="index" @click="selectFirstMenu">
                <router-link :to="filterChildren[0].path">
                    <i :class="filterChildren[0].meta.icon"/>
                    {{item.children[0].meta.title}}
                </router-link>
            </el-menu-item>
        </div>
    </div>
</template>

<script>
import path from "path";
import { validateURL } from "@/utils/validate";
import Item from "./Item";
import {mapState,mapActions} from 'vuex'
const addPath = ['/adultHomeSettingSecondManage','/childHomeSettingManage']
export default {
    name: "SidebarItem",
    components: { Item },
    props: {
        // route配置json
        item: {
            type: Object,
            required: true
        },
        isNest: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ""
        },
        index:String,
        defaultActiveLink:String,
        menuDom:Object
    },
    computed:{
        ...mapState(['homeConfig','goodsPage','wxStore'])
    },
    data() {
        return {
            onlyOneChild: null,
            filterChildren:[],
            flag:false,
        };
    },
    created(){
        let filterChildren = [ ];
        // console.log("this.item",this.item);
        if(this.item.child){
            this.item.child.map(option=>{
                !option.hidden && filterChildren.push(option)
            })
        }
        filterChildren.forEach((item,i)=>{
            let temp = `${this.index}-${i}`;
            item.isSelect = this.defaultActiveLink.includes(temp)?true:false
        })
        this.filterChildren = filterChildren;
        // let flag = this.item.child&&this.item.child.length>1?true:false
        let flag = this.item.child&&this.item.meta.childrenLength>1?true:false
        this.flag = flag;
        // console.log("this.filterChildren",this.filterChildren);
    },
    methods: {
        ...mapActions(['setAdultHomeConfig','setChildHomeConfig','setConfig','setwxModelValeType']),
        /**
         * 选择二级页面
         */
        selectSecondMenu(obj,index){
            if(obj.isSelect){
                this.filterChildren.forEach(item=>item.isSelect=false);
                console.log('objTrue1',obj);
                obj.isSelect = false;
                console.log('objTrue2',obj);
                console.log('indexTrue',index); 
                console.log('this.filterChildrenTrue',this.filterChildren);               
                this.$set(this.filterChildren,index,obj)
                return;
            }else{
                this.filterChildren.forEach(item=>item.isSelect=false);
                console.log('objfalse1',obj);
                obj.isSelect = true;
                this.$set(this.filterChildren,index,obj)
                console.log('objfalse2',obj);
                console.log('indexfalse',index); 
                console.log('this.filterChildrenfalse',this.filterChildren);                 
                this.$refs.secondMenu[index].querySelector(".menu-module").click()
                setTimeout(()=>{
                    this.$router.push(obj.children[0].path)
                },100)
                return;
            }
        },
        /**
         * 选择menu-item菜单,关闭同组激活的下拉菜单
         */
        selectSingleMenu(i){
            let dom = document.querySelector('.first-menu.is-active');    
            if(dom){
                let dataIndex = dom.getAttribute('data-index');
                if(dataIndex==i){
                    let arr = []
                    this.filterChildren.forEach(item=>{
                        if(item.children&&item.children.length>0){
                            arr.push(item)
                        }
                    })
                    let index = arr.findIndex(item=>item.isSelect==true);
                    if(index>=0){
                        this.$refs.secondMenu[index].click()
                        let dataIndex = this.$refs.secondMenu[index].getAttribute('data-index');
                        this.menuDom.close(dataIndex)
                    }
                    return;
                }else{
                    let childDom = dom.querySelector('.el-submenu.is-active')
                    if(childDom){
                        let index = childDom.getAttribute('data-index');
                        this.menuDom.close(index)
                        childDom.click();
                    }
                }
            }
        },
        /**
         * 选择一级菜单，关闭激活的下拉菜单
         */
        selectFirstMenu(){
            let dom = document.querySelector('.first-menu.is-opened')
            if(dom){
                let childDom = dom.querySelector('.el-submenu.is-opened')
                if(childDom){
                    let index = childDom.getAttribute('data-index');
                    this.menuDom.close(index)
                    childDom.click();
                }
                let dataIndex = dom.getAttribute('data-index');
                this.menuDom.close(dataIndex)
            }
        },
        /**
         * 首页设置(APP成人，APP少儿),商品页选择模块进行添加
         */
        chooseModule(obj,item){
            let data = {
                moduleType:obj.type,
                moduleName:item.key
            }
            if(obj.flag=="appAdult"){
                if(!this.homeConfig.adultHomeRender) return;   
                let adultHomeConfig = this.homeConfig.adultHomeConfig.length==0?[]:[...this.homeConfig.adultHomeConfig]
                adultHomeConfig.push(data)
                this.setAdultHomeConfig(adultHomeConfig)
            }else if(obj.flag=='appChild'){
                if(!this.homeConfig.childHomeRender) return;
                let childHomeConfig = this.homeConfig.childHomeConfig.length==0?[]:[...this.homeConfig.childHomeConfig]
                childHomeConfig.push(data)
                this.setChildHomeConfig(childHomeConfig)
            }else if(obj.flag=='goods'){
                if(!this.goodsPage.render) return;
                let config = this.goodsPage.config.length==0?[]:[...this.goodsPage.config]
                config.push(data)
                this.setConfig(config)
            }else if(obj.flag=='wxModel'){
                // let config = this.wxStore.wxModelValeType==''?[]:[...this.goodsPage.config]
                this.setwxModelValeType(item.key);
            }            
        }
    }
};
</script>
<style lang="scss">
    .menu-wrapper{
        i:first-child{
            font-size:28px;
            position: relative;
            top:-2px;
        }
        .is-active{
        i{
            color:#9E0E00!important;
        }
        }
    }
    .clearfix{
        *zoom:1;
    }
    .clearfix:after{
        content: "";
        display: block;
        clear: both;
    }
    .menu-icon{
        font-size: 28px;
        position: relative;
        top: -2px;
    }
    #app .el-submenu .el-menu-item {
        padding: 0 25px 0 45px;
    }
    .is-selected{
        .el-submenu__title{
            padding-left: 40px!important;
            color: rgb(180, 39, 45)!important;
            background-color: #2e2e32!important;
        }
    }
    #app .sidebar-container .el-submenu .el-menu-item.menu-module:hover{
        background:#3A393E!important;
    }
    #app .sidebar-container .second-menu .el-submenu__title{
        padding-left: 80px!important;
        user-select: none; 
    }
    #app .sidebar-container .el-submenu.is-active .second-menu .el-submenu__title{
        background-color: rgb(58, 57, 62)!important;
    }
    #app .sidebar-container .el-submenu.is-active .second-menu.selected .el-submenu__title{
        background-color: #2e2e32!important;
    }
    .menu-wrapper .is-active .second-menu i{
        color:#909399!important;
    }
    .menu-module{
        height: auto!important;
        padding: 0 0px 0 80px!important;
        &.is-active{
            color:rgb(172, 172, 172)!important;
        }
        .des{
            -moz-user-select:none;
            -webkit-user-select:none;
            -ms-user-select:none;
            -khtml-user-select:none;
            user-select:none;
            min-height: 10px;
            i{
                font-size: 14px;
                color:#fff;
                opacity: 0.7;
            }
        }
        .menu-module-list{
            p{
                float: left;
                width: 90px;
                font-size: 13px;
                border:1px solid rgb(172, 172, 172);
                text-align: center;
                line-height: 35px;
                margin-bottom:10px;
                -moz-user-select:none;
                -webkit-user-select:none;
                -ms-user-select:none;
                -khtml-user-select:none;
                user-select:none;
                &:hover{
                    background: #2e2e32;
                }
                &:nth-child(odd){
                    margin-right: 10px;
                }
            }
        }
    }
</style>
