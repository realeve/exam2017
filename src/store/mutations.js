// 同步事件

let mutations = {
    updateLoadingStatus(state, payload) {
        state.isLoading = payload.isLoading
    },
    setUserinfo(state, val) {
        state.userInfo = val;
    },
    setTips(state, val) {
        state.tips = val;
    },
    setSport(state, val) {
        Object.assign(state.sport, val);
    },
    setPaperInit(state, val) {
        state.paperInit = val;
    },
    setPeopleCount(state, val) {
        state.peopleCount = val;
    },
    setBrowser(state, val) {
        state.isPC = val;
    }
}

export default mutations