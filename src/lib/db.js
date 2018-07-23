import {
    axios
} from './axios';

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