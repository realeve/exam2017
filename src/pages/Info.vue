<template>
  <div class="home">
    <div class="content">
      <msg :title="'感谢参与调查'" :description="desc" :icon="icon"></msg>
      <x-button class="wrapper" @click.native="jump('doc')">知识学习</x-button>
    </div>
  </div>
</template>

<script>
  import {
    XButton,
    Msg
  } from 'vux'

  import {
    mapState
  } from 'vuex'

  export default {
    components: {
      XButton,
      Msg
    },
    data() {
      return {
        desc: '感谢您对本次活动的大力支持。',
        icon: 'success',
        completeNum: 0
      }
    },
    computed: {
      ...mapState(['cdnUrl', 'sport'])
    },
    methods: {
      jump(router) {
        this.$router.push(router);
      },
      // loadShareNum() {
      //   // 获取分享人数 shareNum
      //   let params = {
      //     s: '/addon/Api/Api/getSportSetting',
      //     sid: this.sport.id
      //   }
      //   this.$http.jsonp(this.cdnUrl, {
      //     params
      //   }).then(res => {
      //     let obj = res.data[0];
      //     this.desc = `感谢您对本次活动的大力支持,活动目前已有${obj.nums}人完成集赞。`
      //   });
      // },
    },
    mounted() {
      // this.loadShareNum();
      document.title = '感谢参与';
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

  .wrapper {
    width: 90%;
  }

</style>
