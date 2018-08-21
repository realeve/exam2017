<template>
  <div>
    <!-- <v-header/> -->
    <div class="content">
      <h3>1.得分排名</h3>
      <ul class="dept-rate">
        <li v-for="({user_name,user_dpt,score,time_length,avatar,answer_times},i) in users" :key="i">
          <img class="avatar" :src="avatar" alt="user_name">
          <div class="detail">
            <div class="text-left">
              <p class="bold">{{i+1}}.{{user_name}}</p>
              <p>{{user_dpt}}</p>
            </div>
            <div>
              <p>{{score}}分(
                <span class="bold">{{answer_times}}</span>次)</p>
              <p>{{Math.floor(time_length/60)}}分{{time_length%60}}秒</p>
            </div>
          </div>
        </li>
      </ul>
      <h3 style="margin-top:30px;">2.各部门平均分与参与率</h3>
      <ul class="dept-rate">
        <li class="dept-detail" v-for="({avg_score,rate,user_dpt},i) in depts" :key="i">
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
import * as db from "../lib/db";

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
      db.getCbpcSportMainByDept(this.sport.id).then(({ data }) => {
        this.depts = data;
      });
    },
    getScoreList() {
      db.getCbpcSportMainByUser(this.sport.id).then(({ data }) => {
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
  height: 100%;
  h3 {
    font-weight: bold;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    // margin-top: 10px;
  }
  .dept-rate {
    li {
      border-bottom: 1px solid #ddd;
      display: flex;
      padding: 5px 0;
      @avatar-size: 64px;
      .avatar {
        width: @avatar-size;
        height: @avatar-size;
        border-radius: 50%;
        box-shadow: 1px 3px 3px #777;
        border: solid 1px #fff3;
      }
      .detail {
        padding-left: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bold {
          font-weight: bold;
        }
        p {
          padding: 3px 0;
        }
        text-align: right;
        .text-left {
          text-align: left;
        }
      }
    }

    .dept-detail {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
