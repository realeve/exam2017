<template>
  <div class="head">
    <img class="logo" src="/static/img/bg.jpg">
    <div class="title">
      {{sportName}}微信答题活动
    </div>
  </div>
</template>
<script>
export default {
  computed:{
    sportName(){
      return this.$store.state.sport.name;
    }
  }
}
</script>

<style scoped lang="less">
  .head {
    text-align: center;
    width: 100%;
    padding: 0;
    margin: 0;
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
