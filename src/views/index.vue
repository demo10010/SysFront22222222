<template>
  <div class="app-container home">
    <div class="job-search">
      <el-tag @click="selectAllJobType" size="medium" type="info"
        :effect="queryParams.status.length === dict.type.task_duration_type.length ? 'dark' : 'light'">
        全部
      </el-tag>
      <el-tag v-for="(item, index) in dict.type.task_duration_type" @click="selelectJobType(item.value)" size="medium"
        :type="tagColorMap[index]" :effect="queryParams.status.includes(item.value) ? 'dark' : 'light'" :key="index">
        {{ item.label }}
      </el-tag>
    </div>
    <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px">
      <el-form-item label="部门" prop="department" v-hasRole="['admin', 'deptLeader', 'officeLeader']">
        <treeselect v-model="queryParams.deptNameId" :multiple="true" :options="departmentList" :show-count="true"
          placeholder="请选择部门" style="width: 230px;line-height: 18px;" />
      </el-form-item>
      <el-form-item label="状态" prop="jobStatus">
        <el-select v-model="queryParams.currentStatus" style="width: 200px" placeholder="请选择状态" :multiple="true">
          <el-option v-for="( item, index ) in  dict.type.task_status_type" :key="item.value + index + 'level'"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="queryParams.priorityList" placeholder="请选择优先级" :multiple="true">
          <el-option v-for="( item, index ) in  dict.type.task_priority_type" :key="item.value + index + 'priority'"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="评级" prop="level">
        <el-select v-model="queryParams.ratingList" style="width: 160px" placeholder="请选择评级" :multiple="true">
          <el-option v-for="( item, index ) in  dict.type.task_rating_type " :key="item.value + index + 'level'"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="任务时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="form-action">
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>
    <el-button type="warning" icon="el-icon-plus" size="medium" @click="createJobVisible = true"
      style="margin-bottom: 16px;" v-hasRole="['admin', 'deptLeader', 'officeLeader']">新建任务</el-button>
    <el-button type="danger" plain icon="el-icon-delete" @click="handleJobDelete" style="margin-bottom: 16px;"
      v-hasRole="['admin', 'deptLeader', 'officeLeader']">批量删除</el-button>
    <el-table v-loading="loading" :data="jobLogList" @selection-change="handleSelectionChange" stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="任务名称" align="center" width="120" prop="taskName" :show-overflow-tooltip="true" />
      <el-table-column label="任务详情" align="center" width="180" prop="taskDetail" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="任务详情" align="center" width="450" prop="taskDetail" >
        <template #default="{row}">
          <el-tooltip :content="row.taskDetail" to>
            <p class="taskDetailStyle">{{row.taskDetail}}</p>
          </el-tooltip>
        </template>
      </el-table-column> -->

      <el-table-column label="开始时间" align="center" width="100" prop="assignStartTime" :show-overflow-tooltip="true" />
      <el-table-column label="截止时间" align="center" width="100" prop="assignEndTime" :show-overflow-tooltip="true" />
      <el-table-column label="优先级" align="center" prop="priority" type="index" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.task_priority_type" :value="scope.row.priority"
            :keys="scope.row.priority + 'column' + scope.$index" :show-value="false" />
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="deptName" width="120" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.principalDept }}
        </template>
      </el-table-column>

      <el-table-column label="耗时百分比" align="left" prop="percent" width="120">
        <template slot-scope="scope">
          <el-progress :percentage="getJobPercent(scope.row)"
            :status="scope.row.completeTime ? 'success' : (scope.row.taskPercent > 100 ? 'exception' : undefined)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="任务进度" align="left" prop="percent" width="150">
        <template slot-scope="{row}">
          <el-progress v-if="!row.showProcessPercentageInput" :percentage="row.processPercentage"
            style="width: 100px; display: inline-block !important;"></el-progress>
          <i class="el-icon-edit" @click="row.showProcessPercentageInput = true" v-if="!row.showProcessPercentageInput"
            style="cursor: pointer;"></i>
          <div v-if="row.showProcessPercentageInput" style="width: 150px;">
            <el-input-number v-model="row.processPercentageInput" :min="1" :max="100" size="mini"
              style="width: 100px;display: inline-block;"></el-input-number>
            <i class="el-icon-check" @click="updateProcessPercentage(row)"
              style="cursor: pointer; width: 24px;height: 24px;font-size: 24px; margin-left: 6px;"></i>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="评级" align="center" width="80" prop="level" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.task_rating_type" :value="scope.row.rating"
            :keys="scope.row.rating + 'column' + scope.$index" :show-value="false" />
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" @click="handleCompletedJob(scope.row)">完成</el-button>
            <el-button size="mini" type="text" @click="handleRating(scope.row)"
              v-hasRole="['admin', 'deptLeader', 'officeLeader']">评价</el-button>
            <el-button size="mini" type="text" @click="showRatingHistory(scope.row)"
              v-hasRole="['admin', 'deptLeader', 'officeLeader']">查看评价</el-button>
          </div>
          <div>
            <el-button size="mini" type="text" @click="handleJobEdit(scope.row)" v-if="!scope.row.completeTime"
              v-hasRole="['admin', 'deptLeader', 'officeLeader']">编辑</el-button>
            <el-popconfirm title="确认删除这条任务吗？       " @confirm="handleJobDelete(scope.row)" style="margin-left:10px;">
              <el-button size="mini" slot="reference" type="text"
                v-hasRole="['admin', 'deptLeader', 'officeLeader']">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <rate :visible="ratingDialogVisible" :onCancel="cancelRating" :onSubmit="confirmRating" :selectId="selectRow.id" />
    <rate-history :visible="ratingHistoryVisible" :onCancel="cancelRatingHistory" :selectId="selectRow.id" />
    <complete-job :visible="dialogVisible" :onCancel="handleCompletedJobCancel" :onSubmit="confirmCompletedDate" />
    <create-job :visible="createJobVisible" :onCancel="handleCreatJobCancel" :jobInstitutionOptions="departmentList"
      :jobTypeOptions="dict.type.task_duration_type" :jobPriorityOptions="dict.type.task_priority_type" :isEdit="jobEdit"
      :onSubmit="getList" :taskId='selectRow.id' />
  </div>
</template>

<script>

import { listTable, deleteMulTask, addTaskComplete, updateTask } from "@/api/task/all";
import { getDicts } from "@/api/system/dict/data";
import CreateJob from '@/views/jobs/createJob';
import Rate from '@/views/jobs/components/rate';
import CompleteJob from '@/views/jobs/components/completeJob';
import RateHistory from '@/views/jobs/components/rateHistory';
import auth from '@/plugins/auth';
import { deptTreeSelect } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { CreateJob, Treeselect, Rate, CompleteJob, RateHistory },
  name: "Index",
  dicts: ['task_priority_type', 'task_duration_type', 'task_rating_type', 'task_status_type'],
  watch: {
    "dict.type.task_status_type"(newValue) {
      if (newValue[0]?.value) {
        this.queryParams.currentStatus = [newValue[0].value];
        this.handleQuery();
      }
    }
  },

  data() {
    return {
      deleteIds: [],
      dialogVisible: false,
      ratingDialogVisible: false,
      ratingHistoryVisible: false,
      jobEdit: false,
      createJobVisible: false,
      loading: false,
      total: 0,
      selectRow: {},
      jobLogList: [{
        id: 1,
        startDate: '2023-12-22',
        endDate: '2023-12-24',
        jobName: 'test1111',

      }],
      dateRange: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        priorityList: [],
        ratingList: [],
        status: [],
        deptNameId: [],
        currentStatus: [],
      },
      taskTimeOptions: [],
      priorityOptions: [],
      levelOptions: [],
      departmentList: [],
      tagColorMap: {
        0: '',
        1: 'success',
        2: 'info',
        3: 'danger',
        4: 'warning'
      }
    }
  },
  mounted: function () {
    if (auth.hasRoleOr(['admin', 'deptLeader', 'officeLeader'])) {
      this.getDeptTree();
    }
  },
  methods: {
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.departmentList = response.data;
      });
    },
    async updateProcessPercentage(row) {
      await updateTask({ id: row.id, processPercentage: row.processPercentageInput });
      row.showProcessPercentageInput = false;
      row.processPercentage = row.processPercentageInput;
    },
    getJobPercent(row) {
      const { completeTime, assignStartTime, assignEndTime } = row;
      if (!assignStartTime || !assignEndTime) return 0;
      if (completeTime) return 100;
      const currentDate = new Date(new Date().toLocaleDateString('zh', { year: 'numeric', month: '2-digit', day: '2-digit' })).getTime();
      const startDate = new Date(`${assignStartTime} 00:00:00`).getTime();

      if (startDate - currentDate > 0) return 0;
      const endDate = new Date(`${assignEndTime} 00:00:00`).getTime();
      const conversion = 1000 * 60 * 60 * 24;

      const totalDays = (Math.ceil(endDate - startDate) / conversion) + 1;
      const pastDays = (Math.ceil(currentDate - startDate) / conversion) + 1;

      const taskPercent = Math.round((pastDays / totalDays) * 100);
      const validPercent = Math.min(taskPercent, 100);
      row.taskPercent = validPercent;

      return validPercent;
    },
    async handleJobDelete(row) {
      const data = !!row?.id ? [row.id] : this.deleteIds
      await deleteMulTask(data);
      this.handleQuery();
    },
    handleCreatJobCancel() {
      this.createJobVisible = false;
      this.jobEdit = false;
    },
    async handleJobEdit(row) {
      this.selectRow = row;
      this.createJobVisible = true;
      this.jobEdit = true;
    },
    handleCompletedJob(row) {
      this.dialogVisible = true;
      this.selectRow = row;
    },
    mapDicts(data) {
      return data?.map(m => ({ id: m.dictValue, name: m.dictLabel }))
    },
    async getPriorityOptions() {
      const res = await getDicts('task_priority_type');
      this.priorityOptions = this.mapDicts(res.data);
    },
    async getLevelOptions() {
      const res = await getDicts('task_rating_type');
      this.levelOptions = this.mapDicts(res.data);
    },
    selelectJobType(type) {
      const isSame = this.queryParams.status.includes(type);
      this.queryParams.status = isSame ? this.queryParams.status.filter(f => f !== type) : this.queryParams.status.concat(type);
      this.handleQuery();
    },
    selectAllJobType() {
      this.queryParams.status = this.queryParams.status.length === this.dict.type.task_duration_type.length ? [] :
        this.dict.type.task_duration_type.map(x => x.value);
      this.handleQuery();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.queryParams.status = '';
      this.resetForm("queryForm");
      this.handleQuery();
    },
    async getList() {
      this.loading = true;
      const { status, params, ...rest } = this.addDateRange(this.queryParams, this.dateRange);
      const { rows, total } = await listTable({
        ...rest,
        assignStartTime: params.beginTime,
        assignEndTime: params.endTime,
        taskDurationTypeList: status
      });
      this.jobLogList = rows.map(row => ({
        ...row,
        principalDept: row.principalDeptList?.map(x => x.deptName)?.join(", "),
        processPercentageInput: row.processPercentage,
        showProcessPercentageInput: false
      }));
      this.total = total;
      this.loading = false;
    },

    handleCompletedJobCancel() {
      this.dialogVisible = false;
    },

    async confirmCompletedDate(formData) {
      const { completedDate, remark, imgUrls } = formData;
      await addTaskComplete({ id: this.selectRow.id, completeTime: completedDate, selfComment: remark, imgUrls });
      this.handleQuery();
      this.dialogVisible = false;
      this.selectRow = {};
    },

    async confirmRating() {
      this.handleQuery();
      this.selectRow = {};
      this.cancelRating();
    },
    cancelRating() {
      this.ratingDialogVisible = false;
    },
    handleRating(row) {
      this.ratingDialogVisible = true;
      this.selectRow = row;
    },
    handleSelectionChange(selection) {
      this.deleteIds = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    cancelRatingHistory() {
      this.ratingHistoryVisible = false;
      this.selectRow = {};
    },
    showRatingHistory(row) {
      this.selectRow = row;
      this.ratingHistoryVisible = true;
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  font-family: "open sans",
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  .job-search .el-tag {
    margin-right: 8px;
    cursor: pointer;
  }

  .rating-tag .el-tag {
    margin-right: 10px;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
  }

  .job-search {
    margin-bottom: 16px;
  }

  .job-form .el-form--label-top .el-form-item__label {
    padding: 0;
  }

  .job-form .form-action .el-form-item__label {
    color: white;
  }

  .job-form {
    .el-form--label-top .el-form-item__label {
      padding: 0;
    }

    .form-action .el-form-item__label {
      color: white;
    }
  }

}
</style>

