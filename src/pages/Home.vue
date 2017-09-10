<template>
  <div class="wrapper">
    <p class="slogan">{{sport.slogan}}</p>
    <div class="content">
      <p class="title">成都印钞有限公司<br>{{year}}年{{sport.name}}活动</p>
      <div class="margin-top-20">
        活动时间：{{year}}年{{sport.timeRange}} 
      </div>
      <div v-if="showLoginfo" class="btn-wrapper margin-top-60">
        <p>{{sport.userName}}您好,欢迎参加本次活动，若不是本人请点击按钮重新登录。
        </p>
        <!-- <x-button @click.native="jump('doc')">{{sport.name}}知识学习</x-button> -->
        <template v-if="haveAnswerTimes">
          <x-button @click.native="jump('login')">登录</x-button>
          <x-button type="primary" @click.native="jump('paper')">开始答题</x-button>
        </template>
      </div>
      <div v-else class="btn-wrapper margin-top-60">
        <x-button @click.native="jump('login')">登录</x-button>
      </div>

    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
    <canvas ref="band"></canvas>
    <v-foot/>
  </div>
</template>
<script>
  import {
    XButton,
    Toast
  } from 'vux'

  import {
    mapState
  } from 'vuex';

  export default {
    components: {
      XButton,
      Toast
    },
    data() {
      return {
        toast: {
          show: false,
          msg: ''
        },
        showLoginfo: false,
        haveAnswerTimes: true
      }
    },
    computed: {
      ...mapState(['cdnUrl']),
      year() {
        let date = new Date();
        return date.getFullYear();
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
      animateCanvas() {
        function i() {
          if (ctx.clearRect(0, 0, w, h), firstTime)
            for (q = [{
                x: 0,
                y: .7 * h + bandwidth,
                v_x: 0,
                v_y: 0
              }, {
                x: 0,
                y: .7 * h - bandwidth,
                v_x: 0,
                v_y: 0
              }], verticals.push(q[0]), verticals.push(q[1]); q[1].x < w + bandwidth;) firstDraw(q[0], q[1]);
          else
            for (var t = 0, e = 1; e < verticals.length - 1;) tweak(t, e), t++, e++;
          firstTime = !1, requestAnimationFrame(i)
        }

        function go(t) {
          random() < .5 || (t.v_x += .1 * (random() - .5)), random() < .5 || (t.v_y += .1 * (random() - .5));
          var e = .3;
          t.v_x = Math.max(Math.min(t.v_x, e), -e), t.v_y = Math.max(Math.min(t.v_y, e), -e), t.x += t.v_x, t.y += t.v_y,
            (t.x < 0 || t.x > w) && (t.v_x *= -1.01), (t.y < 0 || t.y > h) && (t.v_y *= -1.01)
        }

        function tweak(t, e) {
          ctx.beginPath();
          var i = verticals[t],
            a = verticals[e],
            o = verticals_side[t],
            r = fillStyles[t];
          go(a), ctx.moveTo(i.x, i.y), ctx.lineTo(a.x, a.y), go(o), ctx.lineTo(o.x, o.y), ctx.closePath();
          ctx.strokeStyle = r, ctx.stroke()
          // ctx.fillStyle = r;
          // ctx.fill();
        }

        function firstDraw(t, e) {
          ctx.beginPath(), ctx.moveTo(t.x, t.y), ctx.lineTo(e.x, e.y);
          var i = e.x + (2 * random() - .25) * bandwidth,
            a = y(e.y);
          ctx.lineTo(i, a), ctx.closePath(), r -= twoPi / -50
          ctx.strokeStyle = "#" + (127 * cos(r) + 128 << 16 | 127 * cos(r + twoPi / 3) + 128 << 8 | 127 * cos(r + twoPi /
            3 * 2) + 128).toString(16);
          // ctx.fillStyle = ctx.strokeStyle;
          ctx.stroke();
          ctx.fill;
          q[0] = q[1], q[1] = {
            x: i,
            y: a,
            v_x: 0,
            v_y: 0
          }, verticals.push(q[1]), fillStyles.push(ctx.strokeStyle), verticals_side.push(q[1])
        }

        function y(t) {
          var e = t + (2 * random() - 1.1) * bandwidth;
          return e > h || 0 > e ? y(t) : e
        }
        var canvas = this.$refs.band,
          ctx = canvas.getContext("2d"),
          pr = window.devicePixelRatio || 1,
          w = window.innerWidth,
          h = window.innerHeight,
          bandwidth = 90,
          q, r = 0,
          twoPi = 2 * Math.PI,
          cos = Math.cos,
          random = Math.random;
        canvas.width = w * pr, canvas.height = h * pr, ctx.scale(pr, pr), ctx.globalAlpha = .2;
        var verticals = [],
          verticals_side = [],
          fillStyles = [],
          firstTime = !0;
        requestAnimationFrame(i)
      },
      loadUserInfo() {
        let userInfo = localStorage.getItem('userInfo');
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
          s: '/addon/GoodVoice/GoodVoice/examSafeLogin'
        }
        if (this.sport.userName == '' || this.sport.cardNo == '' || this.sport.dpt[0] == '') {
          return;
        }
        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          let obj = res.data;
          // 卡号或部门输入错误
          if (obj.id == 0) {
            return;
          }
          //校验姓氏
          if (obj.first_name.trim() != params.user_name.substr(0, 1)) {
            return;
          }

          this.sport.uid = obj.id;
          this.sport.curScore = obj.score;
          if (parseInt(obj.answer_times) > this.sport.maxTimes) {
            this.toast.show = true;
            this.toast.msg = '答题次数用完';
            this.haveAnswerTimes = false;
            this.jump('info');
          } else {
            // 登录成功
            this.sport.isLogin = true;
            this.sport.curTimes = parseInt(obj.answer_times) + 1;
            this.showLoginfo = true;
          }

        });
      }
    },
    mounted() {
      this.animateCanvas();
      this.loadUserInfo();
      document.title = this.sport.name + '微信答题';
    }
  }

</script>
<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
    background-color: #1d1d2b;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 13pt;
    color: #fff;
    width: 100%;
    justify-content: center;
    .title {
      font-size: 22pt;
      text-align: center;
    }
    .btn-wrapper {
      width: 80%;
      font-size: 10pt;
      p {
        padding-bottom: 10px;
      }
    }
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .weui-btn_default {
    background: transparent;
    color: #fafafa;
  }

  .weui-btn:after {
    border-color: rgba(255, 255, 255, 0.5);
  }

  .slogan {
    padding-top: 15px;
    color: #fafafa;
  }

</style>
