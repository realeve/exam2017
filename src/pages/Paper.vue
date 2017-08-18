<template>
  <div>
    <div ref='fp'>
      <div class="section content" v-for="(question,i) of questionList" :key="question.title">
        <checklist v-if="question.multiply" label-position="left" :title="`${i+1}.${question.title}`" required :options="question.option"
          v-model="answerList[i]"></checklist>
        <group v-else :title="`${i+1}.${question.title}`">
          <radio :options="question.option" v-model="answerList[i]"></radio>
        </group>
        <div class="submit" v-if="i == questionList.length-1">
          <x-button :disabled="!isCompleted" type="primary" @click.native="submit">提交</x-button>
        </div>
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <tips></tips>
  </div>
</template>
<script>
  import 'fullpage.js';
  import $ from 'fullpage.js/node_modules/jquery';

  import {
    Toast,
    Group,
    Radio,
    Checklist,
    XButton
  } from 'vux'

  import {
    dateFormat
  } from 'vux'

  import {
    mapState
  } from 'vuex'

  import questionList from '../assets/data/question.json';

  import Tips from '../components/Tips.vue';
  import util from '../lib/common';

  export default {
    name: 'page',
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
          msg: ''
        },
        answerList: [],
        isCompleted: false,
        startTime: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        errorQuestion: [],
        srcArrOrder: []
      }
    },
    computed: {
      ...mapState(['userInfo', 'cdnUrl']),
      sport: {
        get() {
          return this.$store.state.sport;
        },
        set(val) {
          this.$store.commit('setSport', val);
        }
      },
      url() {
        return window.location.href.split('#')[0];
      },
      el() {
        return $(this.$refs.fp);
      },
      tips: {
        get() {
          return this.$store.state.tips;
        },
        set(val) {
          this.$store.commit('setTips', val);
        }
      },
      paperInit: {
        get() {
          return this.$store.state.paperInit;
        },
        set(val) {
          this.$store.commit('setPaperInit', val);
        }
      },
      questionList() {
        let questions = util.randomArr(questionList);
        questions = util.randomAnswer(questions);

        if (typeof questions[0].option[0] != 'string') {
          return questions;
        }
        var alphaArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        return questions.map(item => {
          let option = item.option.map((value, key) => {
            return {
              key,
              value: alphaArr[key] + '.' + value
            }
          });
          Object.assign(item, {
            option
          });
          return item;
        })
      },
      subScore() {
        let score = 0;
        this.errorQuestion = [];
        this.answerList.forEach((item, i) => {
          let rightAnswer = this.questionList[i];
          if (item == rightAnswer.answer) {
            score += rightAnswer.score;
          } else {
            this.errorQuestion.push(this.questionList[i].questionId);
          }
        });
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
      getSubmitData() {
        return {
          // nickname: this.userInfo.nickname,
          // openid: this.userInfo.openid,
          // sex: this.userInfo.sex,
          // city: this.userInfo.city,
          // province: this.userInfo.province,
          // country: this.userInfo.country,
          // headimgurl: this.userInfo.headimgurl,
          rec_time: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          score: this.subScore,
          errors: this.errorQuestion.join(','),
          sportid: this.sport.id,
          start_time: this.startTime,
          uid: this.sport.uid,
          iTimes: this.sport.curTimes,
          oldScore: this.sport.curScore
        };
      },
      setCurIdx(slideIdx) {
        let slideNum = this.questionList.length;
        this.tips = slideNum > 1 ? `${slideIdx}/${slideNum}` : '';
      },
      submit() {
        let params = this.getSubmitData();
        console.log(params);
        params.s = '/addon/GoodVoice/GoodVoice/setSafeExamData';

        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          this.toast.show = true;
          this.toast.msg = res.data.msg;

          if (res.data.status > 0) {
            // 感谢参与
            this.sport.curTimes++;
            this.sport.curScore = Math.max(this.sport.curScore, params.score);
            this.$router.push('info');
          }
        });
      },
      init() {
        if (this.paperInit) {
          // 如果载入过，需要删除重载
          $.fn.fullpage.destroy('all');
        }
        let params = {
          verticalCentered: true,
          css3: true,
          navigation: false,
          easing: 'easeInOutCubic',
          loopHorizontal: false,
          afterLoad: (anchorLink, index) => {
            this.setCurIdx(index);
          }
        };

        this.el.fullpage(params);

        this.paperInit = true;
      },
      prepareData() {
        document.title = '成本月微信答题活动';
        this.answerList = this.questionList.map(item => item.multiply ? [] : -1);
      }
    },
    mounted() {
      if (!this.sport.isLogin) {
        this.$router.push('/');
      } else {
        // 如果答题次数超标，跳转至信息(防止按返回键继续答题)
        if (this.sport.curTimes > this.sport.maxTimes) {
          this.$router.push('info');
        }
        this.prepareData();
        this.init();
      }
    }
  }

</script>
<style scoped lang="less">
  @import '../assets/css/fullpage.css';
  @import '../assets/css/weui.css';
  .content {
    margin: 20px 0;
    padding: 10px;
    color: #444;
    background: #fff;
  }

  .submit {
    margin: 20px;
  }

</style>
