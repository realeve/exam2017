const state = {
  isLoading: false,
  userInfo: {

  },
  cdnUrl: 'http://cbpc540.applinzi.com/index.php',
  tips: '',
  sport: {
    id: 17,
    name: '质量月',
    slogan:'大力提升质量 建设质量强国',
    timeRange:'9月12日至24日',
    questionNums:20,
    
    uid: 0,
    userName: '',
    cardNo: '',
    dpt: ['技术质量部'],
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
