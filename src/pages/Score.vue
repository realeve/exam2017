<template>
  <div>
    <!-- <v-header/> -->
    <div class="content">
      <h3 v-if="showDept" style="margin-top: 30px;">1.各部门平均得分及参与率</h3>
      <div class="dept-score" :class="{ hideSome: !isShowFull }">
        <ul v-if="showDept" class="dept-rate" :class="{ hideHalf: !isShowFull }">
          <li class="dept-detail" v-for="({ avg_score, rate, user_dpt }, i) in depts" :key="i">
            <span>{{ i + 1 }}.{{ user_dpt }}</span>
            <span>{{ avg_score }}分</span>
            <span>{{ rate }}%</span>
          </li>
        </ul>
        <div :class="{ hideButton: isShowFull }" class="btn-showall">
          <x-button @click.native="showAll">显示全部</x-button>
        </div>
      </div>
      <h3>2.得分排名(参与人数:{{ total }})</h3>
      <ul class="dept-rate">
        <li
          v-for="({
            user_name,
            user_dpt,
            score,
            time_length,
            avatar,
            answer_times,
            total_time,
          },
          i) in users"
          :key="i"
        >
          <img class="avatar" :src="avatar" alt="user_name" />
          <div class="detail">
            <div class="text-left">
              <p class="bold">{{ i + 1 }}.{{ user_name }}</p>
              <p>{{ user_dpt }}</p>
            </div>
            <div>
              <p>
                总分:{{ score }}分
                <!-- (<span class="bold">{{answer_times}}</span>次) -->
              </p>
              <p>{{ total_time }}</p>
              <!-- <p>平均耗时:{{Math.floor(time_length/60)}}分{{time_length%60}}秒</p> -->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <v-foot color="#333" />
  </div>
</template>

<script>
import VHeader from "../components/Header";
import { mapState } from "vuex";
import { XButton } from "vux";
import * as db from "../lib/db";

import state from "../store/state";

const FemaleSport = state.sport.id == 32;

export default {
  components: {
    VHeader,
    XButton
  },
  data() {
    return {
      depts: [],
      users: [],
      total: "",
      showDept: !FemaleSport,
      isShowFull: false
    };
  },
  computed: {
    ...mapState(["sport"])
  },
  methods: {
    showAll() {
      // console.log("show full");
      this.isShowFull = !this.isShowFull;
    },
    getDeptRatio() {
      // if (this.sport.id != 35) {
      db[
        this.sport.readSumScore
          ? "getCbpcSportMainByDept2"
          : this.sport.stackMode
          ? "getCbpcSportMainByDept"
          : "getCbpcSportDeptByMaxScore"
      ](this.sport.id).then(({ data }) => {
        this.depts = data;
      });
      // } else {
      //   db.getCbpcSport2020Purchase(this.sport.id).then(({ data }) => {
      //     this.depts = data;
      //   });
      // }
    },
    getScoreList() {
      // if (this.sport.id == 35) {
      //   db.getCbpcSport2020ScorePurchase(this.sport.id).then(({ data }) => {
      //     this.users = data.map(item => {
      //       let { total_time } = item;
      //       return item;
      //     });
      //   });
      //   return;
      // }
      db[
        this.sport.stackMode
          ? "getCbpcSportMainByUser"
          : "getCbpcSportMainByMaxScore"
      ]({ sid: this.sport.id, limit: 500 }).then(({ data }) => {
        this.users = data.map(item => {
          let { total_time } = item;
          // total_time = parseInt(total_time, 10);
          // let h = Math.floor(total_time / 3600);
          // let m = Math.floor((total_time % 3600) / 60);
          // let s = Math.floor(total_time % 60);
          // if (h > 0) {
          //   h += "时";
          // } else {
          //   h = "";
          // }
          // item.total_time = `${h}${m}分${s}秒`;
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
      if (!FemaleSport) {
        this.getDeptRatio();
      }
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
  .dept-score {
    margin-bottom: 1em;
    position: relative;
    button {
      background: rgb(66, 185, 131);
      color: rgb(255, 255, 255);
      position: absolute;
      bottom: 0;
    }
    .hideButton {
      display: none;
    }
    .btn-showall {
      text-align: center;
      height: 5em;
      position: relative;
      bottom: 5em;
      background: linear-gradient(
        rgba(255, 255, 255, 0),
        10%,
        rgba(255, 255, 255, 1)
      );
      // border-bottom: 1px solid #ddd;
      // padding-top: 3em;
    }
    .hideHalf {
      max-height: 16em;
      overflow: hidden;
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
  .hideSome {
    max-height: 16em;
    overflow: hidden;
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
