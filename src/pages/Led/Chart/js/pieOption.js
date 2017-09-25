function init(Data) {
    let center = ['50%', '55%'];
    let maxCircleRadius = 120;
    let series = {
        type: 'pie',
        center,
        hoverAnimation: false, //鼠标移入变大
        radius: [40, 70],
        data: Data.map(item => {
            return {
                value: item.nums,
                name: item.dpt
            }
        })
    }

    let option = {
        color: [
            "#61A5E8",
            "#7ECF51",
            "#EECB5F",
            "#E4925D",
            "#E16757",
            "#9570E5",
            "#605FF0",
            "#85ca36",
            "#1c9925",
            "#0d8b5f",
            "#0f9cd3",
            "#2f7e9b",
            "#2f677d",
            "#9b7fed",
            "#7453d6",
            "#3b1d98",
            "#27abb1",
            "#017377",
            "#015f63",
            "#b86868",
            "#5669b7",
            "#e5aab4",
            "#60b65f",
            "#98d2b2",
            "#c9c8bc",
            "#45c3dc",
            "#e17979",
            "#5baa5a",
            "#eaccc2",
            "#ffaa74"
        ], //['rgb(150, 112, 227)'],
        series,
        tooltip: {}
    };

    return option;
}

let refresh = () => {
    return init();
};

export default { init, refresh };