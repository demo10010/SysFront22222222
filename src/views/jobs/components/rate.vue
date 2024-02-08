<template>
  <el-dialog :visible="visible" title="评价" :close-on-click-modal="false" append-to-body :show-close="false"
    :close-on-press-escape="false" @close="onCancel" :z-index="10000">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="工作筹划" prop="rateWork">
        <el-rate v-model="formData.rateWork" allow-half :color="colors"></el-rate>
      </el-form-item>
      <el-form-item label="推进进度" prop="rateProgress">
        <el-rate v-model="formData.rateProgress" allow-half :color="colors"></el-rate>
      </el-form-item>
      <el-form-item label="工作成绩" prop="rateGrade">
        <el-rate v-model="formData.rateGrade" allow-half :color="colors"></el-rate>
      </el-form-item>
      <el-form-item label="上级评级" prop="rateLevel">
        <el-rate v-model="formData.rateLevel" allow-half :color="colors"></el-rate>
      </el-form-item>
      <el-form-item label="评价说明" prop="comment">
        <el-input v-model="formData.comment" type="textarea" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"></el-input>
      </el-form-item>
      <!-- <el-form-item label="附件" prop="field106">
        <el-upload ref="attachemt" :file-list="field106fileList" :action="field106Action"
          :before-upload="attachemtBeforeUpload" list-type="picture">
          <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        </el-upload>
      </el-form-item> -->

      <!-- <el-image style="width: 100px; height: 100px" :src="field106fileList[0].url" :preview-src-list="previewFileList">
      </el-image> -->
    </el-form>

    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </div>

  </el-dialog>
</template>
<script>

import { addTaskRating } from "@/api/task/all";

export default {
  dicts: ['task_score_type'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectId: {
      type: Number,
      default: null
    },
    onCancel: {
      type: Function,
      default: () => { }
    },
    onSubmit: {
      type: Function,
      default: () => { }
    },
  },
  data() {
    return {
      loading: false,
      formData: {
        rateWork: 0,
        rateProgress: 0,
        rateGrade: 0,
        rateLevel: 0,
        comment: undefined,
        field106: null,
      },
      rules: {
        rateWork: [{
          required: true,
          message: '工作筹划不能为空',
          trigger: 'change'
        }],
        rateProgress: [{
          required: true,
          message: '推进进度不能为空',
          trigger: 'change'
        }],
        rateGrade: [{
          required: true,
          message: '工作成绩不能为空',
          trigger: 'change'
        }],
        rateLevel: [{
          required: true,
          message: '上级评级不能为空',
          trigger: 'change'
        }],
        comment: [],
      },
      field106Action: 'https://jsonplaceholder.typicode.com/posts/',
      field106fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      previewFileList: []
    }
  },
  methods: {
    async handleConfirm() {
      try {
        this.loading = true;
        await this.submitForm();
        this.onSubmit();
        this.resetForm();
      } finally {
        this.loading = false;
      }

    },
    onClose() {
      this.resetForm();
      this.onCancel();
    },
    async submitForm() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return;
        const {
          rateWork,
          rateProgress,
          rateGrade,
          rateLevel,
          comment
        } = this.formData;
        await addTaskRating({
          evaluateContent: comment,
          evaluateImage: [],
          taskId: this.selectId,
          scoreList: [{
            scoreType: "工作筹划",
            scoreValue: rateWork
          }, {
            scoreType: "推进进度",
            scoreValue: rateProgress
          }, {
            scoreType: "工作成绩",
            scoreValue: rateGrade
          }, {
            scoreType: "上级评价",
            scoreValue: rateLevel
          }]
        })
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    attachemtBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
  }
};
</script>

<style scoped>
.el-rate {
  margin-top: 8px;
}
</style>
