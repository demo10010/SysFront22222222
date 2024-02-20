<template>
  <el-dialog :visible="visible" title="任务详情" :close-on-click-modal="false" append-to-body :show-close="true"
    :close-on-press-escape="false" @close="onClose">
    <el-form size="medium" label-width="120px">
      <el-form-item label="任务名称" prop="jobName">
        <span>{{ data.taskName }}</span>
      </el-form-item>
      <el-form-item label="任务内容" prop="jobContent">
        <span>{{ data.taskDetail }}</span>
      </el-form-item>
      <el-form-item label="承办科室" prop="jobInstitution">
        <span>{{ data.principalDept }}</span>
      </el-form-item>
      <el-form-item label="责任人" prop="responsible">
        <span>{{ data.principalUser }}</span>
      </el-form-item>
      <el-form-item label="任务时间" prop="jobStartDate">
        <span>{{ data.assignStartTime }} - {{ data.assignEndTime }}</span>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="显示层级" prop="jobLevel">
            <span>{{ data.showLevel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关注值" prop="jobLevelFocusValue" label-width="80px">
            <span>{{ data.attentionLevel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否锁定" prop="jobLevelLockedValue" label-width="80px">
            <span>{{ data.hasLocked ? '是' : '否' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="阶段划分" prop="jobStage">
        <span>{{ data.stageList.length > 0 ? '是' : '否' }}</span>
      </el-form-item>
      <div style="max-height: 400px;overflow-y:scroll;" class="stage-card-list" v-if="data.stageList.length > 0">
        <stage-card-static v-for="(item, index) in data.stageList" :key="index" :item="item" :index="index" />
      </div>
      <el-form-item label="重要程度" prop="jobPriority">
        <span>{{ data.priorityName }}</span>
      </el-form-item>
      <el-form-item label="时长类型" prop="jobType">
        <span>{{ data.taskDurationType }}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>

import { getTaskDetailsById } from "@/api/task/all";
import StageCardStatic from '@/views/jobs/components/stagecardStatic';


export default {
  components: { StageCardStatic },
  props: ['visible', 'taskId', 'onCancel'],
  data() {
    return {
      data: {
        stageList: []
      },
    }
  },
  methods: {

    onClose() {
      this.resetForm("createJobForm");
      this.onCancel();
    },

    async getJobDetails(jobId) {
      const res = await getTaskDetailsById(jobId);
      const { taskPhaseList, principalList, principalDeptList, ...rest } = res.data;
      this.data = {
        ...rest,
        principalDept: principalDeptList?.map(x => x.deptName)?.join(", "),
        principalUser: principalList?.map(x => x.userName)?.join(", "),
        stageList: taskPhaseList?.map(item => ({
          stageName: item.phaseName,
          stageTimeRange: `${item.phaseStartTime} - ${item.phaseEndTime}`,
          stageContent: item.phaseContent
        })) || []
      }
    },
  },
  watch: {
    visible(newValue) {
      const self = this;

      if (newValue && self.taskId) {
        self.getJobDetails(self.taskId);
      }
    },
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