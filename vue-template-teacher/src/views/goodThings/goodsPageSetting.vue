<template>
    <div class="adult-home-setting clearfix">
        <!-- <div class="tabs">
            <div class="box">
                <div v-for="(item,index) in editData" :key="index" class="item" :class="item.active?'active':''" @click="switchTab(item)">
                    <el-dropdown size="small" placement="bottom-start">
                        <p class="el-dropdown-link">
                            <i class="el-icon-sort prev" v-if="$authJudge('homeset:appadult:sort')" v-show="editData.length>1&&index>0" @click.stop="cloumnSort(item,'prev')"></i>
                            <span>{{item.tabName}}</span>
                            <i class="el-icon-sort next" v-if="$authJudge('homeset:appadult:sort')" v-show="editData.length>1&&index<editData.length-1" @click.stop="cloumnSort(item,'next')"></i>
                        </p>
                        <el-dropdown-menu slot="dropdown" v-if="$authJudge('homeset:appadult:delcolumn')||$authJudge('homeset:appadult:editcolumn')">
                            <el-dropdown-item v-if="$authJudge('homeset:appadult:delcolumn')" @click.native="delColumn(item,index)">删除</el-dropdown-item>
                            <el-dropdown-item v-if="$authJudge('homeset:appadult:editcolumn')" @click.native="openCloumnNameDialog(item)">修改</el-dropdown-item>
                        </el-dropdown-menu>  
                    </el-dropdown>
                </div>
            </div>
            <div class="add" v-if="$authJudge('homeset:appadult:addcolumn')">
                <el-button type="primary" @click="openCloumnNameDialog()">添加栏目</el-button>
            </div>
        </div> -->
        <div class="left-box" :class="focusFlag?'in-edit':''">
            <div class="mobile" ref="view" id="wrapper">
                <div class="scroll" ref="scroll">
                   <components v-for="(item,index) in curEditData" :key="index" :is="item.moduleName" :moduleData="item" ref="myModule" @click.native="chooseModule(item,index)" @mousedown.native="myMousedown($event)" @mouseup.native="myMouseup" ></components>
                </div>
            </div>        
            <div class="module-edit-btns">
                <p v-if="$authJudge('goodsthings:goodspage:upmodule')" @click="sortUp" :class="moveUp?'allow-move-up':''"><i class="el-icon-caret-top"></i><span>上移</span></p>
                <p v-if="$authJudge('goodsthings:goodspage:downmodule')" @click="sortBottom" :class="moveDown?'allow-move-down':''"><i class="el-icon-caret-bottom"></i><span>下移</span></p>
                <p v-if="$authJudge('goodsthings:goodspage:delmodule')" @click="delModule"><i class="el-icon-delete"></i><span>删除</span></p>
            </div>
            <div class="btns" v-if="curEditData.length>0||delLastFlag">
                <div v-if="focusFlag||delLastFlag">
                    <el-button v-if="$authJudge('goodsthings:goodspage:savesort')" size="medium" type="primary" @click="saveAppHomeData">保存</el-button>
                    <el-button size="medium" @click="cancelEdit">取消</el-button>
                </div>
            </div>
        </div>
        <div class="right-box handle">
            <transition mode="out-in">
                <component :is="curEdit" v-if="curEdit!=''" :settingType="'1'"></component>
            </transition>
        </div>
        <el-dialog :custom-class="'mod-column-name'" :visible.sync="editDialogVisible" :width="'300px'" :show-close="false" top="30vh">
            <p class="edit-cloumn-title">{{cloumnFlag=='add'?'添加栏目名称':'修改栏目名称'}}</p>
            <div class="cloumn-name-input">
                <el-input placeholder="输入栏目名称" size="medium" clearable v-model="cloumnNameVal" maxlength="6" @keydown.native="keyEvent($event)"></el-input>
                <p class="error" v-show="errorText.length>0">{{errorText}}</p>
            </div>
            <el-button type="primary" class="cloumn-name-btn" @click="editCloumnName" size="medium">确定</el-button>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>
    </div>    
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Banner from './components/banner'//banner展示
import BannerEdit from './components/bannerEdit'//banner编辑
import Goods from './components/goods'//商品
import GoodsEdit from './components/goodsEdit'//商品编辑
let firstTime = 0,lastTime = 0,moveFlag = false,clickFlag = false,mousedownFlag = false,startY = 0;
const regExp = /^[A-Za-z0-9\u4e00-\u9fa5]+$/  //数字、字母、汉字
// const reg = /[^A-Za-z0-9\u4E00-\u9FA5]/g //除了数字、字母、汉字
const subModule = [
    {type:1,val:'banner'},{type:2,val:'goods'}
]
export default {
    data(){
        return{
            localIndex:-1,
            myscroll:'',
            timer:null,//滚动动画计时器
            originalData:[],//首页原始数据
            curEdit:'',//当前模块编辑栏
            cloumnNameVal:'',
            cloumnName:'',//栏目名称
            cloumnId:'',//栏目id
            editCloumnId:'',
            cloumnFlag:'',//添加or编辑
            tempTabId:0,//临时添加的tabId,用于添加虚拟的tabId
            editDialogVisible:false,
            errorText:'',
            delModuleArr:[],
            editDataArr:[],
            delLastFlag:false,//是否删除了最后一个模块
            dialogVisible:false,//离开确认框
            editFlag:false,//是否动了数据,
            leavePath:'',//离开的path
            leaveFlag:false,//离开的flag
        }
    },
    computed:{
        /**
         * 左侧首页编辑数据()
         */
        editData(){
            return this.$store.state.goodsPage.editData;
        },
        /**
         * 左侧首页当前编辑数据
         */
        curEditData(){
            return this.editData.length>0?this.editData.find(item=>item.active==true).data:[]
        },
        /**
         * 导航菜单模块配置数据
         */
        config(){
            return this.$store.state.goodsPage.config;
        },
        /**
         * 右侧模块数据
         */
        moduleChildData(){
            return this.$store.state.goodsPage.moduleChildData;
        },
        focusFlag(){
            return this.curEditData.some(item=>item.isFocus==true)
        },
        style(){
            let cur = this.curEditData.find(item=>item.isFocus==true)
            if(cur){
                let obj = this.$store.state.goodsPage.moduleChildData.find(item=>item.localId==cur.localId);
                return obj?obj.style:''
            }
        },
        moveUp(){
            let index = this.curEditData.findIndex(item=>item.isFocus==true)
            return index==0?false:true;
        },
        moveDown(){
            let index = this.curEditData.findIndex(item=>item.isFocus==true)
            return (index==0&&this.curEditData.length==1)||(index==this.curEditData.length-1)?false:true;
        },
        homeCloumnId(){
            return this.$store.state.goodsPage.homeCloumnId;
        }
    },
    components:{
        'banner':Banner,
        'bannerEdit':BannerEdit,
        'goods':Goods,
        'goodsEdit':GoodsEdit
    },
    watch:{
        config(cur,old){
            if(cur.length>0){
                this.addModule(cur[cur.length-1])
            }
        },
        style(cur,old){
            setTimeout(()=>{
                if(this.myscroll!='')
                    this.myscroll.refresh()
            },500)
        },
        homeCloumnId(cur,old){
            if(cur>=0){
                this.cloumnId = cur;
                let obj = this.editData.find(item=>item.active==true)
                obj.tabId = cur;
                this.cloumnName = obj.tabName;
                this.setCloumnId(-1);
            }
        }
    },
    beforeRouteLeave (to, from, next){
        this.leavePath = to.fullPath;
        if(this.leaveFlag){
            this.setRender(false)
            this.curEdit = ''
            this.editFlag = false;
            this.setConfig([])
            this.setEditData([])
            this.setModuleChildData([])
            next();
            return;
        }
        let index = this.moduleChildData.findIndex(item=>item.inEdit==true);
        if(index>=0||this.editFlag){
            this.dialogVisible = true;
            next(false);
            return;
        }
        
        this.curEdit = ''
        this.editFlag = false;
        this.setRender(false)
        this.setConfig([])
        this.setEditData([])
        this.setModuleChildData([])
        next()
    },
    created(){
        // this.iframeUrl = process.env.NODE_ENV == 'production'? (process.env.argv=='beta'?'https://scm.youfushuyuan.com':'https://xgxm.xueguoxue.com') : 'https://scm.youfushuyuan.com';
    },
    mounted(){
        this.getAllGoodsPageInfo()
        this.$refs.view.addEventListener('mousemove',(e)=>{
            if(!mousedownFlag) return;
            if(Math.abs(e.clientY - startY)>5){
                moveFlag = true
            }
        })
    },
    methods:{
        ...mapActions(['setConfig','setEditData','setModuleChildData','setRender','setCloumnId']),
        /**
         * 滚动动画
         * element 元素
         * to 位置
         * duration 动画时长
         */
        scrollToTop(element, to, duration) {
            if (duration <= 0) return;
            const diff = to - element.scrollTop;
            const perTick = diff / duration * 10;
            this.timer = setTimeout(() => {
                element.scrollTop += perTick;
                if (element.scrollTop === to) return;
                this.scrollToTop(element, to, duration - 10);
            }, 10);
        },
        
        getAllGoodsPageInfo(){
            let query = {
                params:{}
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.left-box')
            });
            this.$http.get(this.$server.goodsGetAllGoodsPageInfo,query).then(res=>{
                if(res.status==200){
                    loadingInstance.close();
                    this.setRender(true)
                    if(res.content.length>0){
                        let curEditData = [],moduleChildData = [];
                        let i = this.editData.findIndex(item=>item.active==true);
                        let temp = this.editData.find(item=>item.active==true);
                        res.content.forEach((item,index)=>{
                            let obj = subModule.find(option=>option.type==item.subModuleType);
                            if(obj){
                                curEditData.push({
                                    moduleName:obj.val,
                                    isFocus:false,
                                    localId:`${i}-${index}`,
                                    id:item.id
                                })
                                moduleChildData.push({
                                    localId:`${i}-${index}`,
                                    id:item.id,
                                    data:[],
                                    name:item.moduleName,
                                    style:item.style,
                                    inEdit:false,
                                    subType:this.cloumnId
                                })
                            }
                        })
                        if(!temp){
                            let editData = [
                                {data:curEditData,active:true}
                            ]
                            this.setEditData(editData);
                        }else{
                            temp.data = curEditData
                            this.setEditData(this.editData);
                        }
                        this.localIndex = res.content.length-1;
                        this.setModuleChildData(moduleChildData);
                    }else{
                        this.setEditData([{data:[],active:true}]);
                    }
                    this.$nextTick(()=>{
                        if(this.myscroll==''){
                            this.myscroll = new iScroll("wrapper",{
                                'bounce':false
                            })
                        }else{
                            this.myscroll.refresh()
                        }
                    })
                    this.delLastFlag = false;
                }
            })
        },
        /**
         * 栏目排序
         */
        cloumnSort(obj,flag){
            let tempIndex = this.editData.findIndex(item=>item.tabId==obj.tabId);
            let tempArr = flag=='prev'?[this.editData[tempIndex-1],obj]:[this.editData[tempIndex+1],obj];
            let temp = tempArr.find(item=>item.data.length==0&&item.tabId<0)
            if(temp){
                this.$message.error(`栏目'${temp.tabName}'无效，请添加并保存数据后再排序`)
                return;
            }else{
                let tabName = ''
                tempArr.forEach(item=>{
                    let flag = item.data.some(option=>option.isFocus==true);
                    if(flag){
                        tabName = item.tabName;
                    }
                })
                if(tabName!=''){
                    this.$message.error(`栏目'${tabName}'无效，请添加并保存数据后再排序`)
                    return;
                }
            }
            let query = {
                    
            }
            let tempObj = flag=='prev'?this.editData[tempIndex-1]:this.editData[tempIndex + 1];
            query['sorts[0].id'] = obj.tabId;
            query['sorts[0].sort'] = tempObj.sort;
            query['sorts[1].id'] = tempObj.tabId;
            query['sorts[1].sort'] = obj.sort;
            let loadingInstance = this.$loading({
                target:document.querySelector('.adult-home-setting')
            });
            this.$http.post(this.$server.columnInfoSort,query).then(res=>{
                loadingInstance.close()
                if(res.status==200){
                    if(flag=='prev'){
                        let t_index = this.editData[tempIndex].sort;
                        this.editData[tempIndex].sort = tempObj.sort;
                        tempObj.sort = t_index;
                        this.$set(this.editData, tempIndex - 1, this.editData[tempIndex]);
                        this.$set(this.editData, tempIndex, tempObj)
                    }else{
                        let t_index = this.editData[tempIndex].sort;
                        this.editData[tempIndex].sort = tempObj.sort;
                        tempObj.sort = t_index;
                        this.$set(this.editData, tempIndex + 1, this.editData[tempIndex])
                        this.$set(this.editData, tempIndex, tempObj)
                        
                    }
                }
            }).catch(()=>{
                loadingInstance.close()
            })
        },
        /**
         * 打开编辑/添加栏目弹窗
         */
        openCloumnNameDialog(obj){
            if(obj){
                this.cloumnNameVal = obj.tabName;
                // this.cloumnId = obj.tabId;
                this.cloumnFlag = 'edit';
                this.editDialogVisible = true;
                this.errorText = ''
                this.editCloumnId = obj.tabId
                console.log(this.editCloumnId)
            }else{
                let obj = this.editData.find(item=>item.active==true)
                if(obj&&obj.data.length==0){
                    this.$message.error('请先添加当前栏目的模块数据');
                    return;
                }
                if(this.focusFlag){
                    this.$message.error('请先保存当前栏目的模块数据');
                    return;
                }
                this.cloumnNameVal = '';
                this.cloumnFlag = 'add';
                this.editDialogVisible = true;
                this.errorText = ''
            }
        },
        /**
         * 编辑/添加栏目名称
         */
        editCloumnName(){
            this.errorText = '';
            let regExp = /^[\u4e00-\u9fa5]+$/
            if(this.cloumnName==''){
                this.errorText = '栏目名称不能为空！'
                return;
            }
            // if(!regExp.test(this.cloumnName)){
            //     this.errorText = '只能输入汉字！'
            //     return;
            // }
            if(this.cloumnFlag=='add'){
                this.tempTabId--;
                let temp = [...this.editData]
                temp.forEach(item=>item.active=false)
                temp.push({
                    tabId:this.tempTabId,
                    tabName:this.cloumnNameVal,
                    data:[],
                    active:true
                })
                this.cloumnName = this.cloumnNameVal;
                this.cloumnId = this.tempTabId;
                this.curEdit = '';
                this.setEditData(temp)
                this.setModuleChildData([])
                this.editDialogVisible = false;
            }else{
                let loadingInstance = this.$loading({
                    target:document.querySelector('.mod-column-name')
                });
                let query = {
                    id:this.editCloumnId,
                    name:this.cloumnNameVal
                }
                this.$http.post(this.$server.modColumnName,query).then(res=>{
                    loadingInstance.close();
                    if(res.status==200){
                        let obj = this.editData.find(item=>item.tabId==this.editCloumnId)
                        obj.tabName = this.cloumnNameVal
                        this.cloumnName = this.cloumnNameVal;
                        this.editDialogVisible = false;
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                    }
                }).catch(()=>{
                    loadingInstance.close();
                })
            }
        },
        keyEvent(e){
            if(e.keyCode==13){
                this.editCloumnName()
            }
        },
        /**
         * 切换tab
         */
        switchTab(obj){
            if(this.moduleChildData.length==0){
                this.$message.error('当前栏目没有模块数据，请添加模块或者删除栏目后再切换！')
                return;
            }
            let index = this.moduleChildData.findIndex(item=>item.inEdit==true&&item.subType==this.cloumnId)
            if((index==-1&&this.focusFlag)||this.delLastFlag||index>=0){
                this.$confirm('当前栏目模块没有保存，请先保存！若未保存且切换至其他栏目，当前栏目数据将失效，是否切换？', '切换确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.cloumnId = obj.tabId;
                    this.cloumnName = obj.tabName;
                    this.curEditData.forEach(item=>item.isFocus=false);
                    this.editData.forEach(item=>{
                        item.active = false;
                        // item.data = [];
                    })
                    obj.active = true;
                    
                    this.curEdit = ''
                    this.$nextTick(()=>{
                        if(this.myscroll!='')
                            this.myscroll.refresh()
                        let activeObj = this.curEditData.find(item=>item.isFocus==true);
                        if(activeObj){
                            for(let item of this.$refs.myModule){
                                if(item.moduleData.isFocus){
                                    clickFlag = true;
                                    item.$el.click();
                                    if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                                        this.myscroll.scrollToElement(item.$el,300)    
                                    }
                                    break;
                                }
                            }
                        }else{
                            this.getAppHomePage()
                        }
                    }) 
                }).catch(()=>{

                })
                return;
            }
            this.cloumnId = obj.tabId;
            this.cloumnName = obj.tabName;
            this.editData.forEach(item=>{
                item.active = false;
                // item.data = []
            })
            obj.active = true;
            this.curEdit = ''
            this.$nextTick(()=>{
                if(this.myscroll!='')
                    this.myscroll.refresh()
                let activeObj = this.curEditData.find(item=>item.isFocus==true);
                // console.log(activeObj)
                if(activeObj){
                    for(let item of this.$refs.myModule){
                        if(item.moduleData.isFocus){
                            clickFlag = true;
                            item.$el.click();
                            if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                                this.myscroll.scrollToElement(item.$el,300)    
                            }
                            break;
                        }
                    }
                }else{
                    this.getAppHomePage()
                }
            }) 
        },
        /**
         * 点击左侧菜单栏，添加模块
         */
        addModule(myModule){
            let { moduleType , moduleName } = myModule;
            this.curEditData.forEach(item=>{
                item.isFocus = false;
            })
            this.localIndex++;
            let i = this.editData.findIndex(item=>item.active==true);
            let localId = `${i}-${this.localIndex}`;
            if(moduleName =='goods'){
                let obj = this.curEditData.find(item=>item.moduleName==moduleName)
                if(obj){
                    obj.isFocus = true;
                    for(let item of this.$refs.myModule){
                        if(item.moduleData.isFocus){
                            clickFlag = true;
                            item.$el.click();
                            if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                                this.myscroll.scrollToElement(item.$el,300)
                            }
                            break;
                        }
                    }
                    return;
                }else{
                    this.addModuleHandle(moduleName,localId)  
                }
            }else{
                this.addModuleHandle(moduleName,localId)
            }
        },
        /**
         * 添加模块操作
         */
        addModuleHandle(moduleName,localId){
            this.curEditData.push(
                {moduleName,isFocus:true,localId,id:-1}
            )
            this.moduleChildData.push(
                {localId,id:'-1',data:[],name:'',style:1,inEdit:true,subType:this.cloumnId}
            )
            this.$nextTick(()=>{
                for(let item of this.$refs.myModule){
                    if(item.moduleData.isFocus){
                        clickFlag = true;
                        item.$el.click();
                        this.myscroll.refresh();
                        setTimeout(()=>{
                            this.myscroll.refresh()
                            if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                                this.myscroll.scrollToElement(item.$el,300)
                            }
                        },100)
                        break;
                    }
                }
            })
        },  
        /**
         * 退出编辑状态
         */
        cancelEdit(){
            this.$confirm('确定要取消所有操作吗？', '取消确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.setRender(false)
                this.curEdit = ''
                this.editFlag = false;
                this.setConfig([])
                this.setModuleChildData([])
                this.getAllGoodsPageInfo();
            }).catch(()=>{

            })
           
        },
         /**
         * 鼠标按下
         */
        myMousedown(e){
            mousedownFlag = true;
            startY = e.clientY;
            clickFlag = false;
            moveFlag = false;
            firstTime = new Date().getTime();
        },
        /**
         * 鼠标抬起
         */
        myMouseup(){
            mousedownFlag = false;
            lastTime = new Date().getTime();
            if(moveFlag){
                clickFlag = false;
                return;
            }
            if((lastTime - firstTime) < 300){
                clickFlag = true;
            }
        },
        /**
         * 选择模块
         */
        chooseModule(myModule,index){
            if(!clickFlag)return;
            this.curEdit = ''
            this.curEditData.forEach(item=>item.isFocus=false)
            myModule.isFocus=true;
            this.$nextTick(()=>{
                this.curEdit = `${myModule.moduleName}Edit`
            })
        },
        /**
         * 删除栏目
         */
        delColumn(obj,index){
            if(this.editData.length<=1){
                this.$message.error('至少保留一个栏目');
                return false;
            }
            let temp = this.editData.filter(item=>item.tabId!='');
            this.$confirm('确定要删除这个栏目吗？', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                closeOnPressEscape:false,
            }).then(() => {
                if(obj.tabId==''){
                    let localId = obj.localId;
                    let i = this.moduleChildData.findIndex(item=>item.localId==localId);
                    this.moduleChildData.splice(i,1);
                    if(obj.active){
                        let activeIndex = index==0?1:index-1;
                        obj.active = false;
                        this.editData[activeIndex].active = true;
                        document.querySelectorAll('.tabs .item')[activeIndex].click()
                    }
                    this.$nextTick(()=>{
                        this.editData.splice(index,1);
                    })
                }else{
                    if(temp.length==1){
                        this.$message.error('至少保留一个真实栏目');
                    }else{
                        let loadingInstance = this.$loading({
                            target:document.querySelector('.adult-home-setting')
                        });
                        let query = {
                            id:obj.tabId,
                            type:1
                        }
                        this.$http.post(this.$server.delColumnInfo,query).then(res=>{
                            loadingInstance.close()
                            if(res.status==200){
                                this.setRender(false)
                                this.curEdit = '';
                                this.editFlag = false;
                                this.setConfig([])
                                this.setEditData([])
                                this.setModuleChildData([])
                                this.getAllGoodsPageInfo();
                                this.$message.success('栏目删除成功');
                            }
                        }).catch(()=>{
                            loadingInstance.close()
                        })
                    }
                }
            }).catch(()=>{

            })
        },
        /**
         * 删除模块
         */
        delModule(){
            this.$confirm('确定要删除这个模块吗？', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                let index = this.curEditData.findIndex(item=>item.isFocus==true)
                let obj = this.curEditData.find(item=>item.isFocus==true)
                let prevDom = ''
                for(let item of this.$refs.myModule){
                    if(item.moduleData.isFocus){
                        prevDom =index>0?item.$el.previousSibling:''   
                        break;
                    }
                }
                let editData = this.moduleChildData.find(item=>item.localId==obj.localId)
                let _index = this.moduleChildData.findIndex(item=>item.localId==obj.localId)
                editData.inEdit = false;
                if(this.curEditData[index].id){
                    this.delModuleArr.push(this.curEditData[index].id)
                }
                this.curEditData.splice(index,1)
                this.moduleChildData.splice(_index,1)
                clickFlag = true;
                this.$nextTick(()=>{
                    if(index==0){
                        if(this.curEditData.length==0){
                            this.delLastFlag = true;
                        }else{
                            this.$refs.myModule[0].$el.click()
                        }                       
                    }else{
                        if(prevDom!='')
                            prevDom.click()
                    }
                    if(this.myscroll!='')
                        this.myscroll.refresh()
                })
                this.editFlag = true;
            }).catch(() => {
       
            });
        },
        /**
         * 上移
         */
        sortUp(){
            let index = this.curEditData.findIndex(item=>item.isFocus==true)
            let obj = this.curEditData.find(item=>item.isFocus==true)
            let localId = obj.localId;
            if(index==0) return;
            var temp = this.curEditData[index - 1];
            this.$set(this.curEditData, index - 1, this.curEditData[index]);
            this.$set(this.curEditData, index, temp)
            this.moduleChildData.find(item=>item.localId==localId).compareFlag = true
            this.editFlag = true;
            setTimeout(()=>{
                for(let item of this.$refs.myModule){
                    if(item.moduleData.isFocus){
                        this.myscroll.scrollToElement(item.$el,300);
                        break;
                    }
                }
            },300)
        },
        /**
         * 下移
         */
        sortBottom(){
            let index = this.curEditData.findIndex(item=>item.isFocus==true)
            let obj = this.curEditData.find(item=>item.isFocus==true)
            let localId = obj.localId;
            if((index==0&&this.curEditData.length==1)||index==this.curEditData.length-1) return;
            let temp = this.curEditData[index + 1];
            this.$set(this.curEditData, index + 1, this.curEditData[index])
            this.$set(this.curEditData, index, temp)
            this.moduleChildData.find(item=>item.localId==localId).compareFlag = true;
            this.editFlag = true;
            setTimeout(()=>{
                for(let item of this.$refs.myModule){
                    if(item.moduleData.isFocus){
                        this.myscroll.scrollToElement(item.$el,300);
                        break;
                    }
                }
            },300)
        },
        /**
         * 保存首页模块
         */
        saveAppHomeData(){
            let obj = this.moduleChildData.find(item=>item.inEdit==true)
            if(obj){
                let myModule = this.curEditData.find(item=>item.localId==obj.localId)
                // let index = this.curEditData.findIndex(item=>item.localId==obj.localId)
                this.curEditData.forEach(item=>item.isFocus=false)
                myModule.isFocus=true;
                for(let item of this.$refs.myModule){
                    if(item.moduleData.isFocus){
                        clickFlag = true;
                        item.$el.click();
                        if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                            this.myscroll.scrollToElement(item.$el,300)
                        }
                        break;
                    }
                }
                this.$message.error('您还有未添加的数据，不能保存')
                return;
            } 
            let goods = this.curEditData.findIndex(item=>item.moduleName=='goods')
            if(goods>=0){
                if(goods!=this.curEditData.length-1){
                    let freeCourseModule = this.curEditData.find(item=>item.moduleName=='goods')
                    this.curEditData.forEach(item=>item.isFocus=false)
                    freeCourseModule.isFocus=true;
                    for(let item of this.$refs.myModule){
                        if(item.moduleData.isFocus){
                            clickFlag = true;
                            item.$el.click();
                            if(this.$refs.scroll.clientHeight>this.$refs.view.clientHeight){
                                this.myscroll.scrollToElement(item.$el,300)
                            }
                            break;
                        }
                    }
                    this.$message.error('国学好物模块只能在最底部，请排序后保存！')
                    return;
                }
            }
            let query = {
                delModuleIds:this.delModuleArr.join(','),
            }
            this.curEditData.forEach((item,index)=>{
                query['goodsPageInfoFormList['+index+'].id'] = item.id;
                query['goodsPageInfoFormList['+index+'].sort'] = index+1;
            })
            this.$http.post(this.$server.goodsSaveSubModuleSort,query).then(res=>{
                if(res.status==200){
                    this.setRender(false)
                    this.curEdit = '';
                    this.editFlag = false;
                    this.setConfig([])
                    this.setModuleChildData([])
                    this.getAllGoodsPageInfo()
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                }
            })
        },
        /**
         * 离开页面
         */
        leavePage(){
            this.leaveFlag = true;
            this.dialogVisible = false;
            setTimeout(()=>{
                this.$router.push(this.leavePath)
            },1)
        }
    },
    beforeDestroy(){
        this.setRender(false)
    }
}
</script>
<style lang="scss" scoped>
    .adult-home-setting{
        height: calc(100vh - 120px);
        .title{
            line-height: 50px;
            padding:  0 10px;
            background: #fff;
            font-size: 18px;
        }
        .tabs{
            background: #fff;
            font-size: 0;
            margin:20px 0;
            position: relative;
            padding-right: 110px;
            .box{
                display:flex;
                overflow-x:scroll;
            }
            .item{
                line-height: 40px;
                font-size: 14px;
                flex:none;
                padding: 0 20px;
                text-align: center;
                color:#000;
                display: inline-block;
                position: relative;
                vertical-align: middle;
                background: #fff!important;
                border:none!important;
                cursor: pointer;
                z-index: 1;
                &:hover{
                    z-index: 3;
                    .prev,.next{
                        opacity: 1;
                        cursor: pointer;
                    }
                }
                .el-dropdown{
                    span{
                        display: inline-block;
                    }
                }
                p{
                    cursor: default;
                    display: inline-block;
                }
                &.active{
                    .el-dropdown{
                        border-bottom:2px solid #9E0E00;
                    }
                }
                .el-dropdown-link{
                    position: relative;
                    i{
                        position: absolute;
                        transform: rotate(90deg);
                        font-size:20px;
                        top:10px;
                        color:#9E0E00;
                        z-index: 2;
                        opacity: 0;
                        transition:opacity 0.3s;
                        &.prev{
                            left:-30px;
                        }
                        &.next{
                            right:-30px;
                        }
                    }
                }
            }
            .add{
                position: absolute;
                right: 10px;
                top:6px;
            }
        }
        .left-box{
            width: 375px;
            height: 100%;
            float: left;
            background: #F4F4F4;
            padding: 0px 0px 45px 0px;
            margin-right: 20px;
            position: relative;
            transition: all 0.3s;
            &.in-edit{
                margin-right: 50px;
                .module-edit-btns{
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .mobile{
                height: 100%;
                overflow:hidden;
                position: relative;
                z-index: 2;
                // background: #fff;
                &::-webkit-scrollbar{
                    display: none;
                }
            }
            .module-edit-btns{
                width: 40px;
                padding: 10px 0;
                position: absolute;
                right:-45px;
                top:35%;
                text-align: center;
                z-index: 1;
                transform: translateX(-50px);
                opacity: 0;
                transition: all 0.3s;
                >p{
                    margin:5px 0;
                    cursor: not-allowed;
                    background: #fff;
                    padding: 3px 0;
                    border-radius: 5px;
                    &.allow-move-up,&.allow-move-down{
                        cursor: pointer;
                    }
                    &:last-child{
                        cursor: pointer;
                    }
                }
                span{
                    display: block;
                    font-size: 14px;
                    color:rgb(180, 39, 45);
                    margin-top:-2px;
                }
                i{
                    font-size: 22px;
                    color:rgb(180, 39, 45);
                }
            }
            .btns{
                position: absolute;
                bottom:5px;
                left: 0;
                width: 100%;
                text-align: center;
            }
            .module{
                transition: all 0.3s;
                cursor:url('../../assets/images/cursor.png'),auto!important;
                margin:15px 0;
                position: relative;
                &.is-focus{
                    &::after{
                        content:'';
                        width: 100%;
                        height: 100%;
                        border:1px solid #e32513;
                        top:0;
                        left: 0;
                        position: absolute;
                        font-size: 0;
                    }
                }
                &:first-child{
                    margin:0 0 15px 0;
                }
            }
            .scroll{
                padding-bottom:15px;
                cursor:url('../../assets/images/cursor.png'),auto;
            }
        }
        .right-box{
            overflow: hidden;
            padding:10px;
            height: 100%;
            background: #fff;
            .module-edit{
                min-width: 500px;
            }
        }
        .cloumn-name-input{
            display: inline-block;
            vertical-align: top;
            width: 60%
        }
        .cloumn-name-btn{
            display: inline-block;
            margin-left: 20px;
            vertical-align: top;
        }
        .edit-cloumn-title{
            font-size: 16px;
            position: absolute;
            top:20px;
            left: 20px;
        }
        .error{
            padding: 5px;
            color:#e32513;
        }
    }
    .v-enter,.v-leave-to{
        opacity: 0;
    }
    .mobile-site{
        position: fixed;
        top:0;
        left: 0;
        background: rgba(0,0,0,0.7);
        width: 100%;
        height: 100%;
        z-index: 9999;
        .iframe-box{
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            height: 736px;
            width: 414px;
            background: #f9f9fb;
        }
    }
</style>
<style lang="scss">
.list-item-radio{
    .el-radio__label{
        display: inline-block!important;
        vertical-align: middle!important;
    }
    .el-radio__inner{
        width: 18px!important;
        height: 18px!important;
    }
}
</style>