<template>
  <div class="wrapper">
    <div class="content">
      <div>
        <p class="title">{{sport.orgname}}<br>{{year}}{{sport.name}}</p>
        <template v-if="sport.doLottery">
          <p class="subtitle">说明</p>
          <article>
            <p>本次活动中，我们将从{{paper.length}}道题目中随机抽取{{sport.questionNums}}道题目作答,每人{{sport.maxTimes}}次机会
              <span v-if="sport.doLottery">，得分在{{sport.minPrizeScore}}分以上者将参与后续的抽奖环节，400个奖品等你来拿</span>。</p>
          </article>
        </template>

        <p class="subtitle">知识学习</p>
        <p class="item" style="font-size:10pt;">(本部分将每次随机生成{{sport.questionNums}}题以供学习)</p>
        <article>
          <p class="item" v-for="(question,i) in questions" :key="i" v-html="`${i+1}.${question}`"></p>
        </article>
      </div>

      <div class="btn margin-top-60">
        <x-button type="primary" @click.native="jump('paper')">开始答题</x-button>
        <x-button @click.native="init">刷新题目</x-button>
        <x-button v-if="isAdmin" type="warn" @click.native="reset">清空得分</x-button>
        <x-button @click.native="jump('/')">返回首页</x-button>
      </div>
      <confirm v-model="showConfirm" title="系统提示" @on-confirm="onConfirm">
        <p style="text-align:center;">是否要清空活动数据?</p>
      </confirm>
    </div>
    <v-foot/>
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
import paper from "../assets/data/question19.json";
import util from "../lib/common";

import { XButton, Confirm } from "vux";

import { mapState } from "vuex";

export default {
  components: {
    XButton,
    Confirm
  },
  data() {
    return {
      questions: [],
      paper,
      showConfirm: false
    };
  },
  computed: {
    ...mapState(["sport", "cdnUrl"]),
    year() {
      let date = new Date();
      return date.getFullYear() + "年";
    },
    isAdmin() {
      const name = this.sport.userName;
      return name == "李宾" || name == "孔宇芳" || name == "黄夏玢";
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
      let params = {
        s: "/addon/GoodVoice/GoodVoice/clearExamData",
        sid: this.sport.id
      };

      this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => {
          this.$vux.toast.text("清空完毕", "default");
        });
    },
    init() {
      this.questions = util
        .randomArr(paper)
        .slice(0, this.sport.questionNums)
        .map(item => {
          let answer = item.option[item.answer[0]];
          if (answer == "全对") {
            answer = item.option.slice(0, 3).join("、");
          }
          let title = item.title;
          if (item.title.split("（  ）").length > 2) {
            if (typeof answer == "object") {
              answer = answer.value;
            }
            // console.log(answer);
            answer.split(";").forEach(answerItem => {
              title = title.replace(
                "（  ）",
                `<span class="right-answer">${answerItem}</span>`
              );
            });
          } else {
            title = title.replace(
              "（  ）",
              `<span class="right-answer">${answer}</span>`
            );
          }

          return title;
        });
      // paper.forEach(item => {
      //   if (item.title.split("（  ）").length > 2) {
      //     console.log(item.title);
      //   }
      // });
    }
  },
  mounted() {
    this.init();
    document.title = "知识学习";
  }
};
</script>
