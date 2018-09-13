<template>
  <div>
    <div ref='fp'>
      <div class="section content" v-for="(question,i) of questionList" :key="i">
        <span v-if="sport.testMode">答案:{{question.answer.join(',')}},得分:{{subScore}}</span>
        <div style="position:relative;">
          <div class="qa-num">{{i+1}}/{{questionList.length}}</div>
          <div class="qa-body">
            <checklist v-if="question.answer.length>1" label-position="left" :title="`${question.title}`" required :options="question.option" v-model="answerList[i]">
            </checklist>
            <group v-else :title="`${question.title}`">
              <radio :options="question.option" v-model="answerList[i]"></radio>
            </group>
          </div>
        </div>
        <div class="submit" v-if="i == questionList.length-1">
          <x-button :disabled="!isCompleted" type="primary" @click.native="submit(sport.questionNums)">提交</x-button>
        </div>
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <!-- <tips></tips> -->
  </div>
</template>
<script>
import "fullpage.js";
import $ from "fullpage.js/node_modules/jquery";

import { Toast, Group, Radio, Checklist, XButton } from "vux";

import { dateFormat } from "vux";

import { mapState } from "vuex";

// import questionJSON from "../assets/data/finance.json";
// import questionJSON from "../assets/data/safe2018.js";
// import questionJSON from "../assets/data/safePrint.js";

import questionJSON from "../assets/data/safeMarker.js";

import Tips from "../components/Tips.vue";
import util from "../lib/common";
import moment from "moment";
import * as db from "../lib/db";

// 是否需要随机选项数据
let questionList = util.getPaperData(questionJSON, {
  randAnswer: true,
  randomQuestion: true
});

export default {
  name: "page",
  components: {
    Toast,
    Group,
    Radio,
    Checklist,
    XButton,
    Tips
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      answerList: [],
      isCompleted: false,
      startTime: dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss"),
      errorQuestion: [],
      srcArrOrder: []
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    questionList() {
      return questionList.slice(0, this.sport.questionNums);
    },
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    },
    url() {
      return window.location.href.split("#")[0];
    },
    el() {
      return $(this.$refs.fp);
    },
    tips: {
      get() {
        return this.$store.state.tips;
      },
      set(val) {
        this.$store.commit("setTips", val);
      }
    },
    paperInit: {
      get() {
        return this.$store.state.paperInit;
      },
      set(val) {
        this.$store.commit("setPaperInit", val);
      }
    },
    subScore() {
      // return this.sport.questionNums - this.errorQuestion.length;

      let score = 0;
      this.errorQuestion = [];
      // 每题得分

      this.answerList.forEach((item, i) => {
        let curQuestion = this.questionList[i];
        // let scorePerQuestion = !Reflect.has(curQuestion, "score")
        //   ? this.$store.state.sport.perScore
        //   : curQuestion.score;

        let scorePerQuestion =
          this.$store.state.sport.perScore > 0
            ? this.$store.state.sport.perScore
            : curQuestion.score;

        // 多选答案校对
        let itemType = typeof item;
        if (itemType != "number" && itemType != "string") {
          item = item.sort((a, b) => a - b).join(",");
        }

        let standardAnswer = ["number", "string"].includes(
          typeof curQuestion.answer
        )
          ? curQuestion.answer
          : curQuestion.answer.join(",");

        if (item == standardAnswer) {
          score += scorePerQuestion > 0 ? scorePerQuestion : curQuestion.score;
        } else {
          this.errorQuestion.push(this.questionList[i].questionId);
        }
      });
      // return this.sport.questionNums - this.errorQuestion.length
      return score;
    }
  },
  watch: {
    answerList(val) {
      this.getCompleteStatus();
    }
  },
  methods: {
    getCompleteStatus() {
      let flag = true;
      for (let i = 0; flag && i < this.answerList.length; i++) {
        let item = this.answerList[i];
        if (item == -1) {
          flag = false;
        }
      }
      this.isCompleted = flag;
    },
    getSubmitData(answer_nums) {
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      const timeLength = moment(now).diff(moment(this.startTime), "s");
      this.sport.curScore = this.subScore;
      // 未处理实时答题，未处理得分累加
      return {
        uid: this.sport.uid,
        sid: this.sport.id,
        answer_times: this.sport.curTimes,
        score: this.subScore,
        error_detail: this.errorQuestion.join(","),
        rec_time: now,
        start_time: this.startTime,
        answer_nums,
        time_length: timeLength
      };
    },
    setCurIdx(slideIdx) {
      let slideNum = this.questionList.length;
      this.tips = slideNum > 1 ? `${slideIdx}/${slideNum}` : "";
    },

    submit: async function(answer_nums) {
      let params = this.getSubmitData(answer_nums);

      // 存储当前错误题目
      let { error_detail } = params;
      window.localStorage.setItem("error_detail", error_detail);
      this.$store.commit("setStore", { error_detail: this.errorQuestion });

      let res = await db.submitPaper(params, this.sport);
      if (res.rows == 0 || res.data[0].affected_rows == 0) {
        this.toast.show = true;
        this.toast.msg = "提交失败";
        return;
      }

      // 抽奖
      if (this.sport.doLottery) {
        let uid = this.sport.uid,
          sid = this.sport.id;
        db.addCbpcSportLuckyusers({
          uid,
          sid1: sid,
          sid2: sid,
          sid3: sid,
          sid4: sid,
          _uid: uid,
          _sid: sid
        });
      }

      this.sport.curScore = Math.max(this.sport.curScore, params.score);

      // 如果到了最后一页点击按钮提交，跳转到提示页面
      if (answer_nums == this.sport.questionNums) {
        this.toast.show = true;
        this.toast.msg = "提交成功";
        this.sport.curTimes++;
        this.$router.push("info");
      }
    },
    init() {
      if (this.paperInit) {
        // 如果载入过，需要删除重载
        $.fn.fullpage.destroy("all");
      }
      let params = {
        verticalCentered: true,
        css3: true,
        navigation: false,
        easing: "easeInOutCubic",
        loopHorizontal: false,
        afterLoad: (anchorLink, index) => {
          this.setCurIdx(index);
        },
        onLeave: (from, to, direction) => {
          let isFromPageNotAnswered = this.answerList[from - 1] == -1;
          let isToPageNotAnswered = this.answerList[to - 1] == -1;

          // 如果源页面未答题且向下翻，则不允许翻页
          if (direction == "down" && isFromPageNotAnswered) {
            this.toast.show = true;
            this.toast.msg = `第${from}题未作答`;
            this.$nextTick(() => {
              $.fn.fullpage.moveTo(from);
            });
          }

          // 离线模式，判断答题顺序后不进入数据提交流程
          if (!this.sport.isOnline) {
            return;
          }

          // 在线模式不允许修改答案，离线模式可以修改
          if (direction == "up" && !isToPageNotAnswered) {
            this.toast.show = true;
            this.toast.msg = `实时比赛不允许修改答案`;
            this.$nextTick(() => {
              $.fn.fullpage.moveTo(from);
            });
          }

          // 实时答题，提交当前数据
          this.submit(from);
        }
      };

      this.el.fullpage(params);

      this.paperInit = true;
    },
    prepareData() {
      document.title = this.sport.name + "微信答题活动";

      this.answerList = this.questionList.map(
        item => (item.answer.length > 1 ? [] : -1)
      );
    }
  },
  mounted() {
    window.localStorage.removeItem("error_detail");
    if (!this.sport.isLogin) {
      this.$router.push("/");
    } else {
      // 如果答题次数超标，跳转至信息(防止按返回键继续答题)
      if (!this.sport.isOnline && this.sport.curTimes > this.sport.maxTimes) {
        this.$router.push("info");
      }
      this.prepareData();
      this.init();
    }
  },
  destroyed() {
    if (this.paperInit) {
      // 如果载入过，需要删除重载
      $.fn.fullpage.destroy("all");
    }
  }
};
</script>
<style scoped lang="less">
@import "../assets/css/fullpage.css";
@import "../assets/css/weui.css";
.content {
  margin: 0;
  padding: 10px;
  color: #785a32;
  background: url(../assets/img/bg.jpg) 0 0 no-repeat;
  background-size: 100% 110%;
}
.submit {
  margin: 20px;
}
.qa-num {
  width: 100px;
  height: 50px;
  border: 1px solid #d2c7bb;
  border-bottom: 0;
  border-radius: 50px 50px 0 0;
  overflow: hidden;
  position: absolute;
  top: -49px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  box-sizing: border-box;
  z-index: 2;
  color: #c1af96;
  font-size: 20px;
  background: #faf5f0;
  background-clip: padding-box;
  padding-top: 14px;
  font-family: "HiraginoSansGB-W3", "微软雅黑", "Microsoft Yahei", "宋体",
    "Arial Narrow", "HELVETICA";
  font-weight: 400;
}
.qa-body {
  border: 1px solid #d2c7bb;
  border-radius: 5px;
  box-shadow: 0 0 6px 2px rgba(210, 199, 187, 0.2);
  background: #faf5f0;
  background-clip: padding-box;
  padding: 13px 0;
  box-sizing: border-box;
  overflow-y: auto;
  min-height: 60vh;
}
</style>
