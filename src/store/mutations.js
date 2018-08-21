// 使用typeof，则 null、对象、数组返回的都是object
let getType = o =>
    Object.prototype.toString
    .call(o)
    .match(/\w+/g)[1]
    .toLowerCase();

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
    },
    setStore(state, payload) {
        Object.keys(payload).forEach(key => {
            let val = payload[key];
            // console.log(key, val);
            if (getType(val) == 'object') {
                state[key] = Object.assign({}, state[key], val);
            }
            state[key] = val;
        })
    }
}

export default mutations