<template>
  <div class="home">
    <div class="content">
      <group title="活动设置" class="wrapper">
        <x-input title="分享人数" name="shareNum" v-model="shareNum"></x-input>
      </group>
  
      <div class="submit">
        <x-button type="primary" @click.native="submit">提交信息</x-button>
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import {
  XButton,
  XInput,
  Group,
  Toast
} from 'vux'

import {
  mapState
} from 'vuex'

export default {
  components: {
    XButton,
    XInput,
    Group,
    Toast
  },
  data() {
    return {
      shareNum: 0,
      toast: {
        show: false,
        msg: ''
      },
    }
  },
  computed: {
    ...mapState(['cdnUrl','sport'])
  },
  methods: {
    loadShareNum() {
      // 获取分享人数 shareNum
      let params = {
        s: '/addon/Api/Api/getSportSetting',
        sid: this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data[0];
        this.shareNum = obj.nums;
      });
    },
    submit() {
      // 设置分享人数 shareNum
      let params = {
        s: '/addon/Api/Api/setSportSetting',
        sid: this.sport.id,
        nums:this.shareNum
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.toast.show = true;
        this.toast.msg = res.data.msg;
      });
    },
    init() {
      document.title = '活动设置';
      this.loadShareNum();
    }
  },
  mounted() {
    this.init();
  }
}

</script>

<style scoped lang="less">
.home {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-weight: 100;
  margin-top: 10px;
  .content {
    flex: 1;
  }
  .wrapper {
    padding-top: 20px;
  }
  .submit {
    padding: 30px 20px;
  }
}

</style>
