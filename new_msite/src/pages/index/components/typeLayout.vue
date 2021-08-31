<template>
    <div class="type-wrap">
        <div class="typeBox" v-for="(item,index) in dataInfo.list" :key="index" @click="typeEven(item.id)">
            <img :src="item.imgurl"/>
            <p>{{item.name}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props:["dataInfo"],
    data(){
        return {}
    },
    computed:{},     
    created(){},    
    methods:{
        typeEven(idType){
            switch (idType) {
                case 0:
                    this.$router.push({
                        path:'/classify',query:{type:1}
                    });
                    break;
                case 1:
                    this.$router.push({
                        path:'/classify',query:{type:2}
                    });
                    break;
                case 2:
                    this.$router.push("/assemble/list");
                    break;
                case 3:
                     this.$router.push("/shortVideo");
                    break;   
                case 4:
                     this.$router.push("/user");
                    break;                                                 
                default:
                    break;
            }
        }
    }
};
</script> 
<style lang="scss" scoped>
    .type-wrap{
        padding:0.2rem 0.3rem;
        margin:0.2rem 0 0 0;
        width:100%;
        display:flex;  
        background: #fff;  
        .typeBox{
            flex: 1;
            padding: 0.06rem;
            img{
                width: 1.08rem;
                display: block;
                margin: auto;
            }
            p{
                text-align: center;
                font-size: 0.28rem;
                color: #333;
            }
        }
    }
</style>
