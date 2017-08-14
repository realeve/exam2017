<template>
  <div class="home">
    <msg :title="'感谢参与调查'" :description="desc" :icon="icon"></msg>
    <template v-if="isLucky">
      <checker class="carrier" v-model="carrier" default-item-class="checker-item" selected-item-class="checker-item-selected">
        <checker-item v-for="(item,i) of carrierList" :key="i" :value="(i+1)">{{item}}</checker-item>
      </checker>
      <form-preview header-label="奖品名称" :header-value="prizeLevel" :body-items="list"></form-preview>
      <div class="submit">
        <x-button :disabled="carrier==''|| showPrize" type="primary" @click.native="submit">查看充值密码</x-button>
        <x-button plain @click.native="viewHome">返回首页</x-button>
      </div>
    </template>
    <template v-else>
      <div class="submit">
        <x-button plain @click.native="viewHome">返回首页</x-button>
      </div>
    </template>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>

<script>
  import {
    Checker,
    CheckerItem,
    Msg,
    XButton,
    Toast,
    FormPreview,
    dateFormat
  } from 'vux'

  import {
    mapState
  } from 'vuex'

  export default {
    components: {
      Checker,
      CheckerItem,
      Msg,
      XButton,
      Toast,
      FormPreview
    },
    data() {
      return {
        toast: {
          show: false,
          msg: ''
        },
        desc: '恭喜您成为本次活动的幸运用户，请选择您的运营商以获取奖品：',
        icon: 'success',
        prizeLevel: '一等奖',
        list: [{
          label: '金额',
          value: '100元'
        }, {
          label: '运营商',
          value: ''
        }, {
          label: '充值密码',
          value: ''
        }],
        showPrize: false,
        carrier: 0,
        carrierList: ['中国移动', '中国联通']
      }
    },
    watch: {
      carrier(val) {
        this.list[1].value = val == '' ? '' : this.carrierList[val - 1];
      }
    },
    computed: {
      ...mapState(['userInfo', 'cdnUrl']),
      isLucky() {
        return Math.random() > 0.3;
      }
    },
    methods: {
      now() {
        return dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
      },
      submit() {
        let params = {
          s: '/addon/Api/Api/setLuckyUserInfo',
          rec_time: this.now(),
          openid: this.userInfo.openid,
        }

        this.list[2].value = '6234 8876 8866 3322 332';
        this.showPrize = true;

        console.log(params);
        return;
        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          this.toast.show = true;
          this.toast.msg = res.data.msg;
        })
      },
      loadDefaultData() {
        let params = {
          s: '/addon/Api/Api/getLuckyUserDefaultInfo',
          openid: this.userInfo.openid,
        }
        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          let obj = res.data[0];
          if (typeof obj == 'undefined' || !Reflect.get(obj, 'username')) {
            return;
          }
          // 业务逻辑在此
        });
      },
      viewHome() {
        this.$router.push('/');
      },
      isTrueUrl() {
        if (!this.userInfo.openid) {
          window.location.href = window.location.href.split('?')[0];
          return;
        }
        let params = {
          s: '/addon/Api/Api/isLuckyUser',
          openid: this.userInfo.openid,
        }
        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          if (res.data[0].num == 0) {
            this.viewHome();
          }
        })
      },
      init() {
        // this.isTrueUrl();
        // this.loadDefaultData();
        document.title = '个人信息';
      }
    },
    mounted() {
      this.init();
      if(!this.isLucky){
        this.desc = '感谢您对本次活动的大力支持，下次可能会中奖哦。'
      }
    }
  }

</script>

<style scoped lang="less">
  .home {
    margin-top: 10%;
    height: 100%;
    font-weight: 100;
    .submit {
      padding: 30px 20px;
    }
  }


  .checker-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
  }

  .checker-item-selected {
    background: #ffffff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTZDOEJBQ0E3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTZDOEJBQ0I3NkIxMTFFNEE3MzJFOUJCMEU5QUM0QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNkM4QkFDODc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNkM4QkFDOTc2QjExMUU0QTczMkU5QkIwRTlBQzRCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnMGp3kAAAAJUExURf9KAP///////4Jqdw0AAAADdFJOU///ANfKDUEAAAAuSURBVHjaTMpBDgAABAPB5f+PlhLUpZMWuQcYMWLEyDN4ymqa5KS4+3G+KAEGACQmAGlKzr56AAAAAElFTkSuQmCC') no-repeat right bottom;
    border-color: #ff4a00;
  }

  .weui-msg__desc {
    text-align: left!important;
  }

  .carrier {
    margin: 15px 0;
    display: flex;
    justify-content: center;
  }

</style>
