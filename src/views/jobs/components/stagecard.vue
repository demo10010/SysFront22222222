<template>
  <el-card class="stage-card">
    <div slot="header" class="clearfix">
      <span>阶段{{ index + 1 }}</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="onDelete(index)">删除</el-button>
    </div>
    <el-form-item label="阶段名称" prop="stageName">
      <el-input v-model="item.stageName" placeholder="请输入阶段名称" clearable :style="{ width: '100%' }">
      </el-input>
    </el-form-item>
    <el-form-item label="阶段时间" prop="stageTimeRange">
      <el-date-picker type="daterange" v-model="item.stageTimeRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
        :style="{ width: '100%' }" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至"
        clearable></el-date-picker>
    </el-form-item>
    <el-form-item label="阶段内容" prop="stageContent">
      <el-input v-model="item.stageContent" type="textarea" placeholder="请输入阶段内容" :autosize="{ minRows: 4, maxRows: 4 }"
        :style="{ width: '100%' }"></el-input>
    </el-form-item>
  </el-card>
</template>
<script>

export default {
  props: ['index', 'item', 'onDelete'],
  created() {
  },
  data() {
    return {
    }
  },
  methods: {
    async completed() {
    }
  },
}

</script>
<style>
.stage-card {
  width: 100%;
}
.stage-card + .stage-card{
  margin-top: 15px;
}

</style>
  