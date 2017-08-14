// 同步事件

let mutations = {
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading
    },
    setUserinfo(state, val) {
        state.userInfo = val;
    },
    setTips(state,val){
        state.tips = val;
    },
}

export default mutations