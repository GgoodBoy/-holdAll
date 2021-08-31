<template>
  <div class="editor-wrapper">
      <p class="content-length">{{length}}/{{maxLength}}</p>
    <!-- 图片上传组件辅助-->
    <el-upload
      class="editor-uploader"
      :action="serverUrl"
      name="file"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeImgUpload"
    ></el-upload>
    <el-dialog
        title="外部链接"
        :visible.sync="dialogVisible"
        custom-class="link-dialog"
        width="516px"
        >
        <div class="link-item">
            <label>链接文字</label>
            <el-input placeholder="请输入50字以内链接文字" v-model="linkText" maxlength="50"></el-input>
        </div>
        <div class="link-item">
            <label>链接地址</label>
            <el-input placeholder="请输入合法的链接地址" v-model="linkUrl"></el-input>
        </div>
        <p class="tips">您输入的超链接中不包含http等协议名称，默认将为您添加http://前缀</p>
        <p class="error" :class="errorText.length>0?'show':''">{{errorText}}</p>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="getLink">确 定</el-button>
        </span>
    </el-dialog>

    <quill-editor
      class="editor ql-editor"
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
  </div>
</template>
<script>
import { getToken} from '@/utils/auth';
import { quillEditor } from "vue-quill-editor";
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import * as Quill from 'quill';
// var fonts = ['SimSun', 'SimHei','Microsoft-YaHei','KaiTi','FangSong','Arial','sans-serif'];  
// var Font = Quill.import('formats/font');  
// Font.whitelist = fonts;
// Quill.register(Font, true);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize)
// 工具栏配置
const toolbarOptions = [
    [{ header: 1 },"bold","blockquote",{ list: "bullet" },{ list: "ordered" },"divider","code-block",{ color: [] }, { background: [] }],//标题、加粗、引用、无序列表、有序列表、代码块
    ["image","link",],
    ["clean","undo","redo"], // 清除
];
const icons = [
    {className:'icon-heading_tool',tips:'H1标题'},
    {className:'icon-bold_tool',tips:'加粗'},
    {className:'icon-quote_tool',tips:'引用'},
    {className:'icon-bullets_tool',tips:'无序列表'},
    {className:'icon-number_tool',tips:'有序列表'},
    {className:'icon-line_tool',tips:'分割线'},
    {className:'icon-code_tool',tips:'代码块'},
    {className:'icon-pic_tool',tips:'插入图片'},
    {className:'icon-link_tool',tips:'文章链接'},
    {className:'icon-clean_tool',tips:'清除格式'},
    {className:'icon-last_tool',tips:'撤销'},
    {className:'icon-next_tool',tips:'重做'},
]
const colorIcons = [
    {className:'ql-color_tool',tips:'字体颜色'},
    {className:'ql-bgd_tool',tips:'文字背景颜色'},
]
let BlockEmbed = Quill.import('blots/block/embed')
class Divider extends BlockEmbed { }
Divider.blotName = 'divider'
Divider.tagName = 'hr'
Quill.register({
  'formats/divider': Divider
})//分割线
let Link = Quill.import("formats/link");
class FileBlot extends Link {
  static create(value) {
    let node = undefined;
    if (value && !value.href) {
      node = super.create(value);
    } else {
      node = super.create(value.href);
      node.innerText = value.innerText;
      node.href = value.href;
      node.id= value.id;
      node.setAttribute("title", value.innerText);
      node.setAttribute("data-value", value.dataValue);
    }
    return node;
  }
}
FileBlot.blotName = "link";
FileBlot.tagName = "A";
Quill.register(FileBlot);//外部链接

let Block = Quill.import('blots/block')
class Redo extends Block {
}
Redo.blotName = 'redo'

class Undo extends Block {
}
Undo.blotName = 'undo'

Quill.register({
  'formats/redo': Redo,
  'formats/undo': Undo
})//撤销和重做

let Container = Quill.import('blots/container')
let Parchment = Quill.import('parchment')
class BlockquoteItem extends Block {
  static formats (domNode) {
    return domNode.tagName === this.tagName ? undefined : super.formats(domNode)
  }

  format (name, value) {
    if (name === Blockquote.blotName && !value) {
      // 设置blockquote: 'false'，去掉blockquote样式
      this.replaceWith(Parchment.create(this.statics.scope))
    } else {
      // 设置blockquote: 'blockquote'，blockquote样式
      super.format(name, value)
    }
  }

  remove () {
    // 删除及删除父元素
    if (this.prev == null && this.next == null) {
      this.parent.remove()
    } else {
      super.remove()
    }
  }

  replaceWith (name, value) {
    this.parent.isolate(this.offset(this.parent), this.length())
    if (name === this.parent.statics.blotName) {
      // enter添加blockquote-item时，将其放入一个blockquote中
      this.parent.replaceWith(name, value)
      return this
    } else {
      // 点击按键去掉样式时，将父元素展开，该行变成默认的p元素
      this.parent.unwrap()
      return super.replaceWith(name, value)
    }
  }
}
BlockquoteItem.blotName = 'blockquote-item'
BlockquoteItem.tagName = 'p'
BlockquoteItem.className = 'blockquote-item'

class Blockquote extends Container {

  /* 继承container，没有formats,在toolbar.js中无法切换样式 */
  static formats (domNode) {
    return 'blockquote'
  }

  formats () {
    return { [this.statics.blotName]: this.statics.formats(this.domNode) }
  }
  /* 前面插入:如果是BlockquoteItem，直接插入，否则插入到Blockquote外部 */
  insertBefore (blot, ref) {
    if (blot instanceof BlockquoteItem) {
      super.insertBefore(blot, ref)
    } else {
      let index = ref == null ? this.length() : ref.offset(this)
      let after = this.split(index)
      after.parent.insertBefore(blot, after)
    }
  }
  /* 如果下个元素与当前元素一样，则合并 */
  optimize (context) {
    super.optimize(context)
    let next = this.next
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName) {
      next.moveChildren(this)
      next.remove()
    }
  }
  /* 如果不是一种blot，则将target的内容移动到当前blot中 */
  replace (target) {
    if (target.statics.blotName !== this.statics.blotName) {
      let item = Parchment.create(this.statics.defaultChild)
      target.moveChildren(item)
      this.appendChild(item)
    }
    super.replace(target)
  }
}
Blockquote.blotName = 'blockquote'
Blockquote.scope = Parchment.Scope.BLOCK_BLOT
Blockquote.tagName = 'blockquote'
Blockquote.defaultChild = 'blockquote-item'
Blockquote.allowedChildren = [BlockquoteItem]
Quill.register(BlockquoteItem);
Quill.register(Blockquote);
const repSign = s=>{
	s = s.replace(/([A-Za-z]|^|\n|\r)([\，\。\？\！])(?=[A-Za-z0-9\u4e00-\u9fa5]|$|\n|\r)/g,function(u,v,w,x) {
		sign = {
			'，':',',
			'。':'.',
			'？':'?',
			'！':'!'
		};
		return sign[w] ? v + sign[w] : u;
	});
	return s;
}
let cssList = {
    h1:"display:block;font-size:1em;line-height:1.25em;padding-left:12px;font-weight:700;border-left:4px solid #f85959;margin:1em 0;",
    h1_strong:"line-height:1.25em;",
    h1_span:"font-size:1em;line-height:1em;",
    ol:"margin: 1em 0;line-height: 1.5;",
    p:"margin: 1em 0;line-height: 1.5;word-wrap:break-word",
    p_strong:"line-height:1.25em;",
    p_span:"font-size:1em",
    ul:"margin: 1em 0;line-height: 1.5;",
    hr:"margin: 1.5em 0;border: 1px solid #e9e9e9;border-width: 1px 0 0;",
    blockquote:"padding: 12px 8px;color: #999;background-color: #f3f4f5;margin: 10px 0;border:none!important;",
    blockquote_span:"color:#999;",
    blockquote_p:"margin:0!important;line-height: 1.4em!important;",
    img:"max-width:100%",
    pre:"background: #f0f0f0!important;color:#222!important;border-radius: 3px;",
}
export default {
    props: {
        value: {
            type: String
        },
        maxSize: {
            type: Number,
            default: 4000 //kb
        },
        maxLength:{
            type:Number,
            default:10000
        }
    },
    components: {
        quillEditor
    },
    computed:{
        length(){
            if(this.value.includes('meta')){
                let regExp = /<div class="xgx-editor".*?>.*?<\/div>/
                let arr = this.value.match(regExp);
                if(arr&&arr.length>0){
                    let str = arr[0]
                    if(str){
                        let tempLength = str.slice(24,str.length-6)
                        return tempLength.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length
                    }
                }
            }else{
                return this.value.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length
            }
        }
    },
    data() {
        return {
            init:false,
            content: this.value,
            editorOption: {
                placeholder: "",
                theme: "snow",
                modules: {
                    imageDrop:true,
                    imageResize: {
                        displayStyles: {
                        backgroundColor: 'black',
                        border: 'none',
                            color: 'white'
                        },
                        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                    },
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            divider:function(value){
                                let range = this.quill.getSelection(true)
                                this.quill.insertText(range.index, '\n', Quill.sources.USER)
                                this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER)
                                this.quill.setSelection(range.index + 2, Quill.sources.SILENT)
                            },
                            image: function(value) {
                                if (value) {
                                    document.querySelector(".ql-editor").click();
                                    setTimeout(()=>{
                                        document.querySelector(".editor-uploader input").click();
                                    },100)
                                } else {
                                    this.quill.format("image", false);
                                }
                            },
                            link:(value)=>{
                                if (value) {
                                    let quill = this.$refs.myQuillEditor.quill;
                                    this.index = quill.getSelection().index;
                                    this.dialogVisible = true;
                                }
                            },
                            undo:(value) => { 
                                if(value){
                                    let quill = this.$refs.myQuillEditor.quill;
                                    quill.history.undo() 
                                }
                            },
                            redo:(value)=>{
                                if(value){
                                    let quill = this.$refs.myQuillEditor.quill;
                                    quill.history.redo() 
                                }
                            }
                        }
                    },
                }
            },
            serverUrl: this.$server.actionImgOrvideo,
            header: {
                token:getToken()
            },
            dialogVisible:false,
            linkText:'',
            linkUrl:'',
            errorText:'',
            index:'',
            loadingInstance:'',
            focus:false
        }
    },
    watch:{
        dialogVisible(cur,old){
            if(!cur){
                this.linkText = '';
                this.errorText = '';
                this.linkUrl = '';
            }
        },
        value(cur,old){
            if(this.init) return;
            this.init = true;
            this.content = cur;
            let regExp = /<img src=.*? style=.*?>/g
            let reg = /style=\".*?\"/
            let r = /\".*?\"/
            let imgList = cur.match(regExp);
            if(imgList&&imgList.length>0){
                let imgstyleArr = imgList.map((item,index)=>{
                    let temp = item.match(reg)[0]
                    return {
                        style:temp.match(r)[0].replace(/\"/g, "")
                    }
                })
                this.$nextTick(()=>{
                    let img = document.querySelectorAll(".ql-editor img");
                    img.forEach((item,index)=>{
                        item.setAttribute('style',imgstyleArr[index].style)
                    })
                })
            }
            if(cur.length>0){
                let all = /<div class="xgx-editor".*?>.*?<\/div>/
                let arr = cur.match(all);
                if(arr&&arr.length>0){
                    let str = arr[0]
                    if(str){
                        this.content = str.slice(24,str.length-6)
                    }
                }
            }
        }
    },
    mounted(){
        this.customizeIcon()
        let dom = this.$refs.myQuillEditor.$el.querySelector('.ql-editor')
        let show = false;
        let top = 0,srcollTop = 0;
        dom.addEventListener('click',(e)=>{
            let ref = e.target||e.srcElement;
            show = false;
            if(ref.nodeName.toLocaleLowerCase()=='img'){
                e.stopPropagation();
                show = true;
                let last = document.querySelector('.ql-container').lastChild;
                top = Number(last.style.top.split('px')[0]);
                srcollTop = dom.scrollTop;
            }
        })
        dom.addEventListener('scroll',(e)=>{
            if(show){
                let last = document.querySelector('.ql-container').lastChild;
                last.style.top = top - (dom.scrollTop - srcollTop)  + 'px'
            }
        })
        document.querySelector('.hamburger-container').addEventListener('click',(e)=>{
            let dom = document.querySelector('.ql-editor');
            if(dom&&show){
                dom.click()
            }
        })
    },
    methods: {
        /**
         * 定制头部icon
         */
        customizeIcon(){
            let toolBar = document.querySelector('.ql-toolbar');
            let button = toolBar.querySelectorAll('button');
            button.forEach((item,index)=>{
                if(item.childNodes[0]){
                    item.removeChild(item.childNodes[0])
                }
                let dom = document.createElement('i');
                dom.className = 'iconfont'
                dom.classList.add(icons[index].className)
                let dom1 = document.createElement('span');
                dom1.className = 'ttcore-tooltip';
                dom1.innerText = icons[index].tips;
                item.appendChild(dom)
                item.appendChild(dom1)
            })
            let colorDom = toolBar.querySelectorAll('.ql-color-picker .ql-picker-label')
            colorDom.forEach((item,index)=>{
                if(item.childNodes[0]){
                   item.removeChild(item.childNodes[0])
                }
                let dom = document.createElement('i');
                dom.className = 'iconfont'
                dom.classList.add(colorIcons[index].className)
                let dom1 = document.createElement('span');
                dom1.className = 'ttcore-tooltip';
                dom1.innerText = colorIcons[index].tips;
                item.appendChild(dom)
                item.appendChild(dom1)
            })
        },
        /**
         * 失去焦点事件
         */
        onEditorBlur() {
            // if(!this.focus) return;
            // for(let i in cssList){
            //     this.addCss(i)
            // }
        },
        addCss(tag){
            if(tag.includes('_')){
                let parent = tag.split("_")[0];
                let child = tag.split("_")[1]
                let dom = document.querySelectorAll(".ql-editor "+parent+' '+child);
                dom.forEach(item=>{
                    let style = item.getAttribute('style');
                    if(!style){
                    item.style.cssText=cssList[tag]
                    }else{
                    item.style.cssText=style+cssList[tag]
                    }
                })
            }else{
                let dom = document.querySelectorAll(".ql-editor "+tag);
                dom.forEach(item=>{
                    let style = item.getAttribute('style');
                    if(!style){
                        item.style.cssText=cssList[tag]
                    }else{
                        item.style.cssText=style+cssList[tag]
                    }
                })
            }
        },
        /**
         * 获得焦点事件
         */
        onEditorFocus() {
            this.focus = true;
        },
        /**
         * 内容改变事件
         */
        onEditorChange() {
            this.$emit("input", this.content);
        },
        /**
         * 富文本图片上传前
         */
        beforeImgUpload() {
            this.loadingInstance = this.$loading({
                target:document.querySelector('.editor .ql-container')
            });
        },
        /**
         * 上传成功
         */
        uploadSuccess(res, file) {
            let quill = this.$refs.myQuillEditor.quill;
            if (res.status == 200) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片  res.url为服务器返回的图片地址
                quill.insertEmbed(length, "image", res.content.resourceUrl);
                // 调整光标到最后
                quill.setSelection(length + 1);

            } else {
                this.$message.error("图片插入失败");
            }
            this.loadingInstance.close()
        },
        /**
         * 富文本图片上传失败
         */
        uploadError() {
            this.loadingInstance.close()
            this.$message.error("图片插入失败");
        },
        /**
         * 获取链接
         */
        getLink(){
            const regExp = {
                'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
                'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
            }
            if(!regExp.exceptSpecialChar.test(this.linkText)){
                this.errorText='只能输入数字、字母、汉字';
                return;
            }
            let quill = this.$refs.myQuillEditor.quill;
            let length = this.index;
            
            let url = this.linkUrl.replace(regExp.protocol,'');
            let link = 'http://'+repSign(url)
            let temp = {
                href:link,
                innerText:this.linkText,
                id:'',
                dataValue:''
            }
            quill.insertEmbed(length, "link",temp,"api");
            quill.setSelection(length + 1);
            this.dialogVisible = false;
        },
    }
}
</script> 

<style lang="scss">

.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
.ql-tooltip.ql-editing{
    left: 0!important;
}
.editor-wrapper{
    padding:20px 40px;
    background: #fff;
    height:100%;
    font-size: 0;
    position:relative;
    .editor-uploader{
        position: absolute;
    }
    .content-length{
        position: absolute;
        color:#999;
        right: 60px;
        top:35px;
        font-size: 16px;
        z-index: 7;
    }
    .editor {
        line-height: normal !important;
        height:100%;
        overflow: hidden;
        position: relative;
        font-size: 16px;
        &::before{
            content:'';
            width: 20px;
            height: 20px;
            border-bottom: 1px solid #ccc;
            border-right:1px solid #ccc;
            display: inline-block;
            position: absolute;
            top:88px;
            left: 10%;
            z-index: 4;
        }
        &::after{
            content:'';
            width: 20px;
            height: 20px;
            border-bottom: 1px solid #ccc;
            border-left:1px solid #ccc;
            display: inline-block;
            position: absolute;
            top:88px;
            right: 10%;
            z-index: 4;
        }
    }
    .ql-snow{
        line-height: 30px;
        padding:8px;
        border-left:none;
        border-right:none;
        border-color:#eee!important;
        position: relative;   
    }
    .ql-toolbar{
        z-index: 3;
        background: #fff;
        &::after{
            content:'';
            height: 60px;
            width: 100%;
            display: block;
            position: absolute;
            top: 48px;
            z-index: 3;
            background: #fff;
        }
        .ql-formats{
            margin:0 12px 0 0!important;
            position: relative;
            &::after{
                content:'';
                display: block;
                position: absolute;
                right: -8px;
                top:2px;
                height: 26px;
                width: 1px;
                background: #bbb;
            }
        }
        button{
            background: none;
            border: none;
            cursor: pointer;
            display: inline-block;
            float: left;
            height: 30px;
            padding: 3px 4px;
            width: 30px;
            margin:0 3px;
            position: relative;
            &:hover{
                background: #f1f1f1;
                .ttcore-tooltip{
                    display: block;
                }
            }
            &.ql-active{
                background: #999!important;
                i.iconfont{
                    color:#fff;
                }
            }
        }
        .ql-color-picker{
            height: 28px!important;
            .ttcore-tooltip{
                z-index: 4;
            }
            .ql-color_tool{
                width: 22px;
                height: 22px;
                display: block;
                background: url('../../assets/images/text_color.png')no-repeat 50% 50%/cover;
            }
            .ql-bgd_tool{
                width: 22px;
                height: 22px;
                display: block;
                background: url('../../assets/images/text_bgd.png')no-repeat 50% 50%/cover;
            }
            &:hover{
                background: #f1f1f1;
                .ttcore-tooltip{
                    display: block;
                }
            }
            &.ql-expanded{
                background: #999!important;
                .ql-color_tool{
                    background: url('../../assets/images/text_color_active.png')no-repeat 50% 50%/cover;
                }
                .ql-bgd_tool{
                    background: url('../../assets/images/text_bgd_active.png')no-repeat 50% 50%/cover;
                }
            }
        }
        .ql-header{
            .ttcore-tooltip{
                left: 72%;
            }
        }
        .ttcore-tooltip{
            display: none;
            position: absolute;
            z-index: 100;
            top: 40px;
            left: 50%;
            -webkit-transform: translateX(-50%);
            -moz-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
            transform: translateX(-50%);
            border: 1px solid #d9dde4;
            background-color: #fff;
            color: #333;
            line-height: 1.3;
            padding: 10px;
            font-size: 13px;
            text-align: center;
            white-space: nowrap;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
    }
    .ql-container{
        height: calc(100% - 108px);
        width: 80%;
        margin: auto;
        border: 0;
        padding: 0!important;
        position: relative;
        z-index: 2;
        font-size: 1em!important;
        .ql-editor{
            padding: 0 20px!important;
            margin-top:60px;
            position: relative;
            color: #222;
            min-height: 200px;
            max-height: 440px;
            overflow-x: hidden;
            ol,p,ul{
                margin: 1em 0;
                line-height: 1.5;
            }
            hr{
                margin: 3em 0 0 0;
                border: 1px solid #e9e9e9;
                border-width: 1px 0 0;
            }
            // img{
            //     display: block
            // }
            blockquote p{
                margin:0!important;
                line-height: 1.4em!important;
            }
            .top-left,.top-right,.bottom-left,.bottom-right{
                position: absolute;
                height: 2px;
                width: 2px;
                background: #333;
                border-radius: 50%;
            }

        }
    } 
}
.ql-editor blockquote, .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6, .ql-editor ol, .ql-editor p, .ql-editor pre, .ql-editor ul{
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-snow .ql-color-picker .ql-picker-label{
    padding: 2px!important;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-options{
    z-index: 5;
}
.editor-wrapper .ql-editor *{
    cursor: text;
    font-size: 1em;
    font-family:PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Arial,sans-serif;
}
.editor-wrapper .ql-editor h1{
    font-size: 18px;
    line-height: 18px;
    padding-left: 12px;
    font-weight: 700;
    border-left: 4px solid #f85959;
    margin: 1em 0;
    span{
        font-size: 18px;
        line-height: 18px;
    }
}
.editor-wrapper .ql-editor blockquote{
    padding: 12px 8px;
    color: #999;
    background-color: #f3f4f5;
    margin: 10px 0;
    border:none!important;
    span{
        color:#999;
    }
}
.editor-wrapper .ql-editor pre{
    background: #f0f0f0!important;
    color:#222!important;
    border-radius: 3px;
}
.link-dialog{
    .el-dialog__body{
        border-top:1px solid #e8e8e8;
        padding: 30px 50px;
        position: relative;
        .link-item{
            margin-bottom:20px;
            label{
                display: inline-block;
                vertical-align: middle;
                margin-right: 20px;
            }
            .el-input{
                width: 320px;
            }
        }
        .tips{
            font-size: 13px;
            color:#999;
        }
        .error{
            font-size: 14px;
            color:#9E0E00;
            opacity: 0.9;
            position: absolute;
            left: 50px;
            bottom:5px;
            visibility: hidden;
            opacity: 0;
            transition: all 0.3s;
            &.show{
                visibility: visible;
                opacity: 1;
            }
        }
    }
    .el-dialog__footer{
        text-align: center;
    }
}
</style>
