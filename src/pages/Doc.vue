<template>
  <div class="wrapper">
    <div class="content">
      <div>
        <div class="title">{{sport.orgname}}<br>{{year}}{{sport.name}}</div>
        <template v-if="sport.doLottery">
          <p class="subtitle">说明</p>
          <article>
            <p>本次活动中，我们将从{{paper.length}}道题目中随机抽取{{sport.questionNums}}道题目作答,每人{{sport.maxTimes}}次机会
              <span v-if="sport.doLottery">，得分在{{sport.minPrizeScore}}分以上者将参与后续的抽奖环节，400个奖品等你来拿</span>。</p>
          </article>
        </template>

        <div
          class="btn"
          style="margin-top:20px;"
        >
          <!-- <x-button @click.native="jump('login')">登录</x-button> -->
          <x-button
            type="primary"
            @click.native="jump('paper')"
            v-show="sport.isLogin"
          >开始答题(限时{{sport.maxAnswerLength/60}}分钟)</x-button>
          <x-button @click.native="init">知识学习</x-button>
          <x-button @click.native="jump('errlist')">我的错题集</x-button>
          <x-button
            type="warn"
            @click.native="jump('/score')"
          >排行榜</x-button>
          <x-button
            v-if="isAdmin"
            @click.native="reset"
          >清空得分</x-button>
        </div>

        <p class="subtitle">知识学习</p>
        <p
          class="item"
          style="font-size:10pt;"
        >(本部分将每次随机生成{{sport.questionNums}}题以供学习)</p>
        <article>
          <p
            class="item"
            v-for="(question,i) in questions"
            :key="i"
            v-html="`${i+1}.${question}`"
          ></p>
        </article>
      </div>

      <confirm
        v-model="showConfirm"
        title="系统提示"
        @on-confirm="onConfirm"
      >
        <p style="text-align:center;">是否要清空活动数据?确认后所有人的答题信息都将清除，请谨慎操作</p>
      </confirm>
    </div>
    <v-foot />
  </div>
</template>
<style lang="less" scoped>
// .wrapper {
//   display: flex;
//   flex-direction: column;
//   font-weight: lighter;
//   height: 100%;
// }
.content {
  font-size: 13pt;
  color: #444;
  width: 100%;
  text-align: left;
  padding: 10px;
  height: 100%;
  .title {
    padding-top: 30px;
    font-size: 16pt;
    text-align: center;
    font-weight: bold;
  }
  article {
    text-indent: 2em;
    line-height: 23pt;
    p {
      line-height: 23pt;
    }
    .item {
      padding: 10px 5px;
    }
  }
  .subtitle {
    font-size: 15pt;
    padding-top: 20px;
    width: 100%;
  }
  .btn {
    width: 80%;
    margin: 10px auto;
  }
}

.title {
  line-height: 30pt;
  border-bottom: solid 1px rgba(0, 0, 0, 0.5);
}
</style>

<script>
// import paper from "../assets/data/finance.json";
import paper from "../assets/data/safe2019.js";
import util from "../lib/common";

import { XButton, Confirm } from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";

export default {
  components: {
    XButton,
    Confirm
  },
  data() {
    return {
      questions: [],
      paper: paper.slice(0, 50),
      showConfirm: false
    };
  },
  computed: {
    ...mapState(["sport"]),
    year() {
      let date = new Date();
      return date.getFullYear() + "年";
    },
    isAdmin() {
      const name = this.sport.userName;
      return name == "李宾" || name == "徐文庆" || name == "黄夏玢";
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    reset() {
      this.showConfirm = true;
    },
    onConfirm() {
      db.delCbpcSportMain({
        sid: this.sport.id
      }).then(res => {
        this.$vux.toast.text("清空完毕", "default");
      });
    },
    handleQuestion(item) {
      let answer = item.option[item.answer[0]];
      if (answer == "全部选项都是") {
        answer = item.option.slice(0, 3).join("、");
      }
      let title = item.title;
      if (typeof answer == "object") {
        answer = answer.value;
        if (answer.includes("、")) {
          answer = answer.split("、")[1];
        }
      }
      item.title = item.title.replace(/  /g, " ");
      if (item.title.split("( )").length > 2) {
        answer.split(";").forEach(answerItem => {
          title = title.replace(
            /( )|(  )/,
            `<span class="right-answer">${answerItem}</span>`
          );
        });
      } else {
        title = title.replace(
          /( )|(  )/,
          `<span class="right-answer">${answer}</span>`
        );
      }
      return title;
    },
    init() {
      this.questions = util
        .randomArr(paper)
        .slice(0, this.sport.questionNums)
        .map(this.handleQuestion);
    }
  },
  mounted() {
    this.init();
    document.title = "知识学习";
  }
};
</script>
