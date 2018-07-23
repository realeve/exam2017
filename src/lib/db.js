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
export const addCbpcSportMain = async params => await axios({
    url: '/9/1a4beb4ff2.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 更新答题数据 } 
    const { answer_times, score, error_detail, rec_time, start_time, answer_nums, time_length, uid, sid } = params;
*/
export const setCbpcSportMain = async params => await axios({
    url: '/10/329cebc7da.json',
    params,
}).then(res => res);

/**
*   @database: { 微信开发 }
*   @desc:     { 分数过低时仅更新答题次数 } 
    const { answer_times, rec_time, start_time, answer_nums, time_length, uid, sid } = params;
*/
export const setCbpcSportMainByTimes = async params => await axios({
    url: '/11/5ef8fa675c.json',
    params,
}).then(res => res);