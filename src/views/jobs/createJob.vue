<template>
  <el-dialog :visible="visible" :title="isEdit ? '编辑任务' : '创建任务'" :close-on-click-modal="false" append-to-body
    :show-close="false" :close-on-press-escape="false">
    <el-form ref="createJobForm" :model="formData" :rules="rules" size="medium" label-width="120px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input v-model="formData.jobName" placeholder="请输入任务名称" clearable :style="{ width: '100%' }" maxlength="200">
        </el-input>
      </el-form-item>
      <el-form-item label="任务内容" prop="jobContent">
        <el-input v-model="formData.jobContent" type="textarea" placeholder="请输入任务内容"
          :autosize="{ minRows: 4, maxRows: 4 }" :style="{ width: '100%' }" maxlength="249"></el-input>
      </el-form-item>
      <el-form-item label="归属部门" prop="jobInstitution">
        <treeselect v-model="formData.jobInstitution" :options="jobInstitutionOptions" :show-count="true"
          placeholder="请选择归属部门" @select="handleJobInstitution" />
      </el-form-item>
      <el-form-item label="责任人" prop="responsible">
        <el-select v-model="formData.responsible" placeholder="请选择责任人" clearable :style="{ width: '100%' }">
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
      <el-form-item label="优先级" prop="jobPriority">
        <el-select v-model="formData.jobPriority" placeholder="请选择优先级" clearable :style="{ width: '100%' }">
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
    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>

  </el-dialog>
</template>
<script>

import { addTask, updateTask } from "@/api/task/all";
import { listUser } from "@/api/system/user";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect },
  props: ['visible', 'taskId', 'isEdit', 'onCancel', 'onSubmit', 'jobPriorityOptions', 'jobInstitutionOptions', 'jobTypeOptions', 'defaultFormData'],
  created() {
  },
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
          message: '请选择优先级',
          trigger: 'change'
        }],
        jobType: [{
          required: true,
          message: '请选择时长类型',
          trigger: 'change'
        }],
        jobInstitution: [{
          required: true,
          message: '请选择归属部门',
          trigger: 'change'
        }],
      },
      responsibleOptions: [],
    }
  },
  methods: {
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
        deptId: this.formData.jobInstitution
      }
      listUser(params).then(response => {
        this.responsibleOptions = response.rows?.map(m => ({ value: m.userId?.toString(), label: m.userName }));
      });
    },
    onClose() {
      this.resetForm("createJobForm");
      this.onCancel();
    },
    handleConfirm() {
      const self = this;
      this.$refs['createJobForm'].validate(async valid => {
        if (!valid) return;
        console.log(this.formData, "valid formData");
        const { jobName, jobContent, jobInstitution, jobStartDate, jobEndDate, responsible, jobPriority, jobType } = this.formData;
        const data = {
          taskName: jobName,
          taskDetail: jobContent,
          deptNameId: jobInstitution,
          assignStartTime: jobStartDate,
          assignEndTime: jobEndDate,
          responsiblePersonId: responsible,
          priority: jobPriority,
          taskDurationType: jobType
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
  },
  watch: {
    'formData.jobInstitution': function (newValue, oldValue) {
      if (newValue == oldValue) return;
      this.getResList();
    },
    visible(newValue) {
      const self = this;
      if (newValue && self.isEdit) {
        setTimeout(function () {
          Object.assign(self.formData, self.defaultFormData);
        })
      }
    }
  }
}

</script>
<style></style>
