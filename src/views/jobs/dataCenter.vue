<template>
  <div style="padding: 10px;">
    <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px"
      style="margin-left: 10px;margin-bottom: -16px; margin-top: 4px;">
      <!-- <el-form-item label="用户名称" prop="department" v-hasRole="['admin', 'deptLeader', 'officeLeader']">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" />
      </el-form-item> -->
      <el-form-item label="任务时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="form-action">
        <el-button type="primary" icon="el-icon-search" @click="getList" :disabled="loading">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>任务情况统计</span></div>
          <div style="margin-top: 4px;">
            <div ref="commandstats" :style="{ height: cardHeight - 90 + 'px' }" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>已完成任务</span>（<span>数量：{{ completeList.length }}</span>）</div>
          <el-table class="job-card-tb" v-loading="loading" :data="completeList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="评价" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="text" @click="showRatingHistory(scope.row)" class="table-btn"
                  v-hasRole="['admin', 'deptLeader', 'officeLeader']">查看评价</el-button>
              </template>
            </el-table-column>
            <el-table-column label="任务详情" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row)" class="table-btn">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>逾期未完成任务</span>（<span>数量：{{ beforeList.length }}</span>）</div>
          <el-table class="job-card-tb" v-loading="loading" :data="beforeList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="开始时间" align="center" prop="assignStartTime" :show-overflow-tooltip="true" />
            <el-table-column label="结束时间" align="center" prop="assignEndTime" :show-overflow-tooltip="true" />
            <el-table-column label="任务详情" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="text" @click="showBeforeDetail(scope.row)" class="table-btn">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>进行中的任务</span>（<span>数量：{{ progressList.length }}</span>）</div>
          <el-table class="job-card-tb" v-loading="loading" :data="progressList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="任务进度" align="left" prop="percent" width="120">
              <template slot-scope="{row}">
                <el-progress :percentage="row.processPercentage"></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="任务详情" width="100" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row)" class="table-btn">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <job-detail :visible="visible" :taskId="selectRow.id" :onCancel="showDetailCancel" />
    <job-before-detail :visible="beforeVisible" :taskId="selectRow.id" :onCancel="showBeforeDetailCancel" />
    <rate-history :visible="ratingHistoryVisible" :onCancel="cancelRatingHistory" :selectId="selectRow.id" />

  </div>
</template>

<script>
import * as echarts from "echarts";
import { listTable } from "@/api/task/all";
import RateHistory from '@/views/jobs/components/rateHistory';
import JobDetail from '@/views/jobs/components/jobDetail';
import JobBeforeDetail from '@/views/jobs/components/jobBeforeDetail';


export default {
  name: "DataCenter",
  components: { JobBeforeDetail, JobDetail, RateHistory },
  data() {
    return {
      commandstats: null,
      completeList: [],
      beforeList: [],
      progressList: [],
      loading: false,
      visible: false,
      beforeVisible: false,
      selectRow: {},
      queryParams: {
        userName: '',
      },
      dateRange: [],
      ratingHistoryVisible: false
    }
  },
  computed: {
    cardHeight() {
      return `${(window.innerHeight - 156) / 2}`;
    },
  },
  created() {
    setTimeout(() => {
      this.getList();
    }, 100)
  },
  methods: {
    async getJobList() {
      this.loading = true;
      const { params, ...rest } = this.addDateRange(this.queryParams, this.dateRange);
      const { rows, total } = await listTable({
        ...rest,
        page: 1,
        pageSize: 99999,
        assignStartTime: params.beginTime,
        assignEndTime: params.endTime,
      });
      this.loading = false;
      return { rows, total };
    },
    formatAndSetData(data) {
      if (!data) {
        return [
          { value: 0, name: '进行中' },
          { value: 0, name: '逾期未完成' },
          { value: 0, name: '已完成' }
        ]
      }

      let progressData = [];
      let beforeData = [];
      let completeData = [];

      data.forEach(m => {
        const { assignEndTime, currentStatus } = m;
        const isBefore = new Date(assignEndTime).getTime() < new Date().getTime();
        if (isBefore) return beforeData.push(m);
        const isComplete = currentStatus === '已完成';
        if (isComplete) return completeData.push(m);
        progressData.push(m);
      });

      this.progressList = progressData;
      this.beforeList = beforeData;
      this.completeList = completeData;

      return [
        { value: progressData.length, name: '进行中' },
        { value: beforeData.length, name: '逾期未完成' },
        { value: completeData.length, name: '已完成' }
      ]
    },
    async getList() {
      const { rows, total } = await this.getJobList();
      const data = this.formatAndSetData(rows);
      this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
      this.commandstats.setOption({
        tooltip: {
          trigger: 'item'
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: String(total || 0),
            textAlign: 'center',
            fill: '#000',
            fontSize: 18
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '55%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter(param) {
                // correct the percentage
                return param.name + ' (' + param.percent.toFixed(2) + '%)';
              }
            },
            itemStyle: {
              emphasis: {}
            },
            labelLine: {
              show: true
            },
            data
          }
        ],
        legend: {
          left: '5%',
          left: 'left'
        },
      });
      window.addEventListener("resize", () => {
        this.commandstats.resize();
      });
    },
    showDetail(row) {
      this.visible = true;
      this.selectRow = row;
    },
    showBeforeDetail(row) {
      this.beforeVisible = true;
      this.selectRow = row;
    },
    showDetailCancel() {
      this.visible = false;
      this.selectRow = {};
    },
    showBeforeDetailCancel() {
      this.beforeVisible = false;
      this.selectRow = {};
    },
    showRatingHistory(row) {
      this.selectRow = row;
      this.ratingHistoryVisible = true;
    },
    cancelRatingHistory() {
      this.ratingHistoryVisible = false;
      this.selectRow = {};
    },
  }
};
</script>
<style scoped>
.data-center-card-item {
  margin: 2px;
  height: calc(100% - 4px);
  overflow: auto;
  border: 3px solid transparent;
}

.el-table .el-table__header-wrapper th,
.el-table .el-table__fixed-header-wrapper th {
  height: auto !important;
}

.table-btn.el-button {
  padding: 0;
}

.el-table {
  th {
    padding: 2px;
  }

  td {
    padding: 2px;
  }
}
</style>