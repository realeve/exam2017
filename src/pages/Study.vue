<template>
  <div>
    <div class="section content" v-for="(question,i) of questionList" :key="question.id">
      <div style="position:relative;margin-top:50px;">
        <div class="qa-num">{{i+1}}/{{questionList.length}}</div>
        <div class="qa-body">
          <checklist v-if="question.answer.length>1" label-position="left" :title="`${question.title}(正确答案:${question.answerText.join('、')})`" required disabled :options="question.option" v-model="question.answer">
          </checklist>
          <group v-else :title="`${question.title}(正确答案:${question.answerText.join('、')})`">
            <radio :options="question.option" disabled v-model="question.answer[0]"></radio>
          </group>
        </div>
      </div>
      <div class="submit" v-if="i==questionList.length-1">
        <x-button type="primary" @click.native="reload">更新题目</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Group, Radio, Checklist, XButton } from "vux";

import { mapState } from "vuex";

import questionJSON from "../assets/data/safe2018.js";

import util from "../lib/common";

const R = require("ramda");
// 是否需要随机选项数据

export default {
  name: "page",
  components: {
    Group,
    Radio,
    Checklist,
    XButton
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      error_detail: [],
      isCompleted: false,
      questionList: []
    };
  },
  computed: {
    ...mapState(["userInfo"]),
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
    }
  },
  methods: {
    prepareData() {
      let getAnswer = a => ["A", "B", "C", "D", "E", "F", "G"][a];

      let paperData = R.clone(questionJSON);

      this.questionList = util
        .getPaperData(
          paperData.filter((item, id) => this.error_detail.includes(id)),
          { randomAnswer: false, randomQuestion: false }
        )
        .map(item => {
          item.answer =
            typeof item.answer == "number" ? [item.answer] : item.answer;
          item.answerText = item.answer.map(getAnswer);
          return item;
        });
    },
    reload() {
      window.location.href = window.location.href.split("#")[0];
    },
    reload() {
      this.error_detail = util.getRandomArr(questionJSON.length).slice(0, 20);
      this.prepareData();
    }
  },
  mounted() {
    this.reload();
    document.title = this.sport.name + "微信答题活动";
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
  height: 100%;
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
