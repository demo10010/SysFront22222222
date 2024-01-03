<template>
  <div class="center">
    <img v-if="thumbup && visible" :src="thumbup" style="width: 24px; height: 24px;" class="shake-animation" />
    <el-button type="text" @click="completed" v-if="!visible">完成</el-button>
  </div>
</template>
<script>

import thumbUp from '@/assets/images/thumbup.png'

export default {
  props: ['finish'],
  created() {
  },
  data() {
    return {
      thumbup: thumbUp,
      visible: false,
    }
  },
  methods: {
    async completed() {
      await this.finish();
      this.visible = true;
    }
  },
}

</script>
<style>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.shake-animation {
  animation: shake 0.8s infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
