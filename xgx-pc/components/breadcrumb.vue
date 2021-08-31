<template>
    <div class="breadcrumb">
        <div class="breadcrumb-div1">位置 :</div>
        <div class="breadcrumb-div2">
            <div class="box">
                <div class="item" v-for="(item,index) in listData" :key="index" @click="goPage(item)">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
@Component({})
export default class Footer extends Vue{
    numberCss:number = 0
    @Prop()
    listData: Object
    @Prop()
    iconType: string     
    created(){}

    nativeClickEven(index,num){
        this.numberCss = Number(index);
        this.$emit('liSetDataToParents',num);
    }
    goPage(obj){
        if(obj.link){
            this.$router.push({path:obj.link})
        }
    }
}
</script>
<style lang="scss" scoped>
    .breadcrumb{
        zoom: 1;
        overflow: hidden;
        line-height: 1;
        // padding: 15px 0;
        margin-bottom: 20px;
        color:#888888;
        cursor: default!important;
        .breadcrumb-div1,.breadcrumb-div2{
            float: left;
            font-size: 14px;
            span{
                font-size: 14px!important;
            }
        }
        .box{
            font-size: 14px;
            .item{
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                cursor: pointer;
                &::after{
                    display: inline-block;
                    content:'>';
                    margin:0 5px;
                }
                &:last-child{
                    &::after{
                        display: none;
                    }
                }
            }
            .item:hover:not(:last-child){
                color: #C30D23;
                font-weight: bold;
            }
        }
        .breadcrumb-div1{
            font-weight: 400;
            color: #606266;
            cursor: text;
            margin-right: 10px;
        }
    }
</style>
