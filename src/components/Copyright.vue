<template>
  <footer>
    {{year}} &copy; 成都印钞有限公司
  </footer>
</template>
<style lang="less" scoped>
footer {
  padding-bottom: 10px;
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>
<script>
export default {
  computed: {
    year() {
      let date = new Date();
      return date.getFullYear();
    }
  }
};
</script>
