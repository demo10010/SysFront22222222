<template>
  <div class="app-container home">
    <Calendar :event-data="events" :on-cell-event-click="onCellEventClick" :date-change="dateChange" />
    <job-detail :visible="visible" :taskId="jobId" :onCancel="showDetailCancel" />
  </div>
</template>
<script>
import Calendar from '@/views/jobs/calendar';
import JobDetail from '@/views/jobs/components/jobDetail';
import { listTable } from "@/api/task/all";
import {
  formatDate
} from "@/views/jobs/calendar/util";

export default {
  components: { Calendar, JobDetail },
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
      visible: false,
      events: [],
      calendarJobTypeMapping: {
        "multiMonthYear": '年任务',
        "quarter": '季任务',
        "dayGridMonth": '月任务',
        "dayGridWeek": '周任务'
      }
    }
  },
  methods: {
    async dateChange(arg) {
      const { start, end, view } = arg;
      this.dateRange = [formatDate(start, 'days'), formatDate(end, 'days')];
      this.queryParams.taskDurationTypeList = [this.calendarJobTypeMapping[view]];
      this.getList();
    },
    async getList() {
      this.loading = true;
      const { params, ...rest } = this.addDateRange(this.queryParams, this.dateRange);
      const { rows } = await listTable({
        ...rest,
        page: 1,
        pageSize: 99999,
        intersectionalStartTime: params.beginTime,
        intersectionalEndTime: params.endTime,
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

    async showDetail(event) {
      this.jobId = event.id;
      this.visible = true;
    },
  }
}
</script>
<style></style>
