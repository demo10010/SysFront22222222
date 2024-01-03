<template>
  <!-- <el-card :style="{ 'background-color': colorMap[currentType] }" class="job-card"> -->
  <el-card class="job-card">
    <el-tag style="margin-bottom: 16px;color: #000000;"  :style="{ 'background-color': colorMap[currentType] }"  type="info">{{ currentLabel }}</el-tag>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="序号" width="50" align="center" type="index" />
      <!-- <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">{{ scope.row.taskName }}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="耗时百分比" align="left" prop="percent">
        <template slot-scope="scope">
          <el-progress :percentage="getJobPercent(scope.row)"
            :status="scope.row.completeTime ? 'success' : (scope.row.taskPercent > 100 ? 'exception' : undefined)"></el-progress>
        </template>
      </el-table-column> -->
      <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="任务详情" align="center" prop="actions" :show-overflow-tooltip="true"> -->
      <el-table-column label="任务详情" align="center" prop="taskDetail" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" prop="actionsComplete">
        <template slot-scope="scope">
          <thumbUp :finish="() => confirmCompleted(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <create-job :visible="visible" :onCancel="showDetailCancel" :jobInstitutionOptions="departmentList"
      :jobTypeOptions="taskDurationList" :jobPriorityOptions="taskPriorityList" :isDetail="true" :isEdit="true"
      :defaultFormData="defaultJobEditData" :taskId='selectRow.id' />
  </el-card>
</template>


<script>

import createJob from '@/views/jobs/createJob';
import thumbUp from '@/views/jobs/components/thumbUp.vue';
import { getTaskDetailsById,addTaskComplete } from "@/api/task/all";


export default {
  components: { createJob, thumbUp },
  props: {
    departmentList: {
      type: Array,
      default: new Array([])
    },
    taskDurationList: {
      type: Array,
      default: new Array([])
    },
    taskPriorityList: {
      type: Array,
      default: new Array([])
    },
    currentType: {
      type: String,
      default: ''
    },
    currentLabel: {
      type: String,
      default: ''
    },
    searching: {
      type: Boolean,
      default: false
    },
    getListData: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      thumbup: thumbUp,
      loading: false,
      list: [],
      total: 0,
      visible: false,
      selectRow: {},
      defaultJobEditData: {},
      needSearching: this.searching,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      colorMap: {
        1: "#409eFF",
        2: "#ADD5FF",
        3: "#E3F1FF",
        // 1: "#FF9797",
        // 2: "#FFB1B1",
        // 3: "#FFE5E5"
      }
    }
  },
  mounted: function () {
    this.getList();
  },
  methods: {
    async confirmCompleted(row) {
      const self = this;
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      await addTaskComplete({ id: row.id, completeTime: formattedDate });
      setTimeout(() => {
        self.getList();
      }, 1000);
    },
    async showDetail(row) {
      const res = await getTaskDetailsById(row.id);
      const { taskName, taskDetail, responsiblePersonId, assignStartTime,
        assignEndTime, priority, taskDurationType, deptNameId } = res.data;

      this.defaultJobEditData = {
        jobName: taskName,
        jobContent: taskDetail,
        responsible: responsiblePersonId,
        jobStartDate: assignStartTime,
        jobEndDate: assignEndTime,
        jobPriority: String(priority),
        jobType: taskDurationType,
        jobInstitution: deptNameId,
      }
      this.visible = true;
      this.selectRow = row;
    },
    showDetailCancel() {
      this.visible = false;
      this.selectRow = {};
    },
    async getList() {
      const self = this;
      this.loading = true;
      const { rows, total } = await this.getListData({ ...this.queryParams, priorityList: [this.currentType] })
        .finally(function () { self.needSearching = false });
      this.list = rows;
      this.total = total;
      this.loading = false;
    },
    getJobPercent(row) {
      const { completeTime, assignStartTime, assignEndTime } = row;
      if (!assignStartTime || !assignEndTime) return 0;
      if (completeTime) return 100;
      const startDate = new Date(assignStartTime);
      const endDate = new Date(assignEndTime);
      const conversion = 1000 * 60 * 60 * 24;

      const totalDays = Math.ceil(endDate - startDate) / conversion;
      const pastDays = Math.ceil(new Date() - startDate) / conversion;

      const taskPercent = Math.round((pastDays / totalDays) * 100);
      const validPercent = Math.min(taskPercent, 100);
      row.taskPercent = validPercent;

      return validPercent;
    }
  },
  watch: {
    needSearching(newValue) {
      newValue && this.getList();
    },
    searching(newValue) {
      this.needSearching = newValue;
    }
  }
};
</script>


<style scoped>
.job-card {
  margin: 4px;
  height: calc(100% - 20px);
  overflow: auto;
  border: 3px solid transparent;
}

.like-animation-enter-active,
.like-animation-leave-active {
  transition: transform 0.5s;
}

.like-animation-enter,
.like-animation-leave-to {
  transform: scale(0);
}
</style>
