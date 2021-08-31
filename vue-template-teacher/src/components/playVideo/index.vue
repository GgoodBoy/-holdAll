<template>
    <div>
        <!-- <div class="player-olympic"
             ref="playerTemp"
             v-show="!hiddlePlayer"
             style="display:none;">

        </div> -->
             <div id="player-con">
                <!-- <video controls="controls" autoplay="autoplay">
                    <source src="movie.ogg" type="video/ogg" />
                    <source src="movie.mp4" type="video/mp4" />
                    您的浏览器不支持当前视频
                </video>             -->
            </div>       
    </div>
</template>

<script>

export default {
    // props: {
    //     vi
    //     // ,
    //     // hiddlePlayer: {
    //     //     type: Boolean,
    //     //     default: false
    //     // },
    //     playType
    // },
    props: ["vid","playType"] ,  
    data() {
        return {};
    },
    metaInfo: {},
    mounted(){
        this.getPlayAuth();
    },
    created() {},
    methods: {
        myselfFun(paths,boos){
            let props = {
                        id: "player-con",
                        width: "100%",
                        height: "460px",
                        preload:false,
                        autoplay: boos==1?false:true,
                        source:paths,
                        isLive: false,
                        useH5Prism:true
                    };
                    let player = new Aliplayer(props,(player)=>{
                });
            },
        getPlayAuth() {
            var self = this;
            // let courseId = Number(self.vid);
            let courseId = self.vid;
            // this.$http.post(`${liNext}`,{type:self.playType=='video'?1:2,id:courseId}
            this.$http.post(`${this.$server.playAuthNext}`,{type:self.playType=='video'?1:2,id:courseId}
            ).then(res=>{
                if(res.status == 200){
                    self.myselfFun(res.content,self.playType=='video'?1:2);
                }
            })            
        }
    }
};
</script>
<style lang="scss">
#player-con {
    height: 500px;
    overflow: hidden;
    .prism-ErrorMessage {
        display: none;
    }
}
</style>

