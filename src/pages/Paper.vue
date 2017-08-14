<template>
  <div>
    <div ref='fp'>
      <div class="section content" v-for="(question,i) of questionList" :key="question.title">
        <checklist v-if="question.multiply" label-position="left" :title="`${i+1}.${question.title}`" required :options="question.option"
          v-model="answerList[i]" @on-change="change"></checklist>
        <group v-else :title="`${i+1}.${question.title}`">
          <radio :options="question.option" v-model="answerList[i]" @on-change="change"></radio>
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

  import questionList from '../assets/data/question.json';

  import Tips from '../components/Tips.vue';

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
        questionList,
        answerList: [],
        isCompleted: false
      }
    },
    computed: {
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
          if (item == '') {
            flag = false;
          }
        }
        this.isCompleted = flag;
      },
      change() {
        console.log(this.answerList);
      },
      getSubmitData() {
        return {
          nickname: this.userInfo.nickname,
          openid: this.userInfo.openid,
          sex: this.userInfo.sex,
          city: this.userInfo.city,
          province: this.userInfo.province,
          country: this.userInfo.country,
          headimgurl: this.userInfo.headimgurl,
          rec_time: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          answer: this.answerList
        };
      },
      setCurIdx(slideIdx) {
        let slideNum = this.questionList.length;
        this.tips = slideNum > 1 ? `${slideIdx}/${slideNum}` : '';
      },
      submit() {
        this.$router.push('info');
        return;
        let params = this.getSubmitData();

        params.s = '/addon/Api/Api/setResearch';

        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          this.toast.show = true;
          this.toast.msg = res.data.msg;
          if (res.data.id > 0) {
            // 感谢参与
            this.$router.push('info');
          }
        });
      },
      init() {
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
      }
    },
    mounted() {
      document.title = '成本月微信答题活动';
      this.answerList = this.questionList.map(item => item.multiply ? [] : '');
      this.init();
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
