<template>
  <div id="app">
    <!-- <v-header/> -->
    <loading v-model="isLoading" />
    <router-view />
    <!-- <v-foot/>  -->
  </div>
</template>

<script>
import { Loading } from "vux";
import md5 from "md5";

// import { querystring } from "vux";
import qs from "qs";
import { mapState } from "vuex";
import { axios } from "./lib/axios";
import * as db from "./lib/db";
import moment from "moment";
import VConsole from "vconsole";
var v = new VConsole();

export default {
  name: "app",
  components: {
    Loading
  },
  data() {
    return {
      code: "",
      apiId: "wx762c9153df774440",
      title: "",
      shouldShare: false
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport", "wxUrl"]),
    isLoading: {
      get() {
        return this.$store.state.isLoading;
      },
      set(val) {
        this.$store.commit("updateLoadingStatus", val);
      }
    },
    userInfo: {
      get() {
        return this.$store.state.userInfo;
      },
      set(val) {
        this.$store.commit("setUserinfo", val);
      }
    },
    // 签名用URL
    url() {
      return window.location.href.split("#")[0];
    },
    // 跳转URL
    redirectUrl() {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        this.apiId
      }&redirect_uri=${encodeURIComponent(
        this.url
      )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
    },
    shareUrl() {
      // 被分享的链接必须在安全域名中，不能直接分享为 redirectUrl
      return window.location.href.split("#")[0].split("?")[0];
    },
    shouldInitShare() {
      // && this.sport.curScore >= this.sport.minPrizeScore
      return this.sport.isLogin && this.shouldShare;
    }
  },
  watch: {
    shouldInitShare(val) {
      if (!val) {
        return;
      }
      // this.title = `我在2018年${this.sport.name}活动中获得了${
      //   this.sport.curScore
      // }分，你也来参与吧`;
      this.title = `${this.sport.name}活动正在进行中，快来参与吧`;
      this.initWxShare();
    }
  },
  methods: {
    wxPermissionInit() {
      return axios({
        params: {
          s: "/weixin/signature",
          url: this.url.split("?")[0]
        }
      }).then(data => {
        this.shouldShare = true;
        this.wxReady(data);
        this.initWxShare();
        // this.recordReadNum();
      });
    },
    wxReady(obj) {
      let config = {
        debug: false,
        appId: obj.appId,
        timestamp: obj.timestamp,
        nonceStr: obj.nonceStr,
        signature: obj.signature,
        jsApiList: [
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
          "hideMenuItems",
          "hideOptionMenu"
        ]
      };
      this.$wechat.config(config);
    },
    initWxShare() {
      this.$wechat.ready(() => {
        let option = {
          title: this.title, // 分享标题
          desc: this.title,
          link: this.shareUrl,
          imgUrl: "https://www.cbpc.ltd/public/cdn/cbpc.jpg",
          type: "",
          dataUrl: "",
          success: function() {},
          cancel: function() {}
        };
        if (this.sport.validQR) {
          this.$wechat.hideOptionMenu();

          // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          this.$wechat.hideMenuItems({
            menuList: [
              "menuItem:editTag",
              "menuItem:delete",
              "menuItem:copyUrl",
              "menuItem:originPage",
              "menuItem:readMode",
              "menuItem:openWithQQBrowser",
              "menuItem:openWithSafari",
              "menuItem:share:email",

              // 禁止分享朋友圈相关设置
              "menuItem:share:appMessage",
              "menuItem:share:timeline"
            ]
          });
        }

        this.$wechat.onMenuShareAppMessage(option);
        this.$wechat.onMenuShareTimeline(option);
        // this.$wechat.onMenuShareQQ(option);
        // this.$wechat.onMenuShareWeibo(option);
        // this.$wechat.onMenuShareQZone(option);
      });
    },
    // 获取微信用户信息（昵称，地区）
    getWXUserInfo() {
      let userInfo;
      let wx_userinfo = localStorage["wx_userinfo"];
      if (typeof wx_userinfo != "undefined") {
        userInfo = JSON.parse(wx_userinfo);
        this.userInfo = userInfo;
        return;
      }
      this.getWXInfo();
    },
    getWXInfo() {
      axios({
        params: {
          s: "/weixin/user_info",
          code: this.code
        }
      }).then(data => {
        this.userInfo = data;
        if (typeof data.nickname != "undefined") {
          localStorage.setItem("wx_userinfo", JSON.stringify(data));
        }
      });
    },
    wxInit() {
      if (this.sport.loadWXInfo && !this.needRedirect()) {
        this.getWXUserInfo();
      }
      this.wxPermissionInit();
    },
    needRedirect() {
      // let hrefArr = window.location.href.split("?");
      if (window.location.search === "") {
        window.location.href = this.redirectUrl;
        return true;
      }

      let params = qs.parse(window.location.search.slice(1));
      this.code = params.code;
      return false;
    },
    recordReadNum() {
      // 创建唯一索引
      // CREATE UNIQUE INDEX col_url ON tbl_common_visit_count(url);
      if (location.href.includes("localhost")) {
        return;
      }
      db.addCommonVisitCount(window.location.href.split("?")[0]);
    }
  },
  created() {
    if (this.sport.validQR) {
      let query = window.location.search.slice(1);
      let obj = qs.parse(query);
      // console.log(obj);
      if (!obj.timestamp) {
        // 二维码失效
        this.$router.push("/error?state=0");
        return;
      }

      let salt = "cbpc";
      let token = md5(salt + obj.timestamp)
        .slice(10, 16)
        .split("")
        .reverse()
        .join("");

      if (token !== obj.t) {
        // 二维码失效
        this.$router.push("/error?state=0");
        return;
      }

      let isValid = moment(Number(obj.timestamp))
        .add(15, "s")
        .isAfter(moment());
      if (!isValid) {
        this.$router.push("/error?state=1");
        return;
      }
    }

    // this.$store.commit("setStore", { error_detail: [1, 2, 3, 4, 3, 3] });

    this.title = this.sport.name + "活动";
    // 开发模式下，初始化值
    if (process.env.NODE_ENV == "development") {
      this.userInfo = {
        openid: "oW0w1v4qftC8xUP3q-MPIHtXB7hI",
        nickname: "宾不厌诈",
        sex: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        country: "中国",
        headimgurl:
          "http://wx.qlogo.cn/mmhead/Q3auHgzwzM7RSAYiaxiaC1lOZYicWic9YZKEFJ2TKEfh3pFJibLvf7IxdLQ/0",
        privilege: []
      };
    } else {
      // 正式环境微信载入
      this.wxInit();
    }

    if (moment().format("YYYYMMDD") == "20200404") {
      document.querySelector("html").style.filter = "grayscale(1)";
    }

    if (!this.sport.validQR) {
      return;
    }

    var router = this.$router;
    // 宽高比
    /**
     * 9/16 = 0.5625
     * 10/16 = 0.625
     */
    // console.log(window.innerWidth / window.innerHeight);
    if (window.innerWidth / window.innerHeight > 0.7) {
      router.push("/error?state=2");
    }

    // 监听页面非激活事件；
    document.addEventListener("visibilitychange", function() {
      // 用户息屏、或者切到后台运行 （离开页面）
      // console.log("切换到后台", moment().format("YYYYMMDD hh:mm:ss"));
      router.push("/error?state=2");
    });

    // 返回时关闭微信网页
    window.addEventListener(
      "popstate",
      function(e) {
        weixinClosePage();
      },
      false
    );
    //关闭微信页面
    function weixinClosePage() {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            weixin_ClosePage,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", weixin_ClosePage);
          document.attachEvent("onWeixinJSBridgeReady", weixin_ClosePage);
        }
      } else {
        weixin_ClosePage();
      }
    }
    function weixin_ClosePage() {
      WeixinJSBridge.call("closeWindow");
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "assets/css/reset.css";
@import "assets/css/slider.less";
</style>
