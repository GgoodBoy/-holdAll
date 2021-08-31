<template>
    <div class="page-wrap prohibited-words-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <div class="keyword">
                    <el-input v-model="prohibitedWord"
                        placeholder="请输入关键词查询"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-select v-model="level"
                        clearable
                        placeholder="级别"
                        >
                        <el-option v-for="(item,i) in levelArr"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" :offset="1" v-if="$authJudge('comment:prohibited:select')"><el-button type="primary" @click="search">查询</el-button></el-col>
                <el-col :span="2" :offset="10" v-if="$authJudge('comment:prohibited:add')"><el-button type="primary" @click="dialogData.visible = true">批量添加</el-button></el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="word"
                        label="违禁词"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="levelText"
                        label="级别"
                        align="center"
                        min-width="100"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="匹配次数"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="150">
                            <template slot-scope="scope">
                                <div class="btn-box" v-if="$authJudge('comment:prohibited:delete')">
                                    <el-button size="small" @click="del(scope.row)">删除</el-button>
                                </div>
                            </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
            title="批量添加违禁词"
            :visible.sync="dialogData.visible"
            width="30%"
            custom-class="add-dialog"
            center
            >
            <div>
                <label>级别</label>
                <el-select v-model="dialogData.level"
                    clearable
                    placeholder=""
                    size="small"
                    >
                    <el-option v-for="(item,i) in levelArr"
                        :key="i"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="words-textarea">
                <textarea v-model="textarea" rows="2" @input="getContent" ref="textarea" @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent"></textarea>
                <!-- <p class="words-num">{{length}}/1000</p> -->
            </div>
            <p class="tips">注意：批量添加每次最多不超过1000行。每行一个，每个词最多20个字。</p>
            <div class="btns">
                <el-button type="primary" @click="add">批量添加</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            prohibitedWord:'',
            level:'',
            levelArr:[
                {label:'1级',value:1},
                {label:'2级',value:2},
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            dialogData:{
                visible:false,
                level:'',
            },
            textarea:'',
            disabledState:false,
            oldTextarea:'',
            rows:0,
            pasteFlag:false,
            titleList:[
                {
                    name:'评论管理',
                    pathInfo:''
                },
                {
                    name:'违禁词管理',
                    pathInfo:''
                }                                               
            ]
        };
    },
    metaInfo: {
        title: "违禁词管理"
    },
    components: {
        pagination,breadcrumb
    },
    watch: {
        pageNo(cur,old){
            if(cur>=1){
                this.prohibitedWordList();
            }
        },
    },
    computed:{
        length(){
            return this.textarea.replace(/\n+/g, "").length
        },
    },
    created() {
       this.prohibitedWordList()
    },
    methods: {
        /**
         * 获取列表数据
         */
        prohibitedWordList(){
            this.loading = true;
            let query = {
                params:{
                    level:this.level,
                    prohibitedWord:this.prohibitedWord,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.prohibitedWordList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.list.map((item,index)=>{
                        item.levelText = this.levelArr.find(option=>option.value==item.level).label;
                        if(res.content.pageNum==1){
                            item.sortId = index+1;
                            return item;
                        }else if(res.content.pageNum>1){
                            item.sortId = (res.content.pageNum-1)*10+index+1;
                            return item;
                        }
                    })
                    this.total = res.content.total;
                }
            })
        },
        /**
         * 搜索
         */
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        /**
         * 获取内容
         */
        getContent(){
            if(this.pasteFlag){
                this.pasteFlag = false;
                let temp = this.textarea.split('\n').map(item=>{
                    return item.length>20?item.substr(0,20):item
                })
                this.textarea = this.oldTextarea = temp.join('\n');
                this.$nextTick(()=>{
                    this.getRows()
                })
                return false;
            }
            let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
            let arr = this.textarea.split('\n');
            if(arr[index]&&arr[index].length>20){
                this.textarea = this.oldTextarea
                this.$nextTick(()=>{
                    this.getRows()
                })
                return;
            }
            this.oldTextarea = this.textarea;
        },
        /**
         * 根据光标获取行数 （鼠标点击）
         */
        getRows(){
            let index = this.getCursortPosition(this.$refs.textarea)
            let temp = this.textarea.substr(0,index)
            this.rows = temp.split('\n').length
        },
        /**
         * 根据光标获取行数 （键盘回车，上移下移左移右移）
         */
        keyDownEvent(e){
            let code = [8,13,37,38,39,40]
            if(code.includes(e.keyCode)){
                setTimeout(()=>{
                    let index = this.getCursortPosition(this.$refs.textarea)
                    let temp = this.textarea.substr(0,index)
                    this.rows = temp.split('\n').length
                },1)
            }
        },
        /**
         * 获取光标的位置
         */
        getCursortPosition(dom){
            var cursorIndex = 0;
            if (document.selection) {
                dom.focus();
                var range = document.selection.createRange();
                range.moveStart('character', -dom.value.length);
                cursorIndex = range.text.length;
            } else if (dom.selectionStart || dom.selectionStart==0) {
                cursorIndex = dom.selectionStart;
            }
            return cursorIndex;
        },
        /**
         * 粘贴事件
         */
        pasteEvent(){
            this.pasteFlag = true
        },
        /**
         * 取消
         */
        cancel(){
            // this.oldTextarea = this.textarea = '';
            this.dialogData.visible = false;
        },
        add(){
            var self = this;
            if(this.dialogData.level==''){
                this.$message.error('请选择禁用词级别');
                return;
            }
            if(this.textarea.length==''){
                this.$message.error('请输入违禁词');
                return;
            }
            if(this.textarea.split('\n').length>1000){
                this.$message.error('你本次导入超过1000行，请修改');
                return;
            }
            let temp = this.textarea.split('\n');
            let index = temp.findIndex(item=>item.trim().length === 0)
            if(index>=0){
                let msg = `第${index+1}全为空格，请修改为再次导入`
                this.$message.error(msg);
                return;
            }
            let query = {
                level:this.dialogData.level,
                prohibitedWords:this.textarea
            }
            if(!self.disabledState){
                self.disabledState = !self.disabledState;              
                this.$http.post(this.$server.prohibitedWordAdd,query).then(res=>{
                    if(res.status==200){
                        this.dialogData = {
                            visible:false,
                            level:''
                        }
                        self.disabledState = !self.disabledState;
                        this.oldTextarea = this.textarea = ''
                        this.search()
                    }
                }).catch(()=>{
                        self.disabledState = !self.disabledState;
                    })
            }
        },
        del(obj){
            this.$confirm('确认删除该违禁词？', '提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                }).then(() => {
                    this.$http.delete(`${this.$server.prohibitedWordDel}/${obj.id}`).then(res=>{
                        if(res.status==200){
                            this.search()
                        }
                    })
                }).catch(() => {
            });
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
    }
    .search-form {
        width: 100%;
        margin-right: 10px;
        position: relative;
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editor-btn {
            color:#9E0E00;
            font-size: 14px;
            padding: 0;
            height: 36px;
            line-height: 36px;
        }
        .block{
            text-align: center;
            margin-top:60px;
            padding-bottom:60px;
        }
    }
    .add-dialog{
        min-width: 400px;
        .el-select{
            margin-left: 10px;
            width: 100px;
        }
        .words-textarea{
            margin:10px 0;
            position: relative;
            textarea{
                height: 250px!important;
                resize: none!important;
                display: block;
                width: 100%;
                border-radius: 5px;
                border-color:#ddd;
                padding: 25px;
                line-height: 20px;
            }
            .words-num{
                position: absolute;
                font-size: 14px;
                color:#666;
                right:10px;
                bottom:10px;
            }
        }
        .tips{
            font-size: 12px;
            margin:10px 0;
            color:#999;
        }
    }
</style>
<style lang="scss">
    .prohibited-words-wrap{
        .add-dialog{
            min-width: 550px;
        }
    }
</style>

