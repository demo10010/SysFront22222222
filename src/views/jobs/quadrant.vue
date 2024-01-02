<template>
  <div style="padding: 10px;">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px"
          style="margin-left: 10px;margin-top: 16px;">
          <el-form-item label="任务部门" prop="department" v-hasRole="['admin', 'leader']">
            <el-select v-model="queryParams.deptLevel" style="width: 200px" placeholder="请选择任务部门" >
              <el-option v-for="( item, index ) in  departmentList.map(x => ({ label: x, value: x }))"
                :key="item.value + index + 'level'" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="任务级别" prop="jobLevel">
            <el-select v-model="queryParams.currentStatus" style="width: 200px" placeholder="请选择任务级别" :multiple="true">
              <el-option v-for="( item, index ) in  dict.type.task_duration_type" :key="item.value + index + 'level'"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item class="form-action">
            <el-button type="primary" icon="el-icon-search" @click="searching = true">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" v-for="item in dict.type.task_priority_type" :key="item.value" :style="cardHeight">
        <jobCard :currentType="item.value" :currentLabel="item.label" :getListData="getListData" :searching="searching" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import jobCard from '@/views/jobs/components/jobcard';
import { listTable } from "@/api/task/all";

export default {
  dicts: ['task_priority_type', 'task_duration_type'],
  components: { jobCard },
  data() {
    return {
      list: [],
      total: 0,
      searching: false,
      departmentList: ['单位', '部门', '科室'],
      queryParams: {
        currentStatus: [],
        deptLevel: []
      }
    }
  },
  computed: {
    cardHeight() {
      return `height:${(window.innerHeight - 180) / 2}px`;
    },
  },
  methods: {
    async getListData(query) {
      const self = this;
      return listTable({ ...this.queryParams, ...query }).finally(() => self.searching = false);
    }
  }
};
</script>
