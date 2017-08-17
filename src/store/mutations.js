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
    setSport(state,val){
        Object.assign(state.sport,val);
    },
    setPaperInit(state,val){
        state.paperInit = val;
    }
}

export default mutations