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

const data = {
  'rows': [
    {
      'createBy': null,
      'createTime': '2024-01-02 21:58:09',
      'updateBy': null,
      'updateTime': '2024-01-08 22:45:46',
      'remark': null,
      'id': 40,
      'taskName': 'ddd单位周任务',
      'taskDetail': '测试',
      'assignStartTime': '2024-01-01',
      'assignEndTime': '2024-01-07',
      'actualStartTime': null,
      'completeTime': '2024-01-04',
      'priority': 2,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '进行中',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-03',
      'deleteFlag': 0,
      'taskDurationType': '周任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 15:32:34',
      'updateBy': null,
      'updateTime': '2024-02-03 22:24:32',
      'remark': null,
      'id': 41,
      'taskName': '测试任务2222测试任务2222',
      'taskDetail': '自1月3日零时起，12306推出购票需求预填和火车票起售提醒订阅两项新功能，旅客通过12306购票将更加方便快捷。 ',
      'assignStartTime': '2024-01-01',
      'assignEndTime': '2024-01-29',
      'actualStartTime': null,
      'completeTime': '2024-01-03',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '103',
      'responsiblePersonId': '1',
      'currentStatus': '进行中',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-03',
      'deleteFlag': 0,
      'taskDurationType': '月任务',
      'deptName': '人力资源科室',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 15:36:52',
      'updateBy': null,
      'updateTime': '2024-01-03 22:45:40',
      'remark': null,
      'id': 42,
      'taskName': '部门月任务1',
      'taskDetail': '月任务',
      'assignStartTime': '2024-01-01',
      'assignEndTime': '2024-02-03',
      'actualStartTime': null,
      'completeTime': '2024-01-03',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '101',
      'responsiblePersonId': '1',
      'currentStatus': '进行中',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-03',
      'deleteFlag': 0,
      'taskDurationType': '月任务',
      'deptName': '人力资源部门',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:22:07',
      'updateBy': null,
      'updateTime': '2024-01-06 16:27:11',
      'remark': null,
      'id': 43,
      'taskName': '年任务',
      'taskDetail': '年任务',
      'assignStartTime': '2024-01-02',
      'assignEndTime': '2024-11-03',
      'actualStartTime': null,
      'completeTime': '2024-01-06',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-06',
      'deleteFlag': 0,
      'taskDurationType': '年任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:22:26',
      'updateBy': null,
      'updateTime': '2024-01-06 16:24:03',
      'remark': null,
      'id': 44,
      'taskName': 'ddsds',
      'taskDetail': 'sadasd',
      'assignStartTime': '2024-01-02',
      'assignEndTime': '2024-08-03',
      'actualStartTime': null,
      'completeTime': '2024-01-06',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-06',
      'deleteFlag': 0,
      'taskDurationType': '年任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:22:47',
      'updateBy': null,
      'updateTime': '2024-01-06 15:51:27',
      'remark': null,
      'id': 45,
      'taskName': 'dsadasd',
      'taskDetail': 'asdasd',
      'assignStartTime': '2024-01-02',
      'assignEndTime': '2024-03-03',
      'actualStartTime': null,
      'completeTime': '2024-01-06',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-06',
      'deleteFlag': 0,
      'taskDurationType': '季任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:25:18',
      'updateBy': null,
      'updateTime': '2024-01-03 23:26:49',
      'remark': null,
      'id': 46,
      'taskName': 'xzfcdcfds',
      'taskDetail': 'sadasdas',
      'assignStartTime': '2024-01-02',
      'assignEndTime': '2024-02-23',
      'actualStartTime': null,
      'completeTime': '2024-01-03',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-03',
      'deleteFlag': 0,
      'taskDurationType': '季任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:27:31',
      'updateBy': null,
      'updateTime': '2024-01-06 15:50:51',
      'remark': null,
      'id': 47,
      'taskName': 'sadasd',
      'taskDetail': 'sadasd',
      'assignStartTime': '2024-01-02',
      'assignEndTime': '2024-01-14',
      'actualStartTime': null,
      'completeTime': '2024-01-06',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-06',
      'deleteFlag': 0,
      'taskDurationType': '月任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-03 23:42:48',
      'updateBy': null,
      'updateTime': '2024-01-06 15:50:44',
      'remark': null,
      'id': 48,
      'taskName': 'adsdasd',
      'taskDetail': 'sdasd',
      'assignStartTime': '2024-03-03',
      'assignEndTime': '2024-03-07',
      'actualStartTime': null,
      'completeTime': '2024-01-06',
      'priority': 1,
      'timePercentage': null,
      'deptNameId': '100',
      'responsiblePersonId': '1',
      'currentStatus': '已完成',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-01-06',
      'deleteFlag': 0,
      'taskDurationType': '周任务',
      'deptName': '160单位',
      'responsiblePersonName': 'admin'
    },
    {
      'createBy': null,
      'createTime': '2024-01-06 16:09:49',
      'updateBy': null,
      'updateTime': '2024-02-05 21:49:08',
      'remark': null,
      'id': 49,
      'taskName': '紧急不重要',
      'taskDetail': 'test',
      'assignStartTime': '2024-01-06',
      'assignEndTime': '2024-01-13',
      'actualStartTime': null,
      'completeTime': null,
      'priority': 3,
      'timePercentage': null,
      'deptNameId': '101',
      'responsiblePersonId': '6',
      'currentStatus': '进行中',
      'rating': null,
      'selfComment': null,
      'otherComment': null,
      'deleteTime': '2024-02-05',
      'deleteFlag': 0,
      'taskDurationType': '周任务',
      'deptName': '人力资源部门',
      'responsiblePersonName': 'admin002'
    }
  ]
}

export default {
  dicts: ['task_priority_type', 'task_duration_type'],
  components: { Calendar, createJob },
  data() {
    return {
      queryParams: {
        assignStartTime: undefined,
        assignEndTime: undefined,
        taskDurationType: undefined,
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
      this.queryParams.taskDurationType = this.calendarJobTypeMapping[view.type];
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
