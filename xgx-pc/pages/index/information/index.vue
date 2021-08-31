<template>
    <div class="inform-page">
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
    .inform-page{
        font-family:MicrosoftYaHei;
        zoom: 1;
        overflow: auto;
        text-align: center;
        margin-top:30px;
    }
</style>
