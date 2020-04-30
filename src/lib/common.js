import * as R from "ramda";

import questionJSON from "../assets/data/paper.js";

// 安保测试 2020年
const isSafeTest2020 = true;

function randomsort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

function getRandomArr(len) {
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr.sort(randomsort);
}

// 乱序题目
function randomArr(arr) {
  let rdmArr = getRandomArr(arr.length);
  let newQuestions = [];
  rdmArr.forEach((item, i) => {
    // arr[item].questionId = rdmArr[i];
    newQuestions.push(arr[item]);
  });
  return newQuestions;
}

// 乱序题目和答案
function randomAnswer(questions) {
  return R.clone(questions).map((question, i) => {
    // 判断不随机
    if (question.option.length == 2) {
      return question;
    }
    // 将题目选项乱序.
    let rdmArr = getRandomArr(question.option.length);

    // 存储乱序后的选项数组
    let newQuestions = [];
    rdmArr.forEach((item) => {
      newQuestions.push(question.option[item]);
    });

    let answer = question.answer;
    // 如果答案有多个
    let newAnswer = [];
    if (answer.length > 1) {
      answer.forEach((rightAnswer, i) =>
        rdmArr.forEach((item, i) => {
          if (item == rightAnswer) {
            newAnswer.push(i);
          }
        })
      );
    } else {
      // 重新排序后的新答案
      rdmArr.forEach((item, i) => {
        if (item == answer) {
          newAnswer.push(i);
        }
      });
    }
    newAnswer.sort((a, b) => a - b);
    Object.assign(question, {
      option: newQuestions,
      answer: newAnswer,
    });
    return question;
  });
}

function getPaperData(_json, { randAnswer, randomQuestion }) {
  let isPioneer = window.localStorage.getItem("pioneer") == "1";
  let json = R.clone(_json);

  let config = {
    single: [0, 150],
    multiple: [150, 200],
    judge: [200, 290],
  };
  let result = {
    judge: 10,
    single: 40,
    multiple: 10,
  };

  if (json.length == 0) {
    return json;
  }
  let questions = R.clone(json);

  if (!isSafeTest2020) {
    randomQuestion ? randomArr(json) : json;
  }

  questions = questions.map((item, idx) => {
    item.score = item.score || 1;
    item.questionId = idx;
    if (item.answer.length > 1) {
      item.title = "【多选题】" + item.title;
    } else if (item.option.length == 1) {
      item.title = "【填空题】" + item.title;
      //填空题仅学习，不计分
      item.score = 0;
    } else if (item.option.length == 2) {
      item.title = "【判断题】" + item.title;
    } else if (item.option.length > 2 && item.answer.length == 1) {
      item.title = "【单选题】" + item.title;
    }
    return item;
  });
  // 用户可选择是否随机选项
  let randomQuestions = questions;

  if (!isSafeTest2020) {
    randomQuestions = !randAnswer ? questions : randomAnswer(questions);
  }

  var alphaArr = ["A", "B", "C", "D", "E", "F", "G"];

  if (typeof randomQuestions[0].option[0] != "string") {
    return randomQuestions.map((item) => {
      item.option = item.option.map((value, key) => {
        return {
          key,
          value: alphaArr[key] + "、" + value,
        };
      });
      return item;
    });
  }

  if (!isSafeTest2020) {
    return randomQuestions.map((item) => {
      item.option = item.option.map((value, key) => {
        return {
          key,
          value: alphaArr[key] + "、" + value,
        };
      });
      return item;
    });
  }

  if (questionJSON.length !== randomQuestions.length) {
    return randomQuestions;
  }

  let judge = randomQuestions.slice(config.judge[0], config.judge[1]);
  let singleChoice = randomQuestions.slice(config.single[0], config.single[1]);
  let multiple = randomQuestions.slice(config.multiple[0], config.multiple[1]);

  singleChoice = randomArr(singleChoice);
  multiple = randomArr(multiple);
  judge = randomArr(judge);

  judge = judge.slice(0, result.judge);
  singleChoice = singleChoice.slice(0, result.single);
  multiple = multiple.slice(0, result.multiple);

  let res = R.clone([...judge, ...singleChoice, ...multiple]);

  let dist = randomAnswer(res).map((item) => {
    item.option = item.option.map((value, key) => {
      return {
        key,
        value: alphaArr[key] + "、" + value,
      };
    });
    return item;
  });
  console.log(isPioneer, dist);
  if (!isPioneer) {
    return dist;
  }

  let dist2 = getPaperData2(questions, { randAnswer, randomQuestion });

  return [...dist, ...dist2];
}

function getPaperData2(json) {
  let config = {
    single: [290, 320],
    multiple: [320, 340],
    judge: [340, 359],
  };
  let result = {
    judge: 5,
    single: 10,
    multiple: 5,
  };

  // 用户可选择是否随机选项
  let randomQuestions = R.clone(json);

  var alphaArr = ["A", "B", "C", "D", "E", "F", "G"];

  let judge = randomQuestions.slice(config.judge[0], config.judge[1]);
  let singleChoice = randomQuestions.slice(config.single[0], config.single[1]);
  let multiple = randomQuestions.slice(config.multiple[0], config.multiple[1]);

  singleChoice = randomArr(singleChoice);
  multiple = randomArr(multiple);
  judge = randomArr(judge);

  judge = judge.slice(0, result.judge);
  singleChoice = singleChoice.slice(0, result.single);
  multiple = multiple.slice(0, result.multiple);

  let res = R.clone([...judge, ...singleChoice, ...multiple]);

  return randomAnswer(res).map((item) => {
    item.option = item.option.map((value, key) => {
      return {
        key,
        value: alphaArr[key] + "、" + value,
      };
    });
    return item;
  });
}

export default {
  getRandomArr,
  randomArr,
  randomAnswer,
  getPaperData,
  getPaperData2,
};

var handler = (a) => {
  var b = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6 };

  JSON.stringify(
    a.map((item) => {
      item.answer = item.answer
        .trim()
        .split("")
        .map((answer) => b[answer]);
      return item;
    })
  );
};
