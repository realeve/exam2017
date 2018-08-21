<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
      <x-button class="wrapper" type="primary" @click.native="viewLucky" v-show="sport.doLottery">查看中奖列表</x-button>
      <x-button class="wrapper" type="primary" @click.native="viewChart" v-show="sport.isOnline">查看实时得分</x-button>
      <x-button class="wrapper" type="primary" @click.native="reload">{{answer_times=='0'?'查看得分':'再答一次'}}</x-button>
      <x-button class="wrapper" v-show="error_detail.length>0" @click.native="showAnswer">查看正确答案</x-button>
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
      title: "感谢参与"
    };
  },
  computed: {
    ...mapState(["sport", "userInfo", "error_detail"]),
    answer_times() {
      return this.sport.maxTimes - (this.sport.curTimes - 1);
    }
  },
  methods: {
    viewLucky() {
      this.$router.push("/lucker");
    },
    viewChart() {
      window.location.href = "?#/led"; //this.$router.push('/led');
    },
    showAnswer() {
      this.$router.push("/answer");
    },
    loadDefaultData() {
      let uid = this.sport.uid,
        sid = this.sport.id;

      db
        .getCbpcSportLuckyusers({
          uid,
          sid
        })
        .then(({ data }) => {
          let obj = data[0];
          this.isLucky = obj.prize_id > 0;
          if (!this.isLucky) {
            this.title = "未中奖";
            this.desc = `感谢您对本次活动的大力支持,你当前最高得分为${
              this.sport.curScore
            }分。`;
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

      let action = this.sport.alwaysRecordScore
        ? "getCbpcSportMain2"
        : "getCbpcSportMain";

      await db[action]({
        uid: this.sport.uid,
        sid: this.sport.id
      }).then(({ data }) => {
        this.title = "感谢参与";
        this.desc = `感谢您对本次活动的大力支持,你当前总分为${
          data[0].score
        }分(答题${data[0].answer_times}次),<br>还有${
          this.answer_times
        }次答题机会。`;
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
