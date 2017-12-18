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
    cdnUrl: "http://cbpc540.applinzi.com/index.php",
    tips: "",
    sport: {
        id: 19,
        name: "十九大知识理论学习",
        orgname: "西安印钞有限公司凹印党支部", // 机构名
        slogan: "不忘初心 牢记使命", // 口号
        timeRange: "12月", // 活动时间
        questionNums: 50, // 抽题数量
        useDept: true,
        isOnline: true, //实际活动
        showDocument: true,
        loadWXInfo: true, // 抽奖活动将载入用户个人信息
        doLottery: false, // 是否参与抽奖
        uid: 0,
        userName: "",
        cardNo: "",
        dpt: ["西钞凹印党支部"],
        isLogin: false,
        curScore: 0, // 上次答题得分
        maxTimes: 20000,
        curTimes: 0,
        // 最小抽奖得分
        minPrizeScore: 80,
        testMode: false
    },
    paperInit: false,
    peopleCount: 0,
    isPC: !isMobile(),
    refreshInterval: 5 * 1000
};

export default state;