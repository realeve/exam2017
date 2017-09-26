<template>
  <div>
    <div v-if="!isPC" class="wrap-title">各小组参与情况</div>

    <div ref="chart1" class="chart data-wrapper">
    </div>
    <div class="wrap-title">各小组得分</div>
    <div ref="chart2" class="chart data-wrapper" :class="{chartmobile:!isPC}">
    </div>
    <div class="wrap-title">答题速度</div>
    <div ref="chart3" class="chart data-wrapper" :class="{chartmobile:!isPC}">
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import barOption from './Chart/js/barOption.js';
import pieOption from './Chart/js/pieOption.js';

import {
  mapState
} from 'vuex'


export default {
  data() {
    return {
      cityData: []
    }
  },
  computed: {
    ...mapState(['cdnUrl', 'sport']),
    isPC() {
      return this.$store.state.isPC;
    },
    chart1() {
      return echarts.init(this.$refs.chart1);
    },
    chart2() {
      return echarts.init(this.$refs.chart2);
    },
    chart3() {
      return echarts.init(this.$refs.chart3);
    }
  },
  methods: {
    resizeChart() {
      this.chart.resize();
    },
    initEvent() {
      window.onresize = () => {
        this.initChart();
      }
      setInterval(() => {
        this.refreshChart1();
        this.refreshChart2();
        this.refreshChart3();
      }, this.$store.state.refreshInterval);
    },
    initChart() {
      if (this.isPC) {
        this.chart2.setOption(barOption.initV());
        this.chart3.setOption(barOption.initV());
      } else {
        this.chart2.setOption(barOption.init());
        this.chart3.setOption(barOption.init());
      }
    },
    refreshChart1() {
      let url = 'http://cbpc540.applinzi.com/index.php';
      let params = {
        s: '/addon/GoodVoice/GoodVoice/getAnsweredNums',
        sportid: this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.chart1.setOption(pieOption.init(res.data));
        let sum = 0;
        res.data.map(item => {
          sum += parseInt(item.nums)
        })
        this.$store.commit('setPeopleCount', sum);
      })
    },
    refreshChart2() {
      let url = 'http://cbpc540.applinzi.com/index.php';
      let params = {
        s: '/addon/GoodVoice/GoodVoice/getScoreByGroup',
        sportid: this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.chart2.setOption(this.refresh2(res.data));
      })
    },
    refresh2(srcData) {
      let Data = JSON.parse(JSON.stringify(srcData)).sort((a, b) => a.score - b.score);
      let xAxis = Data.map((item, i) => {
        if(item.dpt.length>=4){
          return item.dpt.substr(0,2)+'\n'+item.dpt.substr(2,2)
        }
        return item.dpt;
      });
      let yAxis = Data.map(item => item.score);
      let stackData = yAxis.map(item => yAxis[yAxis.length - 1]);
      let option = {
        xAxis: {
          data: xAxis.reverse()
        },
        series: [{
          id: 'bar',
          data: yAxis.reverse(),
        }, {
          id: 'stack',
          data: stackData.reverse()
        }],
        tooltip: {}
      };
      if (!this.isPC) {
        option = {
          yAxis: {
            data: xAxis.reverse()
          },
          series: [{
            id: 'bar',
            data: yAxis.reverse(),
          }, {
            id: 'stack',
            data: stackData.reverse()
          }],
          tooltip: {}
        };
      }

      return option;
    },
    refreshChart3() {
      let url = 'http://cbpc540.applinzi.com/index.php';
      let params = {
        s: '/addon/GoodVoice/GoodVoice/getAnswerSpeed',
        sportid: this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.chart3.setOption(this.refresh3(res.data));
      })
    },
    refresh3(srcData) {
      let Data = JSON.parse(JSON.stringify(srcData)).sort((a, b) => parseInt(a.num) - parseInt(b.num));
      let xAxis = Data.map((item, i) => `${item.user_name}`);
      let yAxis = Data.map(item => item.num);
      let stackData = yAxis.map(item => yAxis[yAxis.length - 1]);
      let option = {
        xAxis: {
          data: xAxis.reverse()
        },
        series: [{
          id: 'bar',
          data: yAxis.reverse(),
        }, {
          id: 'stack',
          data: stackData.reverse()
        }],
        tooltip: {}
      };
      if (!this.isPC) {
        option = {
          yAxis: {
            data: xAxis.reverse()
          },
          series: [{
            id: 'bar',
            data: yAxis.reverse(),
          }, {
            id: 'stack',
            data: stackData.reverse()
          }],
          tooltip: {}
        };
      }
      return option;
    },
    init() {
      this.initChart();
      this.refreshChart1();
      this.refreshChart2();
      this.refreshChart3();
      this.initEvent();
    }
  },
  mounted() {
    this.init();
  }
}

</script>

<style scoped lang="less">
.chart {
  min-height: 26vh;
  width: 100%;
}

.chartmobile {
  min-height: 50vh;
  padding-right:10px;
}

.wrap-title {
  margin-top: 5px;
  margin-bottom: 5px;
  color: rgb(255, 204, 0);
  font-size: 12pt
}
</style>
