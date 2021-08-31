<template>
        <section class="app-main">
            <!-- <breadcrumb /> -->
            <transition name="fade-transform"
                        mode="out-in">
                <router-view class="app-inner" />
            </transition>
        </section>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
    name: "AppMain",
    components: { Breadcrumb },
    computed: {

    }
};
</script>

<style scoped>
.app-main {
    min-height: calc(100vh - 80px);
    position: relative;
    overflow: hidden;
    background: #EDF1F7;
    padding: 20px;
}
.app-inner {
    /* min-width: 1160px; */
    width:100%;
}
</style>
