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
    timeRange:'9月14日至24日',
    questionNums:20,

    doLottery:true, // 有抽奖活动
    loadWXInfo:true, // 抽奖活动将载入用户个人信息
    
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
  },
  paperInit: false
}

export default state
