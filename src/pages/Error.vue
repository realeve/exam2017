<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
    </div>
  </div>
</template>

<script>
import { XButton, Msg } from "vux";

import { dateFormat } from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";
export default {
  components: {
    XButton,
    Msg
  },
  data() {
    return {
      icon: "success",
      completeNum: 0,
      desc: ``,
      title: "感谢您的参与"
    };
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
