<template>
  <create-job :visible="visible" :onCancel="showDetailCancel" :jobInstitutionOptions="departmentList"
    :jobTypeOptions="taskDurationList" :jobPriorityOptions="taskPriorityList" :isDetail="true" :isEdit="true"
    :defaultFormData="defaultJobEditData" />
</template>
<script>

import createJob from '@/views/jobs/createJob';

export default {
  components: { createJob },
  props: {
    departmentList: {
      type: Array,
      default: new Array([])
    },
    taskDurationList: {
      type: Array,
      default: new Array([])
    },
    taskPriorityList: {
      type: Array,
      default: new Array([])
    },
    visible: {
      type: Boolean,
      default: false
    },
    onCancel: {
      type: Function,
      default: () => { }
    },
    jobId: {
      type: Number,
      default: 0,
    },
    defaultJobEditData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      selectRow: {},
    }
  },
  mounted: function () {
  },
  methods: {
    
    showDetailCancel() {
      this.onCancel();
    },
  },
};
</script>

<style scoped></style>
