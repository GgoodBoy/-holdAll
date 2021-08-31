<template>
    <div class="classify-module" :class="index%2==0?'white':''">
        <div class="list">
            <div class="item" v-for="(item,index) in data.list" :key="index"  @click="goSearch(item)">
                <img :src="item.picUrl"/>
                <p class="name">{{item.name}}</p>
            </div>
        </div>      
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
declare function require(string): string;
@Component({})
export default class Banner extends Vue{
   @Prop()    
    data: Object   
    @Prop()
    index:number
    goSearch(obj:any){
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('child-page')[0],
            background:'transparent'
        });
        this.$router.push({
            path:'/course/courseList',
            query:{
                id:obj.classifyId,
                sortType:1,
                pageNo:1,
                pageSize:12,
                freeType:2
            }
        })
        loadingInstance.close()
    }
}
</script>
<style lang="scss" scoped>
   .classify-module{
       padding: 77px 0 27px;
       &.white{
           background: #fff;
           box-shadow:0px 5px 27px -2px rgba(0,0,0,0.09);
           .item{
               background: rgba(245,245,245,1)!important;
           }
       }
       .list{
           margin:0 auto;
           width: 1200px;
           overflow: hidden;
           .item{
               float: left;
               margin-bottom:50px;
               margin-right: 50px;
               width: 200px;
               height: 140px;
               border-radius: 6px;
               overflow: hidden;
               text-align: center;
               background: #fff;
               cursor: pointer;
               &:nth-child(5n+0){
                   margin-right: 0!important;
               }
               img{
                   display: inline-block;
                   margin:12px 0 0 0;
                   width: 72px;
                   height: 72px;
               }
               p{
                   color:#333333;
                   font-size: 30px;
                   line-height:42px;
               }
            }
       }
   }
</style>
