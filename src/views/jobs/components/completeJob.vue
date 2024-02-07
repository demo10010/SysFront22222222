<template>
  <el-dialog :visible="visible" title="完成任务" :close-on-click-modal="false" append-to-body :show-close="false"
    :close-on-press-escape="false" @close="onCancel" :z-index="10000" width="800">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="结束日期" prop="completedDate">
        <el-date-picker v-model="formData.completedDate" style="width: 240px" value-format="yyyy-MM-dd" type="date"
          placeholder="请选择"></el-date-picker>

      </el-form-item>
      <el-form-item label="评论" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"></el-input>
      </el-form-item>

      <el-form-item label="附件" prop="field106">
        <el-upload ref="attachemt" :file-list="field106fileList" :action="field106Action"
          :before-upload="attachemtBeforeUpload" list-type="picture">
          <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-image style="width: 100px; height: 100px" :src="field106fileList[0].url" :preview-src-list="previewFileList">
      </el-image>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="confirmCompletedDate">确 定</el-button>
    </span>

  </el-dialog>
</template>
<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
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
      formData: {
        completedDate: null,
        remark: undefined,
        field106: null,
      },
      rules: {
        completedDate: [{
          required: true,
          message: '完成时间不能为空',
          trigger: 'change'
        }],
        remark: '',
      },
      field106Action: 'https://jsonplaceholder.typicode.com/posts/',
      field106fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      previewFileList: []
    }
  },
  methods: {
    confirmCompletedDate() {
      this.submitForm();
    },
    onClose() {
      this.resetForm();
      this.onCancel();
    },
    submitForm() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return
        this.onSubmit(this.formData);
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
  