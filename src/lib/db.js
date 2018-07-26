import {
    axios
} from './axios';

/**
 *   @database: { 微信开发 }
 *   @desc:     { 更新url阅读数 } 
 */
export const addCommonVisitCount = async url => await axios({
    url: '/5/4c908bffac.json',
    params: {
        url
    },
}).then(res => res);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 部门列表 } 
 */
export const getCbpcDeptList = async sid => await axios({
    url: '/7/809d780efa/array.json',
    params: {
        sid,
        cache: 7200
    },
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 用户登录 } 
    const { sid, card_no, username } = params;
*/
export const login = async params => await axios({
    url: '/8/230cba0823.json',
    params,
}).then(res => res);


/**
*   @database: { 微信开发 }
*   @desc:     { 插入数据 } 
    const { uid, sid, answer_times, score, error_detail, rec_time, start_time, answer_nums, time_length } = params;
*/
const addCbpcSportMain = async params => await axios({
    url: '/9/1a4beb4ff2.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 更新答题数据 } 
    const { answer_times, score, error_detail, rec_time, start_time, answer_nums, time_length, uid, sid } = params;
*/
const setCbpcSportMain = async params => await axios({
    url: '/10/329cebc7da.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 分数过低时仅更新答题次数 } 
    const { answer_times, rec_time, start_time, answer_nums, time_length, uid, sid } = params;
*/
const setCbpcSportMainByTimes = async params => await axios({
    url: '/11/5ef8fa675c.json',
    params,
}).then(res => res);

export const submitPaper = async(params, sport) => {
    // 首次提交
    let isFirstSubmit = params.answer_times == 1 && (params.answer_nums == 1 || params.answer_nums == sport.questionNums)
    if (isFirstSubmit) {
        return await addCbpcSportMain(params);
    }
    // 得分更高时或在线答题模式，全部更新
    if (params.score > sport.curScore || sport.isOnline) {
        return await setCbpcSportMain(params);
    } else if (params.score == sport.curScore) {
        // 得分相同时，更新时间
        params.time_length = Math.min(sport.curTimeLength, params.time_length);
        return await setCbpcSportMain(params);
    }

    // 得分低于上一次，仅更新时间
    return await setCbpcSportMainByTimes(params);
}

/**
*   @database: { 微信开发 }
*   @desc:     { 用户得分查询 } 
    const { uid, sid } = params;
*/
export const getCbpcSportMain = async params => await axios({
    url: '/12/e71eb4f0a1.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 根据Uid更新微信身份信息 } 
    const { nickname, headimgurl, sex, openid, uid } = params;
*/
export const setCbpcUserList = async params => await axios({
    url: '/15/791c1677d6.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 插入用户中奖信息 } 
    const { uid, sid1, sid2, sid3, sid4, _uid, _sid } = params;
*/
export const addCbpcSportLuckyusers = async params => await axios({
    url: '/13/8104a44841.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 活动抽奖结果 } 
    const { uid, sid } = params;
*/
export const getCbpcSportLuckyusers = async params => await axios({
    url: '/14/6e1496fa23.json',
    params,
}).then(res => res);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 清空答题数据 } 
 */
export const delCbpcSportMain = async sid => await axios({
    url: '/16/37584eabca.json',
    params: {
        sid
    },
}).then(res => res);


/**
 *   @database: { 微信开发 }
 *   @desc:     { 各部门得分及参与率 } 
 */
export const getCbpcSportMainByDept = async sid => await axios({
    url: '/17/64c0c27545.json',
    params: {
        sid
    },
}).then(res => res);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 用户得分排名 } 
 */
export const getCbpcSportMainByUser = async sid => await axios({
    url: '/18/a13ae161c1.json',
    params: {
        sid
    },
}).then(res => res);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 活动参与人数及中奖人数 } 
 */
export const getCbpcSportLuckyusersNum = async sid => await axios({
    url: '/19/55b787922f.json',
    params: {
        sid
    },
}).then(res => res);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 活动奖品数据设置 } 
 */
export const getCbpcPrize = async sid => await axios({
    url: '/20/b6d2d07d6e.json',
    params: {
        sid
    },
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 更新奖品设置 } 
    const { prize_name, prize_num, people_num, sid } = params;
*/
export const setCbpcPrize = async params => await axios({
    url: '/21/e9d9991bad.json',
    params,
}).then(res => res);