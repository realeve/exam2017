<template>
  <div>
    <h2>用户信息查询</h2>
    <group class="content">
      <x-input title="姓名或卡号" required name="userName" v-model="userName" placeholder="点击此处输入姓名或卡号"></x-input>
    </group>
    <div v-if="userList.length === 0" style="tip">
      未搜索到 {{userName}} 的相关信息。
    </div>
    <ul v-else class="user">
      <li class="user-item" v-for="(item,id) in userList" :key="item.uid">
        <span>{{id+1}}.{{item.dept_name}}</span>
        <span>{{item.user_name}}</span>
        <span>{{item.card_no}}</span>
      </li>
    </ul>
    <div class="btn">
      <x-button type="primary" @click.native="query">查询</x-button>
    </div>
    <hr/>
    <h2 style="margin-top:20px;">用户信息修改</h2>
    <group class="content">
      <x-input title="姓名" name="userName" v-model="userName" placeholder="点击此处输入姓名"></x-input>
      <x-input title="卡号" name="card_no" v-model="card_no" placeholder="点击此处输入卡号"></x-input>
      <template v-if="dptList.length>0">
        <x-input title="部门" required disabled name="dept_name" v-model="dept_name[0]"></x-input>
        <picker :data='dptList' v-model='dept_name'></picker>
      </template>
    </group>
    <div class="btn">
      <x-button type="primary" @click.native="update">{{editTitle}}</x-button>
      <x-button @click.native="add">新增</x-button>
    </div>

    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>
<script>
import { XButton, XInput, Group, Toast, Picker, GroupTitle } from "vux";
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
      userName: "",
      userList: [],
      dept_name: [],
      card_no: "",
      toast: {
        show: false,
        msg: ""
      },
      dptList: [],
      depts: []
    };
  },
  computed: {
    editTitle() {
      if (this.userName.length == 0) {
        return "根据卡号改部门";
      }
      return "根据姓名及部门改卡号";
    }
  },
  methods: {
    query: async function() {
      this.userList = [];
      const { data } = await db.getViewCbpcUserList({
        card_no: this.userName,
        user_name: this.userName
      });
      if (typeof data == "undefined") {
        return;
      }
      this.userList = data;
    },
    add: async function() {
      let { dept_id } = this.depts.find(
        item => item.dept_name == this.dept_name[0]
      );

      let params = {
        dept_id,
        card_no: this.card_no,
        user_name: this.userName
      };
      let { data } = await db.addCbpcUserList(params);
      this.showToast(data);
    },
    showToast(data) {
      this.card_no = "";
      this.userName = "";
      if (data.length > 0) {
        this.toast.show = true;
        this.toast.msg = "修改成功";
      }
    },
    update: async function() {
      // 卡号改部门
      let params = {
        dept_id,
        card_no
      };
      let edidDept = this.userName.length == 0;
      // 改卡号
      if (!edidDept) {
        params.user_name = this.userName;
      }
      let { data } = await db[edidDept ? "updateDeptInfo" : "updateCardInfo"](
        params
      );
      if (data.length == 0) {
        return;
      }
      this.showToast(data);
    },
    init: async function() {
      let { data } = await db.getCbpcDepts(this.$store.state.sport.id);
      this.depts = data;
      this.dptList = [data.map(({ dept_name }) => dept_name)];
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.tip {
  margin-top: 20px;
}
.user {
  .tip;
  padding: 0 10px;
  &-item {
    display: flex;
    justify-content: space-between;
  }
}
.btn {
  width: 80%;
  margin: 60px auto;
}
</style>
