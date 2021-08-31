<template>
    <div class="auth-page">
        <nuxt-child/>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
@Component({})
export default class Auth extends Vue{

}
</script>
<style lang="scss" scoped>
    .auth-page{
        width:100%;
        height: 780px;
        background:url('../../../assets/images/login_bgd.jpg')no-repeat 50% 50% / cover;
        position: relative;
        text-align: center;
        font-family:MicrosoftYaHei;
        margin-top:-100px;
    }
</style>
