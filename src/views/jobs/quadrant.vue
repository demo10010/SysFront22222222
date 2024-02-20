<template>
  <div style="padding: 10px;">
    <el-row>
      <el-col :span="24">
        <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px"
          style="margin-left: 10px;margin-bottom: -16px; margin-top: 4px;">
          <el-form-item label="机构层级" prop="department" v-hasRole="['admin', 'deptLeader', 'officeLeader']">
            <el-select v-model="queryParams.deptLevel" style="width: 200px" placeholder="请选择机构层级"
              @change="searching = true">
              <el-option v-for="( item, index ) in  departmentList.map(x => ({ label: x, value: x }))"
                :key="item.value + index + 'level'" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item class="form-action">
            <el-button type="primary" icon="el-icon-search" @click="searching = true">搜索</el-button>
          </el-form-item> -->
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
      departmentAllList: [],
      searching: false,
      departmentList: ['单位', '部门', '科室'],
      queryParams: {
        currentStatus: ['进行中'],
        taskDurationTypeList: ['日任务'],
        deptLevel: []
      }, colorMap: {
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

  },
  computed: {
    cardHeight() {
      return `height:${(window.innerHeight - 146) / 2}px`;
    },
  },
  methods: {
    async getListData(query) {
      const self = this;
      return listTable({ ...this.queryParams, ...query }).finally(() => self.searching = false);
    },
  }
};
</script>
