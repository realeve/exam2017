<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
      <x-button class="wrapper" @click.native="viewLucky" v-show="sport.doLottery">查看中奖列表</x-button>
      <x-button class="wrapper" @click.native="viewChart" v-show="sport.isOnline">查看实时得分</x-button>
      <x-button class="wrapper" @click.native="reload">{{answer_times=='0'?'查看得分':'再答一次'}}</x-button>
      <x-button
        class="wrapper"
        type="primary"
        v-show="error_detail.length>0"
        @click.native="showAnswer"
      >查看正确答案</x-button>
      <!-- <x-button class="wrapper" @click.native="scoreList">得分排行榜</x-button> -->
      <!-- <x-button class="wrapper" @click.native="jump('errlist')">我的错题集</x-button> -->
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
  },
  computed: {
    ...mapState(["sport", "userInfo", "error_detail"]),
    answer_times() {
      return this.sport.maxTimes - this.sport.curTimes;
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    viewLucky() {
      this.$router.push("/lucker");
    },
    viewChart() {
      window.location.href = "?#/led"; //this.$router.push('/led');
    },
    scoreList() {
      this.$router.push("/score");
    },
    showAnswer() {
      this.$router.push("/answer");
    },
    loadDefaultData() {
      let uid = this.sport.uid,
        sid = this.sport.id;

      db.getCbpcSportLuckyusers({
        uid,
        sid
      })
        .then(({ data }) => {
          let obj = data[0];
          this.isLucky = obj.prize_id > 0;
          if (!this.isLucky) {
            this.title = "未中奖";
            this.desc = `感谢您对本次活动的大力支持,你当前最高得分为${this.sport.curScore}分。`;
            return;
          }
          this.title = "中奖了";
          this.desc = "恭喜您成为本次活动的幸运用户。";
        })
        .catch(res => {
          this.title = "抽奖出错";
          this.desc = "请返回后重新进入答题页面，系统将自动抽奖";
        });
    },
    reload() {
      if (this.answer_times == 0) {
        this.$router.push("/score");
        return;
      }
      window.location.href = window.location.href.split("#")[0];
    },
    loadCurScore: async function() {
      if (!this.sport.cardNo) {
        this.$router.push("/");
        return;
      }

      //alwaysRecordScore
      let action = this.sport.stackMode
        ? "getCbpcSportMain2"
        : "getCbpcSportMain";

      await db[action]({
        uid: this.sport.uid,
        sid: this.sport.id
      }).then(({ data }) => {
        let maxScore = Math.max(data[0].score, this.sport.curScore);
        this.title = `本次得分${this.sport.curScore}分`; // maxScore >= 90 ? "恭喜你过关了" : "哎呀，差一点就过了";  、、<br>还有${this.answer_times + 1}次答题机会。
        this.desc = `感谢您对本次活动的大力支持`;
        /**
         * ,你当前总分为${maxScore}分(答题${
          data[0].answer_times
        }次)。
         */
      });
    }
  },
  mounted() {
    if (this.sport.doLottery) {
      this.loadDefaultData();
    } else {
      this.loadCurScore();
    }
    document.title = "感谢参与";
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
