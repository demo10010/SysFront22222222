<template>
  <div style="padding: 10px;background-color: rgba(11, 24, 202, 0.1);">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px"
          style="margin-left: 10px;margin-top: 16px;">
          <el-form-item label="任务部门" prop="department" v-hasRole="['admin', 'leader']">
            <el-select v-model="queryParams.deptLevel" style="width: 200px" placeholder="请选择机构层级">
              <el-option v-for="( item, index ) in  departmentList.map(x => ({ label: x, value: x }))"
                :key="item.value + index + 'level'" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="form-action">
            <el-button type="primary" icon="el-icon-search" @click="searching = true">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" v-for="item in dict.type.task_priority_type" :key="item.value" :style="cardHeight">
        <jobCard :currentType="item.value" :currentLabel="item.label" :getListData="getListData" :searching="searching"
          :departmentList="departmentAllList" :taskDurationList="dict.type.task_duration_type"
          :taskPriorityList="dict.type.task_priority_type" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import jobCard from '@/views/jobs/components/jobcard';
import { listTable } from "@/api/task/all";
import { deptTreeSelect } from "@/api/system/user";
import auth from '@/plugins/auth';


export default {
  dicts: ['task_priority_type', 'task_duration_type'],
  components: { jobCard },
  data() {
    return {
      list: [],
      total: 0,
      departmentAllList: [],
      searching: false,
      departmentList: ['单位', '部门', '科室'],
      queryParams: {
        currentStatus: ['进行中'],
        taskDurationTypeList: ['日任务'],
        deptLevel: []
      },colorMap: {
        // 1: "#409eff",
        // 2: "#ADD5FF",
        // 3: "#E3F1FF",
        1: "#FF9797",
        2: "#FFB1B1",
        3: "#FFE5E5"
      }
    }
  },
  mounted: function () {
    if (auth.hasRoleOr(['admin', 'leader'])) {
      this.getDeptTree();
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
    },
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.departmentAllList = response.data;
      });
    },
  }
};
</script>
