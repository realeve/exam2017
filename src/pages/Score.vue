<template>
  <div>
    <!-- <v-header/> -->
    <div class="content">
      <h3>1.得分排名(总人数:{{total}})</h3>
      <ul class="dept-rate">
        <li
          v-for="({user_name,user_dpt,score,time_length,avatar,answer_times,total_time},i) in users"
          :key="i"
        >
          <img
            class="avatar"
            :src="avatar"
            alt="user_name"
          >
          <div class="detail">
            <div class="text-left">
              <p class="bold">{{i+1}}.{{user_name}}</p>
              <p>{{user_dpt}}</p>
            </div>
            <div>
              <p>总分:{{score}}分(
                <span class="bold">{{answer_times}}</span>次)</p>
              <!-- <p>练习时长:{{total_time}}</p> -->
              <!-- <p>平均耗时:{{Math.floor(time_length/60)}}分{{time_length%60}}秒</p> -->
            </div>
          </div>
        </li>
      </ul>
      <h3 style="margin-top:30px;">2.各部门总分及参与率</h3>
      <ul class="dept-rate">
        <li
          class="dept-detail"
          v-for="({avg_score,rate,user_dpt},i) in depts"
          :key="i"
        >
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
      users: [],
      total: ""
    };
  },
  computed: {
    ...mapState(["sport"])
  },
  methods: {
    getDeptRatio() {
      db[
        this.sport.readSumScore
          ? "getCbpcSportMainByDept2"
          : this.sport.stackMode
          ? "getCbpcSportMainByDept"
          : "getCbpcSportDeptByMaxScore"
      ](this.sport.id).then(({ data }) => {
        this.depts = data;
      });
    },
    getScoreList() {
      db[
        this.sport.stackMode
          ? "getCbpcSportMainByUser"
          : "getCbpcSportMainByMaxScore"
      ]({ sid: this.sport.id, limit: 500 }).then(({ data }) => {
        this.users = data.map(item => {
          let { total_time } = item;
          total_time = parseInt(total_time, 10);
          let h = Math.floor(total_time / 3600);
          let m = Math.floor((total_time % 3600) / 60);
          let s = Math.floor(total_time % 60);
          if (h > 0) {
            h += "时";
          } else {
            h = "";
          }
          item.total_time = `${h}${m}分${s}秒`;
          return item;
        });
      });
    },
    getTotal() {
      db.getCbpcSportTotalPeople(this.sport.id).then(({ data }) => {
        this.total = data[0].value;
      });
    },
    init() {
      this.getDeptRatio();
      this.getScoreList();
      this.getTotal();
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
