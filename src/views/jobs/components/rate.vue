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
      <el-form-item label="附件" prop="field106">
        <el-upload ref="fileUpload" :file-list="fileList" :action="uploadUrl" :before-upload="handleBeforeUpload"
           list-type="picture" :headers="headers" :on-error="handleUploadError"
          :on-success="handleUploadSuccess" :on-exceed="handleExceed" multiple :limit="limit">
          <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <!-- <div style="margin-left: 100px">
        <el-image style="width: 100px; height: 100px" v-for="(item, index) in fileList" :src="item.url" :key="index"
          :previewSrcList="[item.url]" class="pre-view" v-if="item.contentType.indexOf('image') > -1">
        </el-image>
      </div> -->
    </el-form>

    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </div>

  </el-dialog>
</template>
<script>

import { addTaskRating, picUpload } from "@/api/task/all";
import { getToken } from "@/utils/auth";

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
      number: 0,
      limit: 5,
      uploadList: [],
      fileSize: 15,
      fileList: [],
      fileType: ['bmp', 'jpg', 'png', 'gif', 'svg', 'raw',],
      uploadUrl: process.env.VUE_APP_BASE_API + '/system/user/profile/picUpload',
      headers: {
        Authorization: "Bearer " + getToken(),
      },
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
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    }
  },
  methods: {
    async handleConfirm() {
      try {
        this.loading = true;
        await this.submitForm();
        this.onSubmit();
        this.onClose();
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.loading = false;
      }

    },
    onClose() {
      this.resetForm();
      this.onCancel();
      this.fileList = [];
    },
    async submitForm() {
      const valid = await this.$refs['elForm'].validate();
      if (!valid) throw new Error("验证失败！");
      const {
        rateWork,
        rateProgress,
        rateGrade,
        rateLevel,
        comment
      } = this.formData;
      if (!rateWork || !rateProgress || !rateGrade || !rateLevel) {
        throw new Error(`评分不能为空！`);
      }
      await addTaskRating({
        evaluateContent: comment,
        evaluateImage: [],
        taskId: this.selectId,
        imgUrls: this.fileList.map(f => f.path),
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
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传文件，请稍候...");
      this.number++;
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading();
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ name: res.fileName, path: res.imgUrl, url: file.url, contentType: file.raw.type });
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.splice(index, 1);
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        this.uploadList = [];
        this.number = 0;
        this.$modal.closeLoading();
      }
    },
    // 获取文件名称
    getFileName(name) {
      // 如果是url那么取最后的名字 如果不是直接返回
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return name;
      }
    },
  }
};
</script>

<style scoped>
.el-rate {
  margin-top: 8px;
}

.pre-view+.pre-view {
  margin-left: 8px;
}

.pre-view {
  margin-bottom: 8px;
}
</style>
