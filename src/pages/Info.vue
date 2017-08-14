<template>
  <div class="home">
    <div class="content">
      <msg :title="'感谢参与调查'" :description="desc" :icon="icon"></msg>
    </div>
  </div>
</template>

<script>
import {
  Msg
} from 'vux'

import {
  mapState
} from 'vuex'

export default {
  components: {
    Msg
  },
  data() {
    return {
      desc: '感谢您对本次活动的大力支持,活动目前已有110人完成集赞。',
      icon: 'success'     
    }
  }
}

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

</style>
