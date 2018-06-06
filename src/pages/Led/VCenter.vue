<template>
  <div>
    <div v-if="!isPC" class="wrap-title">得分TOP 25</div>
    <div ref="chart" class="chart data-wrapper">
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import barOption from "./Chart/js/barOption.js";

import { mapState } from "vuex";

export default {
  data() {
    return {
      cityData: []
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport"]),
    isPC() {
      return this.$store.state.isPC;
    },
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
        s: "/addon/GoodVoice/GoodVoice/getRealScore",
        nums: 20,
        perscore: parseInt(100 / this.sport.questionNums),
        sportid: this.sport.id
      };
      this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => {
          this.chart.setOption(this.refresh(res.data));
        });
    },
    refresh(srcData) {
      let Data = JSON.parse(JSON.stringify(srcData)).sort(
        (a, b) => a.value - b.value
      );
      let xAxis = Data.map(
        (item, i) => `${Data.length - i}.${item.name}(${item.user_dpt})`
      );
      let yAxis = Data.map(item => item.value);
      let timesArr = Data.map(item => item.iTimes);
      let stackData = yAxis.map(item => yAxis[yAxis.length - 1]);
      let option = {
        yAxis: {
          data: xAxis
        },
        series: [
          {
            id: "bar",
            data: yAxis
          },
          {
            id: "stack",
            data: stackData
          }
        ],
        tooltip: {
          formatter(param) {
            let times = timesArr[param.dataIndex];
            return (
              param.name +
              "<br>得分:" +
              param.value +
              "分<br>练习次数：" +
              times +
              "次"
            );
          }
        }
      };
      return option;
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
