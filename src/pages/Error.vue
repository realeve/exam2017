<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
    </div>
  </div>
</template>

<script>
import { Msg } from "vux";
import qs from "qs";

export default {
  components: {
    Msg
  },
  data() {
    return {
      icon: "warn",
      desc: `请扫描屏幕二维码登录参与答题`,
      title: "链接无效"
    };
  },
  mounted() {
    let state = window.location.href.includes("?state=0")
      ? 0
      : window.location.href.includes("?state=1")
      ? 1
      : 2;
    let idx = [
      { desc: `请扫描屏幕二维码登录参与答题`, title: "链接无效" },
      {
        title: "链接超时",
        desc: "二维码超时，请重新扫码。"
      }
    ];

    let item = idx[state];
    if (item) {
      this.desc = item.desc;
      this.title = item.title;
    }
  }
};
</script>

<style scoped lang="less">
.home {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-weight: 100;
  .content {
    flex: 1;
  }
}

.wrapper {
  width: 90%;
}
</style>
