let isMobile = () => {
    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        navigator.userAgent.match(/MicroMessenger/i)
    ) {
        return true;
    } else {
        return false;
    }
};

const state = {
    isLoading: false,
    userInfo: {},
    wxUrl: '//api.cbpc.ltd/',
    tips: "",
    sport: {
        id: 23,
        name: "安全履职能力评价微信有奖答题",
        orgname: "成都印钞有限公司", // 机构名
        slogan: "生产至上 安全发展", // 口号
        questionNums: 30, // 抽题数量
        perScore: 1, // 每题得分
        useDept: true,
        isOnline: false, //实际活动
        showDocument: false,
        loadWXInfo: true, // 抽奖活动将载入用户个人信息
        doLottery: false, // 是否参与抽奖
        uid: 0,
        userName: "",
        cardNo: "",
        dpt: ["印钞管理部"],
        isLogin: false,
        curScore: 0, // 上次答题得分
        maxTimes: 100000,
        curTimes: 0,
        curTimeLength: 0, //当前答题时间
        // 最小抽奖得分
        minPrizeScore: 80,
        testMode: false,
        startDate: "2018-08-23",
        endDate: "2018-10-23",
        // 得分是否累加
        stackMode: false,
        // 记录每次答题得分
        alwaysRecordScore: true
    },
    paperInit: false,
    peopleCount: 0,
    isPC: !isMobile(),
    refreshInterval: 5 * 1000,
    error_detail: []
};

// 按题目数量总分100分
state.sport.perScore = parseInt(100 / state.sport.questionNums);

export default state;