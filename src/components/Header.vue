<template>
  <div class="head">
    <!-- <img class="logo" src="../assets/img/main.jpg"> -->
    <div class="title">
      {{sportName}}微信答题活动
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    sportName() {
      return this.$store.state.sport.name;
    }
  }
};
</script>

<style scoped lang="less">
.head {
  text-align: center;
  width: 100%;
  padding: 0;
  margin: 0;
  background-image: url("../assets/img/main.jpg");
  height: 232px;
  background-size: cover;
  background-position: center top;
  .title {
    font-weight: 100;
    font-size: 16pt;
    margin-top: -50px;
    color: #fff;
    margin-bottom: 0px;
  }
  .logo {
    width: 100%;
    height: 100%;
  }
}
</style>
