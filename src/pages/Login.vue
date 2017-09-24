<template>
  <div class="wrapper">
    <group class="content">
      <x-input title="姓名" required name="userName" v-model="sport.userName"></x-input>
      <x-input title="卡号" required type="number" :max="7" name="cardNo" v-model="sport.cardNo" keyboard="number"></x-input>
      <x-input title="部门" required disabled name="dpt" v-model="sport.dpt[0]"></x-input>
      <picker :data='dptList' v-model='sport.dpt'></picker>
      <div class="btn">
        <x-button :disabled="!shouldCommit" type="primary" @click.native="submit">登录</x-button>
      </div>
    </group>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <v-foot/>
  </div>
</template>
<script>
import {
  XButton,
  XInput,
  Group,
  Toast,
  Picker,
  GroupTitle
} from 'vux'

import {
  mapState
} from 'vuex'

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
        msg: ''
      },
      dptList: [
        ["董事会、经理部", "办公室", "企管规划部", "计划财务部", "生产管理部", "技术质量部", "安全保卫部", "设备管理部", "物资管理部", "技术中心", "基建与行政事务部",
          "人力资源部", "企业文化部", "纪检监察内审部", "群工部", "离退休工作部", "印钞数管部", "胶凹制作部", "印码制作部", "检封制作部", "钞纸制作部", "钞纸成品制作部",
          "造币制作部", "能源环保部", "市场开发部", "采购管理部", "长城公司", "物业公司", "金鼎公司", "中钞金服", "成钞医院"
        ]
        //['办公室', '电商部', '粉体材料生产部', '计划财务部', '加工生产部', '精炼生产部', '科技质量部', '企划安保部', '生产管理部', '物资设备保障部', '营销部', '造币制作部', '成钞财务部']
      ]
    }
  },
  computed: {
    ...mapState(['cdnUrl']),
    shouldCommit() {
      return this.sport.userName != '' && this.sport.cardNo != '' && this.sport.dpt[0] != '';
    },
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit('setSport', val);
      }
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    submit() {
      let params = {
        user_name: this.sport.userName,
        user_id: this.sport.cardNo,
        user_dpt: this.sport.dpt[0],
        sportid: this.sport.id,
        s: '/addon/GoodVoice/GoodVoice/examSafeLogin'
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data;
        // 卡号或部门输入错误
        if (obj.id == 0) {
          this.toast.show = true;
          this.toast.msg = obj.msg;
          return;
        }
        //校验姓氏
        if (obj.first_name.trim() != params.user_name.substr(0, 1)) {
          this.toast.show = true;
          this.toast.msg = '姓名填写错误';
          return;
        }

        if (parseInt(obj.answer_times) > this.sport.maxTimes) {
          this.toast.show = true;
          this.toast.msg = '答题次数用完';
          this.jump('info');
        } else {
          // 登录成功
          this.sport.isLogin = true;
          this.sport.curTimes = parseInt(obj.answer_times) + 1;
          var userInfo = JSON.stringify({
            user_name: this.sport.userName,
            user_id: this.sport.cardNo,
            user_dpt: this.sport.dpt[0],
          });
          this.sport.uid = obj.id;
          this.sport.curScore = obj.score;
          localStorage.setItem('userInfo', userInfo);
          if(this.sport.showDocument){
            this.jump('doc');
          }else{
            this.jump('paper');
          }          
        }
      });
    }
  },
  mounted() {
    document.title = '登录';
  }
}

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
