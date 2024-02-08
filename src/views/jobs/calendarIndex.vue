<template>
  <div class="app-container home">
    <Calendar :event-data="events" :on-cell-event-click="onCellEventClick" :date-change="dateChange" />
    <create-job :visible="visible" :onCancel="showDetailCancel" :jobInstitutionOptions="departmentList"
      :jobTypeOptions="dict.type.task_duration_type" :jobPriorityOptions="dict.type.task_priority_type" :isDetail="true"
      :isEdit="true" :taskId="jobId" />
  </div>
</template>
<script>
import Calendar from '@/views/jobs/calendar';
import createJob from '@/views/jobs/createJob';
import { deptTreeSelect } from "@/api/system/user";
import { listTable } from "@/api/task/all";


export default {
  dicts: ['task_priority_type', 'task_duration_type'],
  components: { Calendar, createJob },
  data() {
    return {
      queryParams: {
        assignStartTime: undefined,
        assignEndTime: undefined,
        taskDurationTypeList: [],
      },
      dateRange: [],
      loading: false,
      jobId: null,
      departmentList: [],
      visible: false,
      events: [],
      calendarJobTypeMapping: {
        "multiMonthYear": '年任务',
        "dayGridMonth": '月任务',
        "dayGridWeek": '周任务'
      }
    }
  },
  methods: {
    async dateChange(arg) {
      const { start, end, view } = arg;
      console.log(arg);
      this.dateRange = [this.formatDate(start), this.formatDate(end)];
      this.queryParams.taskDurationTypeList = [this.calendarJobTypeMapping[view.type]];
      this.getList();
    },
    async getList() {
      this.loading = true;
      const { params, ...rest } = this.addDateRange(this.queryParams, this.dateRange);
      const { rows } = await listTable({
        ...rest,
        page: 1,
        pageSize: 99999,
        assignStartTime: params.beginTime,
        assignEndTime: params.endTime,
      });
      this.events = rows.map(item => ({
        id: item.id,
        title: item.taskName,
        start: `${item.assignStartTime} 01:00:00`,
        end: `${item.assignEndTime} 01:00:00`,
        currentStatus: item.currentStatus,
        backgroundColor: item.currentStatus === '已完成' ? '#67c23a' :
          item.currentStatus === '进行中' ? '#409eff' :
            "#909399",
        borderColor: "transparent"
      }));
      this.loading = false;
    },
    async onCellEventClick(event) {
      await this.showDetail(event);
      this.visible = true;
    },
    showDetailCancel() {
      this.visible = false;
    },
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.departmentList = response.data;
      });
    },
    async showDetail(event) {
      await this.getDeptTree();
      this.jobId = event.id;
      this.visible = true;
    },
    formatDate(date) {
      var year = date.getFullYear(); // 获取年份
      var month = (1 + date.getMonth()).toString().padStart(2, '0'); // 获取月份并补零（如果小于10）
      var day = date.getDate().toString().padStart(2, '0'); // 获取天数并补零（如果小于10）
      var hours = date.getHours().toString().padStart(2, '0'); // 获取小时并补零（如果小于10）
      var minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟并补零（如果小于10）
      var seconds = date.getSeconds().toString().padStart(2, '0'); // 获取秒数并补零（如果小于10）

      return `${year}-${month}-${day}`; // 返回格式化后的字符串
    }
  }
}
</script>
<style></style>
