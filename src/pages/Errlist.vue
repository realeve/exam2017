<template>
  <div>
    <div class="section content" v-for="(question,i) of questionList" :key="question.id">
      <div style="position:relative;margin-top:50px;">
        <div class="qa-num">{{i+1}}/{{questionList.length}}</div>
        <div class="qa-body">
          <checklist
            v-if="question.answer.length>1"
            label-position="left"
            :title="`(做错${question.err_num}次)${question.title}(正确答案:${question.answerText.join('、')})`"
            required
            disabled
            :options="question.option"
            v-model="question.answer"
          ></checklist>
          <group
            v-else
            :title="`(做错${question.err_num}次)${question.title}(正确答案:${question.answerText.join('、')})`"
          >
            <radio :options="question.option" disabled v-model="question.answer[0]"></radio>
          </group>
        </div>
      </div>
      <div class="submit" v-if="i==questionList.length-1">
        <x-button type="primary" @click.native="reload">重新答题</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Group, Radio, Checklist, XButton } from "vux";

import { mapState } from "vuex";

import questionJSON from "../assets/data/safe2020.js";

import util from "../lib/common";
import * as db from "../lib/db";

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
      answerList: [],
      isCompleted: false,
      questionList: [],
      error_detail: []
    };
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.state.userInfo;
      },
      set(val) {
        this.$store.commit("setUserinfo", val);
      }
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
    }
  },
  watch: {
    "sport.uid"(val) {
      this.getErrList();
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    prepareData() {
      let getAnswer = a => ["A", "B", "C", "D", "E", "F", "G"][a];
      let err_detail = this.error_detail.map(({ id }) => id);

      let questionList = err_detail.map(i => questionJSON[i]);

      this.questionList = questionList
        .map((item, id) => {
          // console.log(item);
          item.answer =
            typeof item.answer == "number" ? [item.answer] : item.answer;
          item.answerText = item.answer.map(getAnswer);
          item.id = id;
          item.err_num = this.error_detail[id].num;
          return item;
        })
        .sort((a, b) => b.err_num - a.err_num);
    },
    reload() {
      // window.location.href = window.location.href.split("#")[0] + "#login";
      this.jump("login");
    },
    async getErrList() {
      let curUser = window.localStorage.getItem("userInfo");
      if (curUser == null) {
        return;
      }

      if (typeof this.sport.uid == "undefined" || this.sport.uid == 0) {
        this.userInfo = JSON.parse(curUser);
        let params = {
          sid: this.sport.id,
          card_no: this.userInfo.user_id,
          username: this.userInfo.user_name,
          dept_name: "%%"
        };

        let { data } = await db[this.sport.readMaxScore ? "login" : "login2"](
          params
        );

        if (data.length === 0 || data[0].uid == null) {
          this.toast.show = true;
          this.toast.msg = "登录失败";
          return;
        }
        let obj = data[0];
        // console.log(obj.answer_times);
        // 登录成功
        this.sport.isLogin = true;
        // this.sport.curTimes = parseInt(obj.answer_times) + 1;

        this.sport.uid = obj.uid;
        this.sport.curScore = obj.score;
        this.sport.curTimeLength = obj.time_length;

        if (this.sport.uid == 0) {
          return;
        }
      }
      db.getErrList({
        sid: this.sport.id,
        uid: this.sport.uid
      }).then(({ data }) => {
        let errs = [];
        data.forEach(item =>
          item[0].split(",").forEach(a => {
            errs[a] = typeof errs[a] == "undefined" ? 1 : errs[a] + 1;
          })
        );
        this.error_detail = errs
          .map((num, id) => ({ num, id }))
          .filter(item => item)
          .sort((a, b) => b.num - a.num);
        this.prepareData();
      });
    }
  },
  mounted() {
    this.getErrList();
    document.title = "我的错题集";
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
  // font-family: "HiraginoSansGB-W3", "微软雅黑", "Microsoft Yahei", "宋体",
  //   "Arial Narrow", "HELVETICA";
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
