<template>
  <div class="app-container home">
    <div class="job-search">
      <el-tag v-for="(item, index) in dict.type.task_duration_type" @click="selelectJobType(item.value)" size="medium"
        :type="tagColorMap[index]" :effect="queryParams.status === item.value ? 'dark' : 'light'" :key="index">
        {{ item.label }}
      </el-tag>
    </div>
    <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px">
      <el-form-item label="部门" prop="department" v-hasRole="['admin', 'leader']">
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
      <el-form-item label="评级" prop="level">
        <el-select v-model="queryParams.ratingList" style="width: 160px" placeholder="请选择评级" :multiple="true">
          <el-option v-for="( item, index ) in  dict.type.task_rating_type " :key="item.value + index + 'level'"
            :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
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
      style="margin-bottom: 16px;" v-hasRole="['admin']">新建任务</el-button>
    <el-table v-loading="loading" :data="jobLogList">
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
      <el-table-column label="部门" align="center" prop="deptName" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="耗时百分比" align="left" prop="percent" width="120">
        <template slot-scope="scope">
          <el-progress :percentage="getJobPercent(scope.row)"
            :status="scope.row.completeTime ? 'success' : (scope.row.taskPercent > 100 ? 'exception' : undefined)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="评级" align="center" width="80" prop="level" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.task_rating_type" :value="scope.row.rating"
            :keys="scope.row.rating + 'column' + scope.$index" :show-value="false" />
        </template>
      </el-table-column>
      <el-table-column label="自评" align="center" prop="selfComment" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="他评" align="center" prop="otherComment" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="text" @click="handleCompletedJob(scope.row)">完成</el-button>
            <el-button size="mini" type="text" @click="handleRating(scope.row)" v-hasRole="['admin']">他评</el-button>
          </div>
          <div>
            <el-button size="mini" type="text" @click="handleJobEdit(scope.row)" v-if="!scope.row.completeTime"
              v-hasRole="['admin', 'leader']">编辑</el-button>
            <el-popconfirm title="确认删除这条任务吗？       " @confirm="handleJobDelete(scope.row)"
              style="margin-left:10px;">
              <el-button size="mini" slot="reference" type="text" v-hasRole="['admin']">删除</el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible" title="完成任务" width="800" append-to-body :show-close="false">

      <label style="display: block;margin-bottom: 8px;">结束日期</label>
      <el-date-picker v-model="completeQuery.completedDate" style="width: 240px" value-format="yyyy-MM-dd" type="date"
        placeholder="请选择"></el-date-picker>

      <label style="display: block;margin-bottom: 8px;margin-top: 16px;">评论</label>
      <el-input v-model="completeQuery.remark" type="textarea" placeholder="请输入内容" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCompletedJobCancel">取 消</el-button>
        <el-button type="primary" @click="confirmCompletedDate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="ratingDialogVisible" title="评价" width="800" append-to-body :show-close="false">

      <label style="display: block;margin-bottom: 8px;margin-top: 16px;" v-hasRole="['admin', 'leader']">等级</label>
      <el-tag v-hasRole="['admin', 'leader']" v-for="(    item, index    ) in     dict.type.task_rating_type    "
        @click="ratingQuery.rating = item.value" style="margin-right: 8px;height: 36px;cursor: pointer;min-width: 90px;"
        type="primary" size="medium" :effect="ratingQuery.rating === item.value ? 'dark' : 'plain'">
        {{ item.label }}
      </el-tag>

      <label style="display: block;margin-bottom: 8px;margin-top: 16px;">评论</label>
      <el-input v-model="ratingQuery.remark" type="textarea" placeholder="请输入内容" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRating">取 消</el-button>
        <el-button type="primary" @click="confirmRating" :disabled="!ratingQuery.rating">确 定</el-button>
      </span>
    </el-dialog>

    <create-job :visible="createJobVisible" :onCancel="handleCreatJobCancel" :jobInstitutionOptions="departmentList"
      :jobTypeOptions="dict.type.task_duration_type" :jobPriorityOptions="dict.type.task_priority_type" :isEdit="jobEdit"
      :defaultFormData="defaultJobEditData" :onSubmit="getList" :taskId='selectRow.id' />
  </div>
</template>

<script>

import { listTable, deleteTask, getTaskDetailsById, addTaskComplete } from "@/api/task/all";
import { getDicts } from "@/api/system/dict/data";
import createJob from '@/views/jobs/createJob';
import auth from '@/plugins/auth';
import { deptTreeSelect } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { createJob, Treeselect },
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
      dialogVisible: false,
      ratingDialogVisible: false,
      jobEdit: false,
      createJobVisible: false,
      defaultJobEditData: {
        jobName: undefined,
        jobContent: undefined,
        responsible: undefined,
        jobStartDate: null,
        jobEndDate: null,
        jobPriorityId: undefined,
        jobType: undefined,
        jobInstitution: undefined,
      },
      ratingQuery: { rating: '', remark: '' },
      loading: false,
      total: 0,
      completeQuery: { completedDate: '', remark: '' },
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
        status: '',
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
    if (auth.hasRoleOr(['admin', 'leader'])) {
      this.getDeptTree();
    }
  },
  methods: {
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.departmentList = response.data;
      });
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

    },
    async handleJobDelete(row) {
      await deleteTask(row.id);
      this.handleQuery();
    },
    handleCreatJobCancel() {
      this.createJobVisible = false;
      this.jobEdit = false;
    },
    async handleJobEdit(row) {
      this.selectRow = row;
      const res = await getTaskDetailsById(row.id);
      const { taskName, taskDetail, responsiblePersonId, assignStartTime,
        assignEndTime, priority, taskDurationType, deptNameId } = res.data;

      this.defaultJobEditData = {
        jobName: taskName,
        jobContent: taskDetail,
        responsible: responsiblePersonId,
        jobStartDate: assignStartTime,
        jobEndDate: assignEndTime,
        jobPriority: priority?.toString(),
        jobType: taskDurationType,
        jobInstitution: deptNameId,
      }
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
    async getTaskTimeOptions() {
      const res = await getDicts('task_duration_type');
      this.taskTimeOptions = this.mapDicts(res.data);
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
      const isSame = this.queryParams.status === type;
      this.queryParams.status = isSame ? '' : type;
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
        taskDurationTypeList: status ? [status] : []
      });
      this.jobLogList = rows;
      this.total = total;
      this.loading = false;
    },

    handleCompletedJobCancel() {
      this.dialogVisible = false;
      this.completeQuery = { remark: '', completedDate: '' };
    },

    async confirmCompletedDate() {
      const { completedDate, remark } = this.completeQuery;
      await addTaskComplete({ id: this.selectRow.id, completeTime: completedDate, selfComment: remark });
      this.handleQuery();
      this.dialogVisible = false;
      this.selectRow = {};
    },

    async confirmRating() {
      const { remark, rating } = this.ratingQuery;
      await addTaskComplete({ id: this.selectRow.id, otherComment: remark, rating });
      this.handleQuery();
      this.selectRow = {};
      this.cancelRating();
    },
    cancelRating() {
      this.ratingQuery = { rating: '', remark: '' };
      this.ratingDialogVisible = false;
    },
    handleRating(row) {
      this.ratingDialogVisible = true;
      this.selectRow = row;
    },
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

