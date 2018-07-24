<template>
  <div class="wrapper">
    <group class="content">
      <x-input title="姓名" required name="userName" v-model="sport.userName" placeholder="点击此处输入姓名"></x-input>
      <x-input title="卡号" required type="number" :max="7" name="cardNo" v-model="sport.cardNo" placeholder="点击此处输入卡号" keyboard="number"></x-input>
      <template v-if="sport.useDept">
        <x-input title="部门" required disabled name="dpt" v-model="sport.dpt[0]"></x-input>
        <picker :data='dptList' v-model='sport.dpt'></picker>
      </template>
      <div class="btn">
        <x-button :disabled="!shouldCommit" type="primary" @click.native="login">登录</x-button>
      </div>
    </group>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <v-foot/>
  </div>
</template>
<script>
import { XButton, XInput, Group, Toast, Picker, GroupTitle } from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";

export default {
  components: {
    XButton,
    XInput,
    Group,
    Toast,
    GroupTitle,
    Picker
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      dptList: []
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport"]),
    shouldCommit() {
      return (
        this.sport.userName != "" &&
        this.sport.cardNo != "" &&
        (this.sport.useDept ? this.sport.dpt[0] != "" : true)
      );
    },
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    loadUserInfo() {
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo == null) {
        return;
      }
      userInfo = JSON.parse(userInfo);
      this.sport = {
        userName: userInfo.user_name,
        cardNo: userInfo.user_id,
        dpt: [userInfo.user_dpt]
      };
    },
    login: async function() {
      let params = {
        sid: this.sport.id,
        card_no: this.sport.cardNo,
        username: this.sport.userName,
        dept_name: "%%"
      };
      if (this.sport.useDept) {
        params.dept_name = `%${this.sport.dpt[0]}%`;
      }
      let { data } = await db.login(params);
      if (data.length === 0) {
        this.toast.show = true;
        this.toast.msg = "登录失败";
        return;
      }
      let obj = data[0];
      // 登录成功
      this.sport.isLogin = true;
      this.sport.curTimes = parseInt(obj.answer_times) + 1;

      this.sport.uid = obj.uid;
      this.sport.curScore = obj.score;

      // 更新微信用户信息
      var userInfo = JSON.stringify({
        user_name: params.username,
        user_id: params.card_no,
        user_dpt: this.sport.dpt[0]
      });
      localStorage.setItem("userInfo", userInfo);
      this.updateUserInfo(obj.uid, userInfo);

      if (
        !this.sport.isOnline &&
        parseInt(obj.answer_times) > this.sport.maxTimes
      ) {
        this.toast.show = true;
        this.toast.msg = "答题次数用完";
        this.jump("info");
        return;
      }

      if (this.sport.showDocument) {
        this.jump("doc");
      } else {
        this.jump("paper");
      }
    },
    // 更新头像信息
    updateUserInfo(uid, userInfo) {
      let user = localStorage.getItem("userInfo");
      user = JSON.parse(user);
      if (user.is_update) {
        return;
      }
      db
        .setCbpcUserList({
          nickname: this.userInfo.nickname,
          openid: this.userInfo.openid,
          sex: this.userInfo.sex,
          headimgurl: this.userInfo.headimgurl,
          uid
        })
        .then(res => {
          userInfo.is_update = true;
          localStorage.setItem("userInfo", userInfo);
        });
    },
    init: async function() {
      if (!this.sport.useDept) {
        this.loadUserInfo();
        return;
      }
      this.sport.useDept = false;
      let { data } = await db.getCbpcDeptList(this.sport.id);
      this.dptList[0] = data.map(([dept]) => dept);
      this.sport.useDept = true;
      this.loadUserInfo();
    }
  },
  mounted() {
    document.title = "登录";
    this.init();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  font-size: 13pt;
  color: #233;
  width: 100%;
  justify-content: center;
  .title {
    font-size: 22pt;
  }
}

.btn {
  width: 80%;
  margin: 60px auto;
}
</style>
