<template>
  <div class="main">
    <!-- <div class="dpt">
      <x-button v-for="item in dptList" :key="item.dpt">{{item.dpt}}</x-button>
    </div> -->
    <div class="lucky-list">
      <h1>中奖名单</h1>
      <div class="margin-top-20" v-for="({dpt,num,users},idx) in dptList" :key="dpt">
        <div class="title">
          <span>{{dpt}}({{num}}人)</span>
          <x-button @click.native="lottery(idx)">抽奖</x-button>
        </div>
        <ul class="luckyer">
          <li v-for="user in users" :key="user.card_no">
            <img :src="user.avatar" :alt="user.user_name">
            <div class="detail">
              <span>{{user.user_name}}</span>
              <!-- <span>{{user.rec_time}}</span> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { XButton } from "vux";
import * as db from "../lib/db";

export default {
  components: {
    XButton
  },
  data() {
    return {
      dptList: [
        { dpt: "检封制作部", num: 23, users: [] },
        { dpt: "胶凹制作部", num: 23, users: [] },
        { dpt: "能源环保部", num: 15, users: [] },
        { dpt: "印码制作部", num: 23, users: [] },
        { dpt: "钞纸成品制作部", num: 23, users: [] },
        { dpt: "设备管理部", num: 15, users: [] },
        { dpt: "钞纸制作部", num: 23, users: [] },
        { dpt: "印钞数管部", num: 23, users: [] },
        { dpt: "印钞管理部", num: 6, users: [] },
        { dpt: "技术中心", num: 6, users: [] },
        { dpt: "钞纸管理部", num: 6, users: [] },
        { dpt: "安全保卫部", num: 6, users: [] },
        { dpt: "物资管理部", num: 6, users: [] },
        { dpt: "企划信息部", num: 5, users: [] },
        { dpt: "基建与行政事务部", num: 5, users: [] },
        { dpt: "计划财务部", num: 2, users: [] },
        { dpt: "人力资源部", num: 3, users: [] },
        { dpt: "办公室", num: 3, users: [] },
        { dpt: "市场开发部", num: 2, users: [] },
        { dpt: "群工部", num: 2, users: [] },
        { dpt: "企业文化部", num: 2, users: [] },
        { dpt: "纪检监察内审部", num: 2, users: [] },
        { dpt: "采购管理部", num: 2, users: [] },
        { dpt: "离退休工作部", num: 1, users: [] },
        { dpt: "长城公司", num: 5, users: [] },
        { dpt: "物业公司", num: 5, users: [] },
        { dpt: "金鼎公司", num: 3, users: [] },
        { dpt: "成钞医院", num: 3, users: [] },
        { dpt: "中钞金服", num: 1, users: [] }
      ]
    };
  },
  methods: {
    lottery: async function(idx) {
      let { dpt, num } = this.dptList[idx];
      let { data } = await db.getViewCbpcSportScoreList({
        sid: this.$store.state.sport.id,
        dpt,
        limit: num
      });
      this.dptList[idx].users = data;
    }
  }
};
</script>

<style scoped lang="less">
.main {
  width: 100%;
  margin: 10px;
  .dpt {
    width: 90%;
    margin-left: 5%;
  }
  .lucky-list {
    width: 90%;
    margin-left: 5%;
    margin-top: 30px;
    .title {
      span {
        font-size: 20px;
      }
      .weui-btn {
        width: 80px;
        margin-left: 20px;
        display: unset;
      }
    }
    .luckyer {
      display: flex;
      flex-wrap: wrap;
      margin: 20px auto;
      li {
        width: 140px;
        height: 140px;
      }
      .detail {
        display: flex;
        flex-direction: column;
      }
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 2px 2px 20px #666;
      }
    }
  }
  .margin-top-20 {
    margin-top: 20px;
  }
}
</style>
