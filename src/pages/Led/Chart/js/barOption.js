function init(barWidth = 20) {
    let axisColor = '#eee';
    let lineColor = '#17b8f0';
    let option = {
        grid: {
            left: '0',
            right: '0',
            bottom: '0',
            top: '0',
            containLabel: true
        },
        tooltip: {
            trigger: 'item'
        },
        yAxis: {
            type: 'category',
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: axisColor,
                    width: 2,
                }
            },
            data: []
        },
        xAxis: [{
            type: 'value',
            splitNumber: 4,
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: axisColor,
                    width: 1,
                }
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
            id: 'stack',
            type: 'bar',
            // stack: 'all',
            silent: true,
            barGap: '-100%',
            color: ['#153465'],
            barMaxWidth: 20,
            barWidth,
            data: []
        }, {
            id: 'bar',
            type: 'bar',
            // stack: 'all',
            hoverAnimation: false,
            color: [lineColor],
            barMaxWidth: 20,
            barWidth,
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'insideRight',
                    color: '#fff'
                }
            }
        }]
    };
    return option;
}

function initV(barWidth = 40) {
    let axisColor = '#eee';
    let lineColor = '#17b8f0';
    let option = {
        grid: {
            left: '0',
            right: '0',
            bottom: '0',
            top: '0',
            containLabel: true
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                show: true
            },
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: axisColor,
                    width: 2,
                }
            },
            data: []
        },
        yAxis: [{
            type: 'value',
            splitNumber: 4,
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: axisColor,
                    width: 1,
                }
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
            id: 'stack',
            type: 'bar',
            // stack: 'all',
            silent: true,
            barGap: '-100%',
            color: ['#153465'],
            barMaxWidth: 20,
            barWidth,
            data: []
        }, {
            id: 'bar',
            type: 'bar',
            // stack: 'all',
            hoverAnimation: false,
            color: [lineColor],
            barMaxWidth: 20,
            barWidth,
            data: [],
            label: {
                normal: {
                    show: true,
                    position: 'insideTop',
                    color: '#fff',
                    // formatter(params) {
                    //     let data = (params.data + '').split('').join('\n');
                    //     return data;
                    // }
                }
            }
        }]
    };
    return option;
}

let refresh = (srcData, nums) => {
    let Data = JSON.parse(JSON.stringify(srcData)).sort((a, b) => a.value - b.value);
    let xAxis = Data.map((item, i) => `${nums-i}.${item.name}(${item.user_dpt})`);
    let yAxis = Data.map(item => item.value);
    let timesArr = Data.map(item => item.iTimes);
    let stackData = yAxis.map(item => yAxis[yAxis.length - 1]);
    let option = {
        yAxis: {
            data: xAxis
        },
        series: [{
            id: 'bar',
            data: yAxis,
        }, {
            id: 'stack',
            data: stackData
        }],
        tooltip: {
            formatter(param) {
                let times = timesArr[param.dataIndex];
                return param.name + '<br>准确率:' + param.value + '%<br>练习次数：' + times + '次';
            }
        }
    };
    return option;
};

export default {
    init,
    initV,
    refresh
};