<template>
  <el-card style="margin:10px;height: calc(100% - 20px);overflow: auto;">
    <el-tag style="margin-bottom: 16px;" effect="dark">{{ currentLabel }}</el-tag>
    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
      <el-table-column label="任务详情">
        <template #default="scope">
            <el-popover trigger="hover" placement="top">
              <div v-html="scope.row.taskDetail"></div>
              <template #reference>
                  <el-button size="small">查看</el-button>
              </template>
            </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="责任人" align="center" prop="responsiblePersonName" :show-overflow-tooltip="true" />
      <el-table-column label="截止时间" align="center" prop="assignEndTime" :show-overflow-tooltip="true" />
      <el-table-column label="耗时百分比" align="left" prop="percent">
        <template slot-scope="scope">
          <el-progress :percentage="getJobPercent(scope.row)"
            :status="scope.row.completeTime ? 'success' : (scope.row.taskPercent > 100 ? 'exception' : undefined)"></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </el-card>
</template>
<script>
export default {
  props: {
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
      loading: false,
      list: [],
      total: 0,
      needSearching: this.searching,
      queryParams: {
        pageNum: 1,
        currentStatus: "进行中",
        pageSize: 10
      }
    }
  },
  mounted: function () {
    this.getList();
  },
  methods: {
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
