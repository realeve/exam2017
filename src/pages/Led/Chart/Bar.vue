<template>
  <div>
    <div class="wrap-title">准确率TOP 25</div>
    <div ref="chart" class="chart data-wrapper">
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import barOption from "./js/baroption.js";

import { mapState } from "vuex";

export default {
  data() {
    return {
      cityData: []
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport"]),
    chart() {
      return echarts.init(this.$refs.chart);
    }
  },
  methods: {
    resizeChart() {
      this.chart.resize();
    },
    initEvent() {
      window.onresize = () => {
        this.initChart();
      };
      setInterval(() => {
        this.refreshChart();
      }, this.$store.state.refreshInterval);
    },
    initChart() {
      this.chart.setOption(barOption.init());
    },
    refreshChart() {
      // let url = 'http://cbpc540.applinzi.com/index.php';
      let params = {
        s: "/addon/GoodVoice/GoodVoice/getRealScoreRate",
        nums: 25,
        perscore: parseInt(100 / this.sport.questionNums),
        sportid: this.sport.id
      };
      this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => {
          this.chart.setOption(barOption.refresh(res.data));
        });
    },
    init() {
      this.initChart();
      this.refreshChart();
      this.initEvent();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.chart {
  min-height: 80vh;
  width: 100%;
}

.wrap-title {
  margin-bottom: 5px;
  color: rgb(255, 204, 0);
  font-size: 15pt;
}
</style>
