<template>
  <div class="tooltip">
    <el-tooltip effect="dark" placement="top">
      <div slot="content">
        <p v-for="item in messages" :key="item" style="margin-bottom:5px">
          {{item}}
        </p>
      </div>
      <i class="el-icon-question" style="color:#409eff;font-size:15px;"></i>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props:['messages']
  };
</script>