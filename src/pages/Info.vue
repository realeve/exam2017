<template>
  <div class="home">
    <div class="content">
      <msg :title="title" :description="desc" :icon="icon"></msg>
      <x-button class="wrapper" @click.native="viewLucky" v-show="sport.doLottery">查看中奖列表</x-button>
      <x-button class="wrapper" @click.native="viewChart" v-show="sport.isOnline">查看实时得分</x-button>
      <!-- <x-button class="wrapper" @click.native="reload">{{answer_times=='0'?'查看得分':'再答一次'}}</x-button> -->
      <!-- <x-button class="wrapper" @click.native="reload">查看得分</x-button> -->

      <x-button v-if="isAdmin" @click.native="jump('user')">修改用户信息</x-button>
      <x-button v-if="isAdmin" @click.native="reset">清空得分</x-button>

      <x-button
        class="wrapper"
        type="primary"
        v-show="error_detail.length>0"
        @click.native="showAnswer"
      >查看正确答案</x-button>
      <!-- <x-button class="wrapper" @click.native="scoreList">得分排行榜</x-button> -->
      <!-- <x-button class="wrapper" @click.native="jump('errlist')">我的错题集</x-button> -->

      <!-- <div class="marquee" style="margin-top:20px;">
        <marquee scrollamount="10">当前时间:{{clock}} 当前时间:{{clock}} 当前时间:{{clock}}</marquee>
      </div>-->
      <!-- <div class="item">
        <p class="title" :style="!isValid?'color:#e23':''">身份校验：{{isValid?'通过':'未通过'}}</p>

        <div class="row">
          <div class="column" style="align-items:flex-start;">
            <p>姓名：{{dbUserInfo.username}}</p>
            <p>部门：{{dbUserInfo.deptname}}</p>
            <p>卡号：{{dbUserInfo.cardno}}</p>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <div style="margin:10px 0">1.本机微信</div>
            <img style="margin:10px 0" :src="userInfo.headimgurl" alt />
            <div style="font-weight:bold;">{{userInfo.nickname}}</div>
          </div> 
        </div>
      </div>-->
    </div>
    <confirm v-model="showConfirm" title="系统提示" @on-confirm="onConfirm">
      <p style="text-align:center;">是否要清空活动数据?确认后所有人的答题信息都将清除，请谨慎操作</p>
    </confirm>
  </div>
</template>

<script>
import { XButton, Msg, Confirm } from "vux";

import { dateFormat } from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";

let prefix = "20200420";
let key = {
  curPaper: prefix + "_paper_",
  curAnswer: prefix + "_answer_",
  timeCounter: prefix + "_curTimeLength",
  answerList: prefix + "_answerList_",
  token: prefix + "_token",
};

export default {
  components: {
    XButton,
    Confirm,
    Msg,
  },
  data() {
    return {
      icon: "success",
      completeNum: 0,
      desc: ``,
      showConfirm: false,
      title: "感谢您的参与",
      clock: "",
      dbUserInfo: {
        nickname: "",
        openid: "",
        username: "",
        cardno: "",
        deptname: "",
      },
      isValid: false,
    };
  },
  computed: {
    ...mapState(["sport", "userInfo", "error_detail"]),
    answer_times() {
      return this.sport.maxTimes - this.sport.curTimes;
    },
    isAdmin() {
      const name = this.sport.userName;
      return false; //name == "李宾" || name == "徐文庆" || name == "黄夏玢";
    },
    isPassed() {
      return this.dbUserInfo.openid == this.userInfo.openid;
    },
  },
  methods: {
    reset() {
      this.showConfirm = true;
    },
    onConfirm() {
      db.delCbpcSportMain(this.sport.id).then((res) => {
        this.$vux.toast.text("清空完毕", "default");
      });
    },
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
        sid,
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
        .catch((res) => {
          this.title = "抽奖出错";
          this.desc = "请返回后重新进入答题页面，系统将自动抽奖";
        });
    },
    reload() {
      // if (this.answer_times == 0) {
      //   this.$router.push("/score");
      //   return;
      // }
      // window.location.href = window.location.href.split("#")[0];
      this.$router.push("/score");
    },
    loadCurScore: async function () {
      if (!this.sport.cardNo) {
        this.$router.push("/");
        return;
      }

      let { nickname, openid } = this.userInfo;

      //alwaysRecordScore
      let action = this.sport.stackMode
        ? "getCbpcSportMain2"
        : "getCbpcSportMain";

      await db[action]({
        uid: this.sport.uid,
        sid: this.sport.id,
      }).then(({ data }) => {
        let maxScore = Math.max(data[0].score, this.sport.curScore);
        this.title = `本次得分${this.sport.curScore}分`; // maxScore >= 90 ? "恭喜你过关了" : "哎呀，差一点就过了";  、、<br>还有${this.answer_times + 1}次答题机会。
        this.desc = `感谢您对本次活动的大力支持`;
        this.dbUserInfo = data[0];
        /**
         * ,你当前总分为${maxScore}分(答题${
          data[0].answer_times
        }次)。
         */
      });
    },
  },
  mounted() {
    if (this.sport.doLottery) {
      this.loadDefaultData();
    } else {
      this.loadCurScore();
    }
    document.title = "感谢参与";
    setInterval(() => {
      this.clock = dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss");
    }, 1000);

    this.isValid =
      window.localStorage.getItem(key.token) ==
      this.sport.uid + "_safe_20200421";
  },
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
    .marquee {
      margin: 0 15%;
      width: 70%;
      // color: #e23;
      font-size: 24px;
      font-weight: bold;
    }
    .item {
      margin: 0 10%;
      width: 80%;
      .title {
        font-weight: bold;
        font-size: 20px;
        margin: 20px 0;
      }
    }
    .row {
      display: flex;
      flex-direction: row;
    }
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
    }
  }
}

.wrapper {
  width: 90%;
}
</style>
