<template>
  <div>
    <v-header/>
    <div class="content">
      <h3>1.各部门参与率</h3>
      <ul class="dept-rate">
        <li>
          <span>部门1</span>
          <span>45.3%</span>
        </li>
        <li>
          <span>部门1</span>
          <span>45.3%</span>
        </li>
        <li>
          <span>部门1</span>
          <span>45.3%</span>
        </li>
        <li>
          <span>部门1</span>
          <span>45.3%</span>
        </li>
        <li>
          <span>部门1</span>
          <span>45.3%</span>
        </li>
      </ul>
    </div>
    <v-foot color="#333" />
  </div>
</template>

<script>
import VHeader from "../components/Header";

export default {
  components: {
    VHeader
  }
};
</script>

<style lang="less" scoped>
.content {
  text-align: left;
  padding: 10px;
  h3 {
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }
  .dept-rate {
    li {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      // span:nth-child(1) {
      //   font-weight: bold;
      // }
    }
  }
}
</style>
