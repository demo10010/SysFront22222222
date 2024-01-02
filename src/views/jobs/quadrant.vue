<template>
    <div class="quadrant-container">
      <div class="quadrant-row">
        <div class="quadrant">
          <h3>重要且紧急</h3>
          <ul>
            <li v-for="(item, index) in quadrant1List" :key="index">{{ item }}</li>
          </ul>
          <button @click="changePage('quadrant1', 'prev')">上一页</button>
          <button @click="changePage('quadrant1', 'next')">下一页</button>
        </div>
        <div class="quadrant">
          <h3>重要不紧急</h3>
          <ul>
            <li v-for="(item, index) in quadrant2List" :key="index">{{ item }}</li>
          </ul>
          <button @click="changePage('quadrant2', 'prev')">上一页</button>
          <button @click="changePage('quadrant2', 'next')">下一页</button>
        </div>
      </div>
      <div class="quadrant-row">
        <div class="quadrant">
          <h3>紧急不重要</h3>
          <ul>
            <li v-for="(item, index) in quadrant3List" :key="index">{{ item }}</li>
          </ul>
          <button @click="changePage('quadrant3', 'prev')">上一页</button>
          <button @click="changePage('quadrant3', 'next')">下一页</button>
        </div>
        <div class="quadrant">
          <h3>不重要不紧急</h3>
          <ul>
            <li v-for="(item, index) in quadrant4List" :key="index">{{ item }}</li>
          </ul>
          <button @click="changePage('quadrant4', 'prev')">上一页</button>
          <button @click="changePage('quadrant4', 'next')">下一页</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        quadrant1List: [],
        quadrant2List: [],
        quadrant3List: [],
        quadrant4List: [],
        // 这里省略了分页数据和获取数据的方法
      };
    },
    methods: {
      changePage(quadrant, direction) {
        // 这里写分页逻辑，根据象限和方向更新列表数据
      },
    },
  };
  </script>
  
  <style scoped>
  .quadrant-container {
    display: flex;
    flex-direction: column;
  }
  .quadrant-row {
    display: flex;
    justify-content: space-between;
  }
  .quadrant {
    width: 45%;
  }
  </style>