<template>
  <el-dialog :visible="visible" title="任务详情" :close-on-click-modal="false" append-to-body :show-close="true"
    :close-on-press-escape="false" @close="onClose">
    <el-form size="medium" label-width="120px">
      <el-form-item label="任务名称" prop="jobName">
        <span>{{ data.taskName }}</span>
      </el-form-item>

      <el-form-item label="任务时间" prop="jobStartDate">
        <span>{{ data.assignStartTime }} - {{ data.assignEndTime }}</span>
      </el-form-item>

      <el-form-item label="逾期时长" prop="jobBeforTime">
        <span>{{ getBeforeTimeContent() }}</span>
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
      data: {},
    }
  },
  methods: {

    onClose() {
      this.resetForm("createJobForm");
      this.onCancel();
    },

    async getJobDetails(jobId) {
      const res = await getTaskDetailsById(jobId);
      this.data = res.data;
    },

    getBeforeTimeContent() {
      const { assignEndTime } = this.data;
      const passTimes = new Date(new Date().getTime() - new Date(`${assignEndTime} 00:00:00`).getTime());
      const days = Math.floor(passTimes / (1000 * 60 * 60 * 24));
      // const hours = Math.floor((passTimes % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      return `${days < 0 ? 0 : days} 天`;
    }
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
<style></style>