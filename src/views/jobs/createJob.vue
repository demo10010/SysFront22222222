<template>
  <el-dialog :visible="visible" :title="getTitle()" :close-on-click-modal="false" append-to-body :show-close="isDetail"
    :close-on-press-escape="false" @close="onClose">
    <el-form ref="createJobForm" :model="formData" :rules="rules" size="medium" label-width="120px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="formData.jobName" placeholder="请输入任务名称" clearable :style="{ width: '100%' }" maxlength="200">
        </el-input>
      </el-form-item>
      <el-form-item label="任务内容" prop="jobContent">
        <el-input v-model="formData.jobContent" type="textarea" placeholder="请输入任务内容"
          :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }" maxlength="249"></el-input>
      </el-form-item>
      <el-form-item label="承办科室" prop="jobInstitution">
        <treeselect v-model="formData.jobInstitution" :options="jobInstitutionOptions" :show-count="true"
          placeholder="请选择任务层级" @select="handleJobInstitution" multiple />
      </el-form-item>
      <!-- <el-form-item label="承办科室" prop="undertakingDept">
        <el-select v-model="formData.undertakingDept" placeholder="请选择承办科室" clearable :style="{ width: '100%' }" multiple>
          <el-option v-for="(item, index) in responsibleOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="责任人" prop="responsible">
        <el-select v-model="formData.responsible" filterable placeholder="请选择责任人" clearable :style="{ width: '100%' }"
          multiple>
          <el-option v-for="(item, index) in responsibleOptions" :key="item.value" :label="item.label" :value="item.value"
            :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务开始时间" prop="jobStartDate">
        <el-date-picker v-model="formData.jobStartDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          :style="{ width: '100%' }" placeholder="请选择任务开始时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="任务结束时间" prop="jobEndDate">
        <el-date-picker v-model="formData.jobEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          :style="{ width: '100%' }" placeholder="请选择任务结束时间" clearable
          :picker-options="{ disabledDate: endDisabledDate }"></el-date-picker>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="显示层级" prop="jobLevel">
            <el-select v-model="formData.jobLevel" placeholder="请选择显示层级" clearable :style="{ width: '100%' }">
              <el-option v-for="(item, index) in dict.type.task_show_level" :key="item.value" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关注值" prop="jobLevelFocusValue" label-width="80px">
            <el-input-number v-model="formData.jobLevelFocusValue" :min="1" :max="99"
              :disabled="formData.jobLevel === '科室级'" style="width: 130px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否锁定" prop="jobLevelLock" label-width="120px">
            <el-checkbox v-model="formData.jobLevelLock" :disabled="formData.jobLevel === '科室级'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="阶段划分" prop="jobStage">
        <el-radio-group v-model="formData.jobStage" @change="handleJobCStageChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button @click="addStage" type="primary" v-if="formData.jobStage === 1" icon="el-icon-plus" size="small"
        class="stage-card-add-btn">新增阶段</el-button>
      <div style="max-height: 400px;overflow-y:scroll;" class="stage-card-list" v-if="formData.stageList.length > 0">
        <stage-card v-for="(item, index) in formData.stageList" :key="index" :item="item" :index="index"
          :onDelete="removeStage" />
      </div>
      <el-form-item label="重要程度" prop="jobPriority">
        <el-select v-model="formData.jobPriority" placeholder="请选择重要程度" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in jobPriorityOptions" :key="item.value" :disabled="item.disabled"
            :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时长类型" prop="jobType">
        <el-select v-model="formData.jobType" placeholder="请选择时长类型" clearable :style="{ width: '100%' }">
          <el-option v-for="(item, index) in jobTypeOptions" :key="item.value" :disabled="item.disabled"
            :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" v-if="!isDetail">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>

  </el-dialog>
</template>
<script>

import { addTask, updateTask, getTaskDetailsById } from "@/api/task/all";
import { listUser } from "@/api/system/user";
import StageCard from '@/views/jobs/components/stagecard';

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect, StageCard },
  dicts: ['task_show_level'],
  props: ['visible', 'taskId', 'isEdit', 'onCancel', 'onSubmit', 'jobPriorityOptions', 'jobInstitutionOptions', 'isDetail',
    'jobTypeOptions', 'defaultFormData'],
  data() {
    return {
      formData: {
        jobName: undefined,
        jobContent: undefined,
        responsible: undefined,
        jobStartDate: null,
        jobEndDate: null,
        jobPriority: '',
        jobType: undefined,
        jobInstitution: undefined,
        undertakingDept: undefined,
        jobLevel: undefined,
        jobLevelFocusValue: undefined,
        jobLevelLock: false,
        jobStage: 0,
        stageList: [],
      },
      rules: {
        jobName: [{
          required: true,
          message: '请输入任务名称',
          trigger: 'blur'
        }],
        jobContent: [{
          required: true,
          message: '请输入任务内容',
          trigger: 'blur'
        }],
        responsible: [{
          required: true,
          message: '请选择责任人',
          trigger: 'change'
        }],
        jobStartDate: [{
          required: true,
          message: '请选择任务开始时间',
          trigger: 'change'
        }],
        jobEndDate: [{
          required: true,
          message: '请选择任务结束时间',
          trigger: 'change'
        }],
        jobPriority: [{
          required: true,
          message: '请选择重要程度',
          trigger: 'change'
        }],
        jobType: [{
          required: true,
          message: '请选择时长类型',
          trigger: 'change'
        }],
        jobInstitution: [{
          required: true,
          message: '请选择任务层级',
          trigger: 'change'
        }],
        undertakingDept: [{
          required: true,
          message: '请选择承办科室',
          trigger: 'change'
        }],
        jobLevel: [{
          required: true,
          message: '请选择显示层级',
          trigger: 'change'
        }]
      },
      responsibleOptions: [],
    }
  },
  methods: {
    getTitle() {
      if (this.isDetail) return '查看任务';
      if (this.isEdit) return '编辑任务';
      return '创建任务';
    },
    handleJobInstitution() {
      this.formData.responsible = null;
    },
    endDisabledDate(date) {
      return date.getTime() < new Date(this.formData.jobStartDate).getTime();
    },
    getResList() {
      const params = {
        pageNum: 1,
        pageSize: 9999,
      }
      listUser(params).then(response => {
        this.responsibleOptions = response.rows?.map(m => ({ value: m.userId?.toString(), label: m.userName }));
      });
    },
    onClose() {
      debugger;
      this.resetForm("createJobForm");
      this.onCancel();
    },
    handleConfirm() {
      const self = this;
      this.$refs['createJobForm'].validate(async valid => {
        if (!valid) return;
        const { jobName, jobContent, jobInstitution, jobStartDate, jobEndDate, responsible, jobPriority,
          stageList, jobType, jobLevelLock, jobLevel, jobLevelFocusValue } = this.formData;
        const data = {
          taskName: jobName,
          taskDetail: jobContent,
          assignStartTime: jobStartDate,
          assignEndTime: jobEndDate,
          priority: jobPriority,
          taskDurationType: jobType,
          principalIdList: responsible,
          taskPhaseList: stageList.map(item => ({
            phaseName: item.stageName,
            phaseStartTime: item.stageTimeRange[0],
            phaseEndTime: item.stageTimeRange[1],
            phaseContent: item.stageContent,
          })),
          hasLocked: jobLevelLock,
          attentionLevel: jobLevelFocusValue,
          principalDeptIdList: jobInstitution,
          showLevel: jobLevel
        };
        if (self.isEdit) {
          await updateTask({ id: self.taskId, ...data })
        } else {
          await addTask(data);
        }
        self.onClose();
        self.onSubmit();
      })
    },
    addStage() {
      this.formData.stageList = this.formData.stageList.concat({
        stageName: '',
        stageTimeRange: [],
        stageContent: ''
      })
    },
    removeStage(index) {
      this.formData.stageList.splice(index, 1);
    },
    handleJobCStageChange(value) {
      if (value === 0) this.formData.stageList = [];
    },
    async getJobDetails(jobId) {
      const res = await getTaskDetailsById(jobId);
      const { taskName, taskDetail, assignStartTime, taskPhaseList,
        assignEndTime, priority, taskDurationType, principalList,
        attentionLevel, showLevel, hasLocked, principalDeptList } = res.data;

      this.formData = {
        jobName: taskName,
        jobContent: taskDetail,
        responsible: principalList.map(x => String(x.userId)),
        jobStartDate: assignStartTime,
        jobEndDate: assignEndTime,
        jobPriority: priority?.toString(),
        jobType: taskDurationType,
        jobInstitution: principalDeptList.map(x => x.deptId),
        jobLevelFocusValue: attentionLevel,
        jobLevel: showLevel,
        jobLevelLock: hasLocked,
        jobStage: taskPhaseList.length > 0 ? 1 : 0,
        stageList: taskPhaseList?.map(item => ({
          stageName: item.phaseName,
          stageTimeRange: [item.phaseStartTime, item.phaseEndTime],
          stageContent: item.phaseContent
        }))
      }
    },
  },
  watch: {
    taskId(newValue) {
      const self = this;
      newValue && this.getResList()

      if (newValue && self.isEdit) {
        self.getJobDetails(self.taskId);
      }
    }
  }
}

</script>
<style>
.stage-card-list {
  padding: 0 15px 20px 120px;
  margin-bottom: 20px;
}

.stage-card-add-btn {
  margin-left: 120px;
  margin-bottom: 15px;
  margin-top: -8px;
}
</style>