const state = {
  isLoading: false,
  userInfo: {

  },
  cdnUrl: 'http://cbpc540.applinzi.com/index.php',
  tips: '',
  sport: {
    name: '成本管理月',
    id: 16,
    uid: 0,
    userName: '',
    cardNo: '',
    dpt: ['办公室'],
    isLogin: false,
    curScore: 0, // 上次答题得分
    maxTimes: 2,
    curTimes: 0,
    // 最小抽奖得分
    minPrizeScore: 80,
    loadWXInfo:false
  },
  paperInit: false
}

export default state
