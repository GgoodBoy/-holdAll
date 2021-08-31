<template>
    <div class="wTitle wModel">
        <div class='title-style-one' v-if="wTitleObj.style==1" :style="{ background: contentStyle.titleBack }" :class="`layouts${contentStyle.layouts}`">
            <p class='titleTips' :style="{'font-size': contentStyle.titleFontSize+'px', 'color': contentStyle.titleColor,'font-weight':(contentStyle.titleBold?'bold':100) }">{{wTitleObj.titleContent||'这里是标题'}}</p>
            <p class='titleDescribe' :style="{'font-size': contentStyle.describeDontSize+'px', 'color': contentStyle.describeColor,'font-weight':(contentStyle.describeBold?'bold':100) }">{{wTitleObj.titleDescribe||'这里是标题的描述'}}</p>
        </div>
        <div class='title-style-two' v-else :class="`layouts${contentStyle.layouts}`">
            <div class='titleTips'>{{wTitleObj.titleContent||'这里是标题'}}</div>
            <div class='titleDescribe'>
                <span> 作者 </span>
                <span> {{wTitleObj.titeleGoToUrl||'链接标题'}} </span>
                <span> {{wTitleObj.tetleDate||'标题时间'}} </span>
            </div>
        </div>
        <div v-if="wTitleObj.style==1" class="others">查看更多</div>
    </div>
</template>
<script>
export default {
    name:'wTitle',
    props:['moduleData','indesNum'],
    data(){
        return{
            wTitleObj:{},
            contentStyle:{
                layouts:2,
                titleFontSize:14,
                describeDontSize:14,
                titleBold:true,
                describeBold:true
            },
            backColor:''
        }
    },
    created(){
        let contents = JSON.parse(this.moduleData.content);
        let contentType =typeof contents;
        console.log("contentType",contentType);
        console.log("contents",contents);
        if(contentType==='string'){
            if(contents!=='{}'){
                contents = JSON.parse(contents);
                this.contentStyle=contents;
            }            
        }else{
            if(JSON.stringify(contents)!=='{}'){
                this.contentStyle=contents;
            }
        }
        this.wTitleObj = this.moduleData;
    },
    computed:{
        realTimeDataUpdate(){   
            return this.$store.state.wxStore.wxLeftData[this.indesNum].action;
        },
    },
    watch:{
        realTimeDataUpdate(cur,old){
            if(this.moduleData.id){
                this.wTitleObj = this.$store.state.wxStore.wxLeftData.find(item=>item.id==this.moduleData.id);
            }else{
                this.wTitleObj = this.$store.state.wxStore.wxLeftData.find(item=>item.addLeftId==this.moduleData.addLeftId);
            }            
        },
        moduleData(cur,old){
            let contents = JSON.parse(cur.content);
            let contentType =typeof contents;
            if(contentType==='string'){
                contents = JSON.parse(contents);
            }   
            this.wTitleObj=cur;
            this.contentStyle=contents;         
        }
    }
}
</script>
<style lang="scss" scoped>
    .selectAction{
        border: 1px solid red
    };
    .wTitle{       
        position: relative;
        .others{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%); 
            color: #66CCFF;           
        }        
        .title-style-one{
            position: relative;
            padding: 0 40px;
            &.layouts1{
                text-align: left;
            }
            &.layouts2{
                text-align: center;
            }
            &.layouts3{
                text-align: right;
            }                        
            p{
                padding:5px;
            }
        }
        .title-style-two{
            &.layouts1{
                text-align: left;
            }
            &.layouts2{
                text-align: center;
            }
            &.layouts3{
                text-align: right;
            }            
            div{
                padding: 5px 0;
            }
        }
    }
</style>
