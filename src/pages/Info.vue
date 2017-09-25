<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
      <x-button class="wrapper" type="primary" @click.native="viewLucky" v-show="sport.doLottery">查看中奖列表</x-button>
      <x-button class="wrapper" type="primary" @click.native="viewChart" v-show="sport.isOnline">查看实时得分</x-button>
    </div>
  </div>
</template>

<script>
import {
  XButton,
  Msg
} from 'vux'

import {
  dateFormat
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
      icon: 'success',
      completeNum: 0,
      desc: ``,
      title: '感谢参与'
    }
  },
  computed: {
    ...mapState(['cdnUrl', 'sport', 'userInfo']),
  },
  methods: {
    viewLucky() {
      this.$router.push('/lucker');
    },
    viewChart() {
      this.$router.push('/led');
    },
    loadDefaultData() {
      let params = {
        s: '/addon/Api/Api/setExamLuckyInfo',
        uid: this.sport.uid,
        sportid: this.sport.id,
        headimgurl: this.userInfo.headimgurl,
        openid: this.userInfo.openid,
        nickname: this.userInfo.nickname,
        rec_time: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data;
        if (obj.id > 0) {
          this.isLucky = (obj.prize_level == 1);

          if (!this.isLucky) {
            this.title = '未中奖';
            this.desc = `感谢您对本次活动的大力支持,你当前最高得分为${this.sport.curScore}分。`;
            return;
          }
          this.title = '中奖了';
          this.desc = '恭喜您成为本次活动的幸运用户。';
          return;
        }

        this.title = '抽奖出错';
        this.desc = '请返回后重新进入答题页面，系统将自动抽奖';

      });
    },
  },
  mounted() {
    if (this.sport.doLottery) {
      this.loadDefaultData();
    } else {
      this.title = '感谢参与';
      this.desc = `感谢您对本次活动的大力支持,你当前最高得分为${this.sport.curScore}分。`;
    }
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
