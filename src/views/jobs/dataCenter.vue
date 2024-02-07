<template>
  <div style="padding: 10px;">
    <el-form :model="queryParams" ref="queryForm" size="medium" :inline="true" class="job-form" label-width="68px"
      style="margin-left: 10px;margin-top: 16px;">
      <el-form-item label="用户名称" prop="department" v-hasRole="['admin', 'deptLeader', 'officeLeader']">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名称"/>
      </el-form-item>
      <el-form-item class="form-action">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>任务情况统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" :style="{ height: cardHeight - 40 + 'px' }" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>已完成任务</span></div>
          <el-table class="job-card-tb" v-loading="loading" :data="completeList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="评价" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="showDetail(scope.row)">查看评价</el-button> -->
              </template>
            </el-table-column>
            <el-table-column label="任务详情" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="showDetail(scope.row)">查看详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>逾期未完成任务</span></div>
          <el-table class="job-card-tb" v-loading="loading" :data="completeList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="开始时间" align="center" prop="taskDetail" :show-overflow-tooltip="true" />
            <el-table-column label="结束时间" align="center" prop="taskDetail" :show-overflow-tooltip="true" />
            <el-table-column label="任务详情" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="showDetail(scope.row)">查看详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :style="{ height: cardHeight + 'px' }" class="data-center-card-item">
          <div slot="header"><span>进行中的任务</span></div>
          <el-table class="job-card-tb" v-loading="loading" :data="completeList" style="width: 100%;">
            <el-table-column label="序号" width="50" align="center" type="index" />
            <el-table-column label="任务名称" align="center" prop="taskName" :show-overflow-tooltip="true" />
            <el-table-column label="任务进度" align="left" prop="percent" width="120">
              <template slot-scope="scope">
                <el-progress :percentage="20"></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="任务详情" width="100" align="center" prop="taskDetail" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <!-- <el-button type="text" @click="showDetail(scope.row)">查看详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>
  
<script>
import { getCache } from "@/api/monitor/cache";
import * as echarts from "echarts";

export default {
  name: "DataCenter",
  data() {
    return {
      commandstats: null,
      completeList: [],
      beforeList: [],
      progressList: [],
      loading: false,
      queryParams: {
        userName: '',
      },
    }
  },
  computed: {
    cardHeight() {
      return `${(window.innerHeight - 230) / 2}`;
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getCache().then((response) => {
        this.cache = response.data;

        this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
        this.commandstats.setOption({
          tooltip: {
            trigger: 'item'
          },

          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              // avoidLabelOverlap: false,
              label: {
                show: true,
                formatter(param) {
                  // correct the percentage
                  return param.name + ' (' + param.percent * 2 + '%)';
                }
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: [
                { value: 580, name: '进行中' },
                { value: 484, name: '逾期未完成' },
                { value: 300, name: '已完成' }
              ]
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
      });
    },
  }
};
</script>
<style scoped>
.data-center-card-item {
  margin: 10px;
  height: calc(100% - 20px);
  overflow: auto;
  border: 3px solid transparent;
}
</style>
  