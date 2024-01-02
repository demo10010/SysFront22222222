<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
  data() {
    return {
      url: 'http://xxx.com/sys-vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>