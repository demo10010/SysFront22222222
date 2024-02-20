<template>
  <el-card class="stage-card">
    <div slot="header" class="clearfix">
      <span>阶段{{ index + 1 }}</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="onDelete(index)"
        v-if="showDelete">删除</el-button>
    </div>
    <el-form-item label="阶段名称" prop="stageName">
      <span>{{ item.stageName }}</span>
    </el-form-item>
    <el-form-item label="阶段时间" prop="stageTimeRange">
      <span>{{ item.stageTimeRange }}</span>
    </el-form-item>
    <el-form-item label="阶段内容" prop="stageContent">
      <span>{{ item.stageContent }}</span>
    </el-form-item>
  </el-card>
</template>
<script>

export default {
  props: ['index', 'item'],
  created() {
  },
  data() {
    return {
    }
  },
  methods: {
  },
}

</script>
<style>
.stage-card {
  width: 100%;
}

.stage-card+.stage-card {
  margin-top: 15px;
}
</style>
  