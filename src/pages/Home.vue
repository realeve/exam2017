<template>
  <div class="wrapper">
    <div class="content">
      <div class="btn-wrapper login">
        <!-- <x-button type="primary" @click.native="jump('errlist')">我的错题集</x-button> -->
        <x-button type="primary" @click.native="jump('login')">登录</x-button>
        <!-- <x-button>活动已截止</x-button> -->
        <!-- <x-button @click.native="jump('score')">排行榜</x-button> -->
        <!-- <x-button type="primary" @click.native="jump('doc')">知识学习</x-button> -->
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <!-- <canvas ref="band"></canvas> -->
    <div class="canvas" id="home"></div>
    <v-foot color="#aaa" />
    <img src="../assets/img/main.jpg" class="mainbg" />
  </div>
</template>
<script>
import particles from "particles.js";
import particlesSetting from "../lib/particlesSetting";

import { XButton, Toast } from "vux";

import { mapState } from "vuex";
import * as db from "../lib/db";

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
    ...mapState(["error_detail"]),
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
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${endInfo[0]}年${endInfo[1]}月${endInfo[2]}日`;
      }

      // 同年同月
      if (startInfo[0] === endInfo[1]) {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${endInfo[2]}日`;
      } else {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${endInfo[1]}月${endInfo[2]}日`;
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
            (127 * cos(r + (twoPi / 3) * 2) + 128)
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
    login: async function() {
      if (this.sport.userName == "" || this.sport.cardNo == "") {
        return;
      }

      let params = {
        sid: this.sport.id,
        card_no: this.sport.cardNo,
        username: this.sport.userName,
        dept_name: "%%"
      };

      if (this.sport.useDept) {
        params.dept_name = `%${this.sport.dpt[0]}%`;
      }

      let { data } = await db[
        !this.sport.alwaysRecordScore ? "login" : "login2"
      ](params);
      if (data.length === 0) {
        this.toast.show = true;
        this.toast.msg = "登录失败";
        return;
      }

      let obj = data[data.length - 1];

      // 卡号或部门输入错误
      if (obj.uid == 0) {
        return;
      }
      //校验姓氏
      // console.log(obj);

      // 登录成功
      this.sport.isLogin = true;
      this.showLoginfo = true;

      this.sport.uid = obj.uid;
      this.sport.curScore = obj.score;
      // this.sport.curTimes = parseInt(obj.answer_times) + 1;

      if (
        !this.sport.isOnline &&
        parseInt(obj.answer_times) >= this.sport.maxTimes
      ) {
        this.toast.show = true;
        this.toast.msg = "答题次数用完";
        this.haveAnswerTimes = false;
        this.jump("info");
      }
    }
  },
  mounted() {
    // this.animateCanvas();
    this.loadUserInfo();
    particlesJS("home", particlesSetting);
    document.title = this.sport.name; //+ "微信答题";
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
  // background-image: url("../assets/img/main.jpg");
  // background-size: cover;
  // background-position: center;
  .mainbg {
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: -1;
  }
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
