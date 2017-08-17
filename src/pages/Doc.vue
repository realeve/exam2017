<template>
  <div class="wrapper">
    <div class="content">
      <div>
        <p class="title">成都印钞有限公司成本管理体系</p>
        <p class="subtitle">成本理念</p>
        <article>
          <p>本公司的成本理念为“优化成本，创造价值”。</p>
          <p>公司成本管理工作以“全员、全过程、全要素”为方针，把责任分解落实到每个员工，贯穿到生产经营每一环节，面向生产经营每个要素，全面细致、深入持续进行系统优化。</p>
          <p>公司对形成产品核心价值和企业核心竞争能力的成本予以充分保证，严格控制低效成本，消除无效成本，实现成本总体水平先进、内在结构科学合理，提高资源利用效率，提升企业长期盈利能力和发展能力，为利益相关者带来最大价值。</p>
        </article>
        <p class="subtitle">成本战略</p>
        <article>公司实施成本领先战略。公司通过设计和实施一系列行动，以最低的生产成本提供为人民银行及社会公众所接受的产品和服务，成为印钞造币行业的成本领先者。</article>
      </div>

      <div>
        <p class="title">中国印钞造币总公司“十三五”成本管理工作指导意见</p>
        <p class="subtitle">指导思想</p>
        <article>
          坚持“优质安全保发行、科学高效谋发展”的行业宗旨，适应行业“十三五”转型发展的新形势，引入战略成本管理，以“价值创造”为核心，解放思想、转变观念、拓展领域、创新方法，对生产经营的全过程进行持续优化，科学配置资源要素，不断提高行业经济效益，促进行业可持续发展。
        </article>
        <p class="subtitle">基本原则</p>
        <article>战略性原则、全面性原则、系统性原则、责权利相结合原则。</article>
        <p class="subtitle">主要措施和工作要求</p>
        <article>
          <p>1.完善体系，进一步加强运营成本管理</p>
          <p>2.突出重点，积极推行战略成本管理</p>
          <p>3.加大激励，构建科学合理的考核机制</p>
        </article>
      </div>


      <div>
        <p class="title">成钞公司“十三五”成本管理工作实施意见</p>
        <p class="subtitle">指导思想</p>
        <article>
          坚持“优质安全保发行、科学高效谋发展”的行业宗旨，坚持“优化成本、创造价值”的公司成本管理理念，以“价值创造”为核心，引入战略成本管理，树立“大成本”观念，创新成本管理方法，拓展成本管理领域。通过价值产业链的过程管控，以“对标管理”及“投入产出”为评价，关注隐形成本及资源的科学配置，不断提高公司的经济效益。
        </article>
        <p class="subtitle">主要措施</p>
        <article>
          <p>1.建立并完善成本费用责任中心体系</p>
          <p>2.积极推行价值链成本管理，优化投入产出比，合理控制成本</p>
          <p>3.科学合理构建成本考核机制，充分发挥绩效考评对成本管理工作的促进作用</p>
        </article>
      </div>

      <div class="btn margin-top-60">
        <x-button @click.native="jump('paper')">开始答题</x-button>
        <x-button @click.native="jump('/')">返回首页</x-button>
      </div>

    </div>
    <canvas ref="band"></canvas>
    <v-foot/>
  </div>
</template>
<style lang="less" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    font-weight: lighter;
  }

  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 13pt;
    color: #444;
    width: 100%;
    justify-content: center;
    text-align: left;
    padding: 10px;
    .title {
      padding-top: 30px;
      font-size: 16pt;
      text-align: center;
      font-weight: bold;
    }
    article {
      text-indent: 2em;
      line-height: 23pt;
      p {
        line-height: 23pt;
      }
    }
    .subtitle {
      font-size: 15pt;
      padding-top: 20px;
      width: 100%;
    }
    .btn {
      width: 80%;
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

  .title {
    line-height: 30pt;
    border-bottom: solid 1px rgba(0, 0, 0, 0.5);
  }

</style>

<script>
  import {
    XButton
  } from 'vux'

  export default {
    components: {
      XButton
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
      }
    },
    mounted() {
      this.animateCanvas();
      document.title = '知识学习';
    }
  }

</script>
