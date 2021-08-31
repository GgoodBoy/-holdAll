<template>
    <div class="screen-pluge">
        <p>{{data.title}}</p>
        <div class="pluge-box1" v-if="data.style==1">
            <div class="pluge-one-a">
                <img :src="seriesCourse2" />
            </div>
            <div class="pluge-one-b">
                <div v-for="(item,index) in 6" :key="index">
                    <img :src="seriesCourse2" />
                </div>
            </div>            
        </div> 
        <div class="pluge-box2" v-if="data.style==2">
            <div class="pluge-two" v-for="(item,index) in 3" :key="index">
                <img :src="seriesCourse2" />
            </div>            
        </div>     
    </div>
</template>

<script>
import seriesCourse2 from "../../assets/images/ys1.png";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            seriesCourse2:seriesCourse2,
        };
    },
    created(){},
    props:['data'],
    components:{},    
    methods: {
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../components/formSynthesisPlugin/my-component.css";
.screen-pluge{
    width: 100%;
    cursor: pointer;
    p{
        line-height: 30px;
        font-size: 16px;
        padding: 0 5px;
    }
    .pluge-box1{
        display: flex;
        flex-direction: row;
        justify-content: space-between;      
        .pluge-one-a{
            width: 192px;
            height: 108px;
            overflow: hidden;
            img{
                width: 100%;
            }
        } 
        .pluge-one-b{
            width: 297px;
            height: 108px;  
            div{
                width: 89px;
                height: 50px;
                overflow: hidden;
                float: left;
                margin: 0 4px;
                img{
                    width: 100%;
                }
            }
            div:nth-child(-n+3){
                margin-bottom: 8px;
            }          
        }
        
    }
    .pluge-box2{
        zoom: 1;
        overflow: auto;
        .pluge-two{
            float: left;
            width: 154px;
            height: 87px;
            margin: 0 3px;
            overflow: hidden;
            img{
                width: 100%;
            }
        }
        .pluge-two:nth-child(-n+3){
            margin-bottom: 7px;
        }         
    }
}
</style>
