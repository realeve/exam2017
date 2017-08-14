<template>
  <div class="home">
    <div class="content">
      <msg :title="'感谢参与调查'" :description="desc" :icon="icon"></msg>
      <template v-if="isLucky">
        <form-preview header-label="用户信息预览" :header-value="username+'(收)'" :body-items="list" />
        <div class="box">
          <group title="基本信息">
            <x-input title="姓名" name="username" v-model="username" placeholder="请输入姓名" is-type="china-name"></x-input>
            <x-input title="手机号码" name="mobile" v-model="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
          </group>
  
          <group>
            <x-address title="省/市" raw-value v-model="addressArr" :list="addressData" inline-desc="点击设置地址"></x-address>
            <x-input title="详细地址" name="address_detail" v-model="address_detail" placeholder="请输入详细信息"></x-input>
          </group>
  
          <div class="submit">
            <x-button type="primary" @click.native="submit">提交信息</x-button>
            <x-button plain @click.native="viewLucky">查看中奖列表</x-button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="submit">
          <x-button type="primary" @click.native="viewLucky">查看中奖列表</x-button>
        </div>
      </template>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import {
  XButton,
  XInput,
  Group,
  Msg,
  Cell,
  dateFormat,
  Toast,
  XAddress,
  ChinaAddressV3Data,
  Value2nameFilter as value2name,
  FormPreview
} from 'vux'

import {
  mapState
} from 'vuex'

export default {
  components: {
    XButton,
    XInput,
    Msg,
    Group,
    Cell,
    Toast,
    XAddress,
    FormPreview
  },
  data() {
    return {
      username: '',
      mobile: '',
      desc: '感谢您对本次活动的大力支持。',
      icon: 'success',
      toast: {
        show: false,
        msg: ''
      },
      addressArr: [],
      addressData: ChinaAddressV3Data,
      address_detail: '',
      isLucky: 0
    }
  },
  computed: {
    ...mapState(['userInfo', 'cdnUrl']),
    address() {
      return value2name(this.addressArr, ChinaAddressV3Data)
    },
    list() {
      return [{
        label: '手机',
        value: this.mobile
      }, {
        label: '省/市',
        value: this.address
      }, {
        label: '详细地址',
        value: this.address_detail
      }];
    }
  },
  methods: {
    now() {
      return dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
    },
    submit() {
      let params = {
        s: '/addon/Api/Api/setResearchLuckyInfo',
        username: this.username,
        mobile: this.mobile,
        address: this.address,
        address_detail: this.address_detail,
        rec_time: this.now(),
        openid: this.userInfo.openid,
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.toast.show = true;
        this.toast.msg = res.data.msg;
      })
    },
    loadDefaultData() {
      let params = {
        s: '/addon/Api/Api/getResearchLuckyInfo',
        openid: this.userInfo.openid,
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data;
        this.isLucky = (obj.prize_level == 1);

        if (!this.isLucky) {
          return;
        }
        this.desc = '恭喜您成为本次活动的幸运用户，请填写个人收件信息以方便我们邮寄。';
        if (typeof obj == 'undefined' || !Reflect.get(obj, 'username')) {
          return;
        }
        this.username = obj.username;
        this.mobile = obj.mobile;
        this.addressArr = obj.address.split(' ');
        this.address_detail = obj.address_detail
      });
    },
    viewHome() {
      this.$router.push('/');
    },
    viewLucky() {
      this.$router.push('/lucker');
    },
    doLottery() {
      // 抽奖
      let params = {
        s: '/addon/Api/Api/doResearchLottery',
        openid: this.userInfo.openid,
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let status = res.data.id;
        switch (status) {
          case 0: // 无效的记录
            this.toast.show = true;
            this.toast.msg = '无效记录';
            setTimeout(() => {
              this.viewHome();
            }, 500);
            break;
          // 抽奖信息写入正常
          case 1:
          case 2:
            this.loadDefaultData();
            break;
          case 3:
            this.doLottery();
            break;
        }
      });
    },
    init() {
      document.title = '现金使用情况问卷调查幸运用户';
      this.doLottery();
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
  .content {
    flex: 1;
  }
  .title {
    font-size: 13pt;
  }
  .box {
    margin-top: 40px;
    min-height: 350px;
  }
  .center {
    display: flex;
    justify-content: center;
  }
  .submit {
    padding: 30px 20px;
  }
}

</style>
