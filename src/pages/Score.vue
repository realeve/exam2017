<template>
  <div>
    <v-header/>
    <div class="content">
      <h3>1.得分排名</h3>
      <ul class="dept-rate">
        <li v-for="({user_name,user_dpt,score,time_length},i) in users" :key="i">
          <span>{{i+1}}.{{user_name}}</span>
          <span>{{user_dpt}}</span>
          <span>{{score}}分</span>
          <span>{{Math.floor(time_length/60)}}分{{time_length%60}}秒</span>
        </li>
      </ul>
      <h3 style="margin-top:30px;">2.各部门平均分与参与率</h3>
      <ul class="dept-rate">
        <li v-for="({avg_score,rate,user_dpt},i) in depts" :key="i">
          <span>{{i+1}}.{{user_dpt}}</span>
          <span>{{avg_score}}分</span>
          <span>{{rate}}%</span>
        </li>
      </ul>
    </div>
    <v-foot color="#333" />
  </div>
</template>

<script>
import VHeader from "../components/Header";
import { mapState } from "vuex";

export default {
  components: {
    VHeader
  },
  data() {
    return {
      depts: [],
      users: []
    };
  },
  computed: {
    ...mapState(["sport", "cdnUrl"])
  },
  methods: {
    getDeptRatio() {
      this.$http
        .jsonp(this.cdnUrl, {
          params: {
            s: "/addon/GoodVoice/GoodVoice/getScoreByDpts",
            sid: this.sport.id
          }
        })
        .then(({ data }) => {
          this.depts = data;
        });
    },
    getScoreList() {
      this.$http
        .jsonp(this.cdnUrl, {
          params: {
            s: "/addon/GoodVoice/GoodVoice/getScoreList",
            sid: this.sport.id
          }
        })
        .then(({ data }) => {
          this.users = data;
        });
    },
    init() {
      this.getDeptRatio();
      this.getScoreList();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.content {
  text-align: left;
  padding: 10px;
  h3 {
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    // margin-top: 10px;
  }
  .dept-rate {
    li {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      // span:nth-child(1) {
      //   font-weight: bold;
      // }
    }
  }
}
</style>
