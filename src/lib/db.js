import { axios } from "./axios";

import state from "../store/state";

const FemaleSport = state.sport.id == 32;

// console.log(FemaleSport);

/**
 *   @database: { 微信开发 }
 *   @desc:     { 更新url阅读数 }
 */
export const addCommonVisitCount = async (url) =>
  await axios({
    url: "/5/4c908bffac.json",
    params: {
      url,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 部门列表 }
 */
export const getCbpcDeptList = async (sid) =>
  await axios({
    url: FemaleSport
      ? "/266/77f72268ae/array.json"
      : "/273/49aff5c500/array.json",
    params: {
      sid,
      cache: 7200,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 用户登录 } 
    const { sid, card_no, username,dept_name } = params;
*/
export const login = async (params) =>
  await axios({
    url: FemaleSport ? "/267/e7afd80fad" : "/274/6942e3f35e.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 用户登录(累计积分模式) } 
    const { sid, card_no, username, dept_name } = params;
*/
export const login2 = async (params) =>
  await axios({
    url: "/275/ad5e19128c.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 插入数据2020 } 
    const { uid, sid, answer_times, score, error_detail, start_time, answer_nums, time_length } = params;
*/
export const addCbpcSportMain = (params) =>
  axios({
    url: "/276/eff6e8846f.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 更新答题数据2020 } 
    const { answer_times, score, error_detail, start_time, answer_nums, time_length, uid, sid } = params;
*/
export const setCbpcSportMain = (params) =>
  axios({
    url: "/277/f31bc3be02.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 分数过低时仅更新答题次数 } 
    const { answer_times, start_time, answer_nums, time_length, uid, sid } = params;
*/
export const setCbpcSportMainByTimes = (params) =>
  axios({
    url: "/278/62c3b88570.json",
    params,
  });

export const submitPaper = async (params, sport) => {
  // 首次提交
  let isFirstSubmit =
    params.answer_times == 1 &&
    (params.answer_nums == 1 || params.answer_nums == sport.questionNums);
  // 安全履职能力评价，采用练习模式，每次都需提交数据
  if (sport.alwaysRecordScore || isFirstSubmit) {
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
};

/**
*   @database: { 微信开发 }
*   @desc:     { 用户得分查询 } 
    const { uid, sid } = params;
*/
export const getCbpcSportMain = async (params) =>
  await axios({
    url: "/279/8f9d4e2cd6.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 用户得分查询(累积模式) } 
    const { uid, sid } = params;
*/
export const getCbpcSportMain2 = async (params) =>
  await axios({
    url: "/280/dada6c94fb.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 根据Uid更新微信身份信息 } 
    const { nickname, headimgurl, sex, openid, uid } = params;
*/
export const setCbpcUserList = async (params) =>
  await axios({
    url: "/281/211b647d9e.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 插入用户中奖信息 } 
    const { uid, sid1, sid2, sid3, sid4, _uid, _sid } = params;
*/
export const addCbpcSportLuckyusers = async (params) =>
  await axios({
    url: "/13/8104a44841.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 活动抽奖结果 } 
    const { uid, sid } = params;
*/
export const getCbpcSportLuckyusers = async (params) =>
  await axios({
    url: "/14/6e1496fa23.json",
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 清空答题数据 }
 */
export const delCbpcSportMain = async (sid) =>
  await axios({
    url: "/282/61f51aed8c.json",
    params: {
      sid,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 各部门得分及参与率 }
 */
export const getCbpcSportMainByDept = async (sid) =>
  await axios({
    url: "/283/1058e38090.json",
    params: {
      sid,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 各部门得分汇总 }
 */
export const getCbpcSportMainByDept2 = (sid) =>
  axios({
    url: "/293/42eff6ef46.json",
    params: {
      sid,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 用户得分排名 }
 */
export const getCbpcSportMainByUser = async (params) =>
  await axios({
    url: "/284/1899350f92.json",
    params,
  }).then((res) => {
    res.data = res.data.map((item) => {
      let total_time = item.total_time.split(":");
      let str = `总时长:${total_time[0]}时${total_time[1]}分`;
      item.total_time = str;
      return item;
    });
    return res;
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 活动参与人数及中奖人数 }
 */
export const getCbpcSportLuckyusersNum = async (sid) =>
  await axios({
    url: "/19/55b787922f.json",
    params: {
      sid,
    },
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 活动奖品数据设置 }
 */
export const getCbpcPrize = async (sid) =>
  await axios({
    url: "/20/b6d2d07d6e.json",
    params: {
      sid,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 更新奖品设置 } 
    const { prize_name, prize_num, people_num, sid } = params;
*/
export const setCbpcPrize = async (params) =>
  await axios({
    url: "/21/e9d9991bad.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 用户登录信息查询 } 
    const { card_no, user_name } = params;
*/
export const getViewCbpcUserList = async (params) =>
  await axios({
    url: "/285/1cde57c9b9.json",
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 部门列表 }
 */
export const getCbpcDepts = async (sid) =>
  await axios({
    url: "/42/a7290ee4fd.json",
    params: {
      sid,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 卡号改部门 } 
    const { dept_id, card_no } = params;

    dept_name,card_no

*/
export const updateDeptInfo = async (params) =>
  await axios({
    // url: "/43/0265840c3d.json",
    url: "/286/15e547a866.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 姓名及部门改卡号 } 
    const { card_no, username, dept_id } = params;
*/
export const updateCardInfo = async (params) =>
  await axios({
    // url: "/44/ebe393408a.json",
    url: "/287/d46168c157.json",
    params,
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 新增用户 } 
    const { username, cardno, deptname } = params;
*/
export const addCbpcUserList = (params) =>
  axios({
    url: "/288/a8ca91e358.json",
    params,
  });

/**
*   @database: { 会议管理 }
*   @desc:     {  根据用户数对各部门抽奖 } 
    const { sid, dpt, limit } = params;
*/
export const getViewCbpcSportScoreList = async (params) =>
  await axios({
    url: "/71/3fd15fe0c1.json",
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 微信答题活动参与总人数 }
 */
export const getCbpcSportTotalPeople = async (sid) =>
  await axios({
    url: "/289/1bd104632c.json",
    params: {
      sid,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 用户得分排名(最高得分模式) } 
    const { sid, limit } = params;
*/
export const getCbpcSportMainByMaxScore = async (params) =>
  await axios({
    url: FemaleSport ? "/268/dad8f0eb21.json" : "/290/df1276a184.json",
    params,
  });

/**
 *   @database: { 微信开发 }
 *   @desc:     { 各部门平均最高得分排名 }
 */
export const getCbpcSportDeptByMaxScore = async (sid) =>
  await axios({
    url: "/291/c25f867c71.json",
    params: {
      sid,
    },
  });

/**
*   @database: { 微信开发 }
*   @desc:     { 我的错集 } 
    const { sid, uid } = params;
*/
export const getErrList = async (params) =>
  await axios({
    url: "/292/c8838e5fb6/array.json",
    params,
  });
/**
 *   @database: { 微信开发 }
 *   @desc:     { 读取活动设置 }
 */
export const getCbpcSportListCfg = (sid) =>
  axios({
    url: "/294/5c6b096e3c.json",
    params: {
      sid,
    },
  }).then((res) => res.data[0] || {});

/**
*   @database: { 微信开发 }
*   @desc:     { 个人得分排名 } 
    const { sid, sid2, uid } = params;
*/
export const getCbpcSport2020Level = (uid) =>
  axios({
    url: "/297/2df50df059.json",
    params: {
      sid: state.sport.id,
      sid2: state.sport.id,
      sid3: state.sport.id,
      uid,
      uid2: uid,
    },
  });
