<template>
  <el-dialog :visible="visible" title="查看评价历史" :close-on-click-modal="false" append-to-body :close-on-press-escape="false"
    @close="onClose">
    <div class="ave-rating" v-for="(item, index) in totalScore" :key="index">
      <span style="margin-right: 8px">{{ item.scoreType }}</span>
      <el-rate v-model="item.scoreValue" allow-half :color="colors" show-score disabled></el-rate>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="evaluateBy" label="评价人"></el-table-column>
      <el-table-column prop="score" label="星级评价平均分">
        <template slot-scope="{ row }">
          <el-rate v-model="row.averageScore" allow-half :color="colors" show-score disabled></el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="evaluateContent" label="评价"></el-table-column>

      <!-- <el-table-column label="附件">
        <template slot-scope="{ row }">
          {{ row.attachment }}
        </template>
      </el-table-column> -->
    </el-table>
  </el-dialog>
</template>
<script>

import { getTaskRatingHistory } from "@/api/task/all";

export default {
  props: {
    selectId: {
      type: Number,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false
    },
    onCancel: {
      type: Function,
      default: () => { }
    },

  },
  data() {
    return {
      totalScore: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      tableData: []
    }
  },
  methods: {
    async getRateHistory(jobId) {
      const { allScoreList, taskTotalScore } = await getTaskRatingHistory(jobId);
      this.tableData = allScoreList;
      this.totalScore = taskTotalScore;
    },
    onClose() {
      this.totalScore = [];
      this.tableData = [];
      this.onCancel();
    }
  },
  watch: {
    'selectId': function (newValue) {
      if (!newValue && !this.visible) return;
      this.getRateHistory(newValue);
    }
  }
};
</script>

<style scoped>
.ave-rating {
  margin-bottom: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
</style>
