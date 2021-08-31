<template>
    <div class="leftNative">
        <ul :style="cssList.parentCss==''?styleCss.parentCss:cssList.parentCss">
            <li :style="cssList.headLiCss" v-show="cssList.headShow">{{cssList.headText}}</li>
            <li :class="{'selectStyle1':(Number(selectDataStart)==item.selectId&&cssList.cssType==1),'selectStyle2':(Number(selectDataStart)==item.selectId&&cssList.cssType==2)}" v-for="(item,index) in valueList" :key="index" :style="cssList.childCss==''?styleCss.childCss:cssList.childCss" @click="nativeClickEven(index,item.selectId)">{{item.text}}</li>
        </ul>
    </div>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
@Component({
    computed:{
        ...mapState(['selectDataStart'])
    },    
})
export default class Footer extends Vue{
    styleCss:Object={
        childCss:'font-size: 20px;',
        parentCss:''
    };
    numberCss:number;
    @Prop()
    cssList: string
    @Prop()
    routId: number     
    @Prop()
    valueList: object   
    
    selectIds:number=this.routId;
    created(){}   
    async nativeClickEven(index,num){
        this.$emit('liSetDataToParents',num);
    }
}
</script>
<style lang="scss" scoped>
  .selectStyle1{
      color: #C30D23 !important;
      text-decoration:underline
  }
  .selectStyle2{
      color: #fff !important;
      background: #C30D23;
  }
  .leftNative ul li:hover{
      color: #C30D23;
  }
</style>
