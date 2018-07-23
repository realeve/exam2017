<template>
  <div class="wrapper">
    <!-- <p class="slogan" v-html="sport.slogan"></p> -->
    <!-- <p class="margin-top-20">
      <svg t="1515034252685" class="icon" style="" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="729" xmlns:xlink="http://www.w3.org/1999/xlink" width="90" height="90">
        <path d="M 1003.71 387.5 C 881.839 -19.875 491.839 0.875 491.839 0.875 c 547 268.375 301.375 648.5 301.375 648.5 L 475.839 325.25 l 121.25 -132.625 l -82.875 -76.75 l -65.5 59.125 l -122.75 -1.5 l -250.25 254 l 151.5 137.375 l 94.125 -91 L 644.964 788.5 C 370.589 968.875 120.339 671.875 120.339 671.875 l -98.75 86.25 L 96.464 846 l -12.875 17.5 c -35 -3.25 -49.375 12.75 -49.375 12.75 c -86.125 83.125 17.5 129.375 17.5 129.375 c 100.625 22.375 95.75 -81.5 95.75 -81.5 l 19.125 -23.875 c 378 204.375 601.125 20.75 601.125 20.75 l 108.375 102.25 l 148.25 -148.625 l -97.25 -105.5 s 132.5 -194.5 76.625 -381.625 Z m 0 0" fill="#f3d713" p-id="730"></path>
      </svg>
    </p> -->
    <div class="content">
      <!-- <p class="title">
        <span class="sub-title">{{sport.orgname}}</span><br>{{year}}年{{sport.name}}活动</p>
      <div class="margin-top-20 time">
        活动时间：{{sportDate}}
      </div>
      <p>{{sport.userName}}您好,欢迎参加本次活动，您当前得分为{{sport.curScore}}分，答题{{sport.curTimes-1}}次，若不是本人请点击按钮重新登录。
      </p>
      <div v-if="showLoginfo" class="btn-wrapper login">
        <x-button v-if="sport.showDocument" @click.native="jump('doc')">{{sport.name}}学习</x-button>
        <template v-if="haveAnswerTimes">
          <x-button @click.native="jump('doc')">安全知识学习</x-button>
          <x-button type="primary" v-if="sport.isLogin" @click.native="jump('paper')">开始答题</x-button>
          <x-button @click.native="jump('score')">排行榜</x-button>
        </template>
      </div> -->
      <!-- <div v-else class="btn-wrapper margin-top-60 login">
        <x-button type="primary" @click.native="jump('login')">登录</x-button>
        <x-button @click.native="jump('score')">排行榜</x-button>
      </div> -->

      <div class="btn-wrapper margin-top-60 login">
        <x-button type="primary" @click.native="jump('login')">登录</x-button>
        <!-- <x-button>活动已截止</x-button> -->
        <x-button @click.native="jump('score')">排行榜</x-button>
      </div>

    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <!-- <canvas ref="band"></canvas> -->
    <div class="canvas" id="home"></div>
    <v-foot color="#333" />
  </div>
</template>
<script>
import particles from "particles.js";
import particlesSetting from "../lib/particlesSetting";

import { XButton, Toast } from "vux";

import { mapState } from "vuex";

export default {
  components: {
    XButton,
    Toast
  },
  data() {
    return {
      toast: {
        show: false,
        msg: ""
      },
      showLoginfo: false,
      haveAnswerTimes: true
    };
  },
  computed: {
    ...mapState(["cdnUrl"]),
    year() {
      let date = new Date();
      return date.getFullYear();
    },
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    },
    sportDate() {
      let { startDate, endDate } = this.sport;
      let startInfo = startDate.split("-");
      let endInfo = endDate.split("-");
      startInfo[1] = parseInt(startInfo[1], 10);
      startInfo[2] = parseInt(startInfo[2], 10);
      endInfo[1] = parseInt(endInfo[1], 10);
      endInfo[2] = parseInt(endInfo[2], 10);

      // 不同年
      if (startInfo[0] !== endInfo[0]) {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[0]
        }年${endInfo[1]}月${endInfo[2]}日`;
      }

      // 同年同月
      if (startInfo[0] === endInfo[1]) {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[2]
        }日`;
      } else {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[1]
        }月${endInfo[2]}日`;
      }
    }
  },
  methods: {
    jump(router) {
      this.$router.push(router);
    },
    animateCanvas() {
      function i() {
        if ((ctx.clearRect(0, 0, w, h), firstTime))
          for (
            q = [
              {
                x: 0,
                y: 0.7 * h + bandwidth,
                v_x: 0,
                v_y: 0
              },
              {
                x: 0,
                y: 0.7 * h - bandwidth,
                v_x: 0,
                v_y: 0
              }
            ],
              verticals.push(q[0]),
              verticals.push(q[1]);
            q[1].x < w + bandwidth;

          )
            firstDraw(q[0], q[1]);
        else
          for (var t = 0, e = 1; e < verticals.length - 1; )
            tweak(t, e), t++, e++;
        (firstTime = !1), requestAnimationFrame(i);
      }

      function go(t) {
        random() < 0.5 || (t.v_x += 0.1 * (random() - 0.5)),
          random() < 0.5 || (t.v_y += 0.1 * (random() - 0.5));
        var e = 0.3;
        (t.v_x = Math.max(Math.min(t.v_x, e), -e)),
          (t.v_y = Math.max(Math.min(t.v_y, e), -e)),
          (t.x += t.v_x),
          (t.y += t.v_y),
          (t.x < 0 || t.x > w) && (t.v_x *= -1.01),
          (t.y < 0 || t.y > h) && (t.v_y *= -1.01);
      }

      function tweak(t, e) {
        ctx.beginPath();
        var i = verticals[t],
          a = verticals[e],
          o = verticals_side[t],
          r = fillStyles[t];
        go(a),
          ctx.moveTo(i.x, i.y),
          ctx.lineTo(a.x, a.y),
          go(o),
          ctx.lineTo(o.x, o.y),
          ctx.closePath();
        (ctx.strokeStyle = r), ctx.stroke();
        // ctx.fillStyle = r;
        // ctx.fill();
      }

      function firstDraw(t, e) {
        ctx.beginPath(), ctx.moveTo(t.x, t.y), ctx.lineTo(e.x, e.y);
        var i = e.x + (2 * random() - 0.25) * bandwidth,
          a = y(e.y);
        ctx.lineTo(i, a), ctx.closePath(), (r -= twoPi / -50);
        ctx.strokeStyle =
          "#" +
          (
            ((127 * cos(r) + 128) << 16) |
            ((127 * cos(r + twoPi / 3) + 128) << 8) |
            (127 * cos(r + twoPi / 3 * 2) + 128)
          ).toString(16);
        // ctx.fillStyle = ctx.strokeStyle;
        ctx.stroke();
        ctx.fill;
        (q[0] = q[1]),
          (q[1] = {
            x: i,
            y: a,
            v_x: 0,
            v_y: 0
          }),
          verticals.push(q[1]),
          fillStyles.push(ctx.strokeStyle),
          verticals_side.push(q[1]);
      }

      function y(t) {
        var e = t + (2 * random() - 1.1) * bandwidth;
        return e > h || 0 > e ? y(t) : e;
      }
      var canvas = this.$refs.band,
        ctx = canvas.getContext("2d"),
        pr = window.devicePixelRatio || 1,
        w = window.innerWidth,
        h = window.innerHeight,
        bandwidth = 90,
        q,
        r = 0,
        twoPi = 2 * Math.PI,
        cos = Math.cos,
        random = Math.random;
      (canvas.width = w * pr),
        (canvas.height = h * pr),
        ctx.scale(pr, pr),
        (ctx.globalAlpha = 0.2);
      var verticals = [],
        verticals_side = [],
        fillStyles = [],
        firstTime = !0;
      requestAnimationFrame(i);
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
      this.login();
    },
    login() {
      let params = {
        user_name: this.sport.userName,
        user_id: this.sport.cardNo,
        user_dpt: this.sport.dpt[0],
        sportid: this.sport.id,
        s: "/addon/GoodVoice/GoodVoice/examSafeLogin"
      };
      if (
        this.sport.userName == "" ||
        this.sport.cardNo == "" ||
        this.sport.dpt[0] == ""
      ) {
        return;
      }
      this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => {
          let obj = res.data;
          // 卡号或部门输入错误
          if (obj.id == 0) {
            return;
          }
          //校验姓氏
          if (obj.first_name.trim() != params.user_name.substr(0, 1)) {
            return;
          }

          // 登录成功
          this.sport.isLogin = true;
          this.showLoginfo = true;

          this.sport.uid = obj.id;
          this.sport.curScore = obj.score;
          this.sport.curTimes = parseInt(obj.answer_times) + 1;

          if (
            !this.sport.isOnline &&
            parseInt(obj.answer_times) > this.sport.maxTimes
          ) {
            this.toast.show = true;
            this.toast.msg = "答题次数用完";
            this.haveAnswerTimes = false;
            this.jump("info");
          }
        });
    }
  },
  mounted() {
    // this.animateCanvas();
    this.loadUserInfo();
    particlesJS("home", particlesSetting);
    document.title = this.sport.name + "微信答题";
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  // background-color: #e33e3e;
  background-image: url("../assets/img/main.jpg");
  background-size: cover;
  background-position: center;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 13pt;
  color: #333;
  width: 100%;
  justify-content: center;
  .title {
    font-size: 16pt;
    text-align: center;
  }
  .time {
    font-size: 12pt;
  }
  .btn-wrapper {
    position: absolute;
    bottom: 7%;
    width: 145px;
    font-size: 10pt;
    p {
      padding-bottom: 10px;
    }
  }
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

@red-color: #e83e21;
.weui-btn + .weui-btn {
  margin-top: 5px;
}
.weui-btn_default {
  line-height: 2;
  background: transparent;
  color: #333;
}

.weui-btn:after {
  border-color: @red-color;
}

.weui-btn_primary {
  background-color: @red-color;
}

.slogan {
  padding-top: 15px;
  font-size: 15pt;
  color: #333;
  font-weight: normal;
}
</style>
