function randomsort (a, b) {
  return Math.random() > 0.5 ? -1 : 1
}

function getRandomArr (len) {
  let arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr.sort(randomsort)
}

// 乱序题目
function randomArr (arr) {
  let rdmArr = getRandomArr(arr.length)
  let newArr = []
  rdmArr.forEach((item,i) => {
    arr[item].questionId = rdmArr[i];
    newArr.push(arr[item])
  })
  return newArr
}

// 乱序题目和答案
function randomAnswer (questions) {
  return questions.map((question, i) => {
    // 将题目选项乱序.
    let rdmArr = getRandomArr(question.option.length)

    // 存储乱序后的选项数组
    let newArr = []
    rdmArr.forEach(item => {
      newArr.push(question.option[item])
    })

    let answer = question.answer
    // 如果答案有多个
    let newAnswer = []
    if (typeof answer == 'object') {
      newAnswer = answer.map(item => rdmArr[item])
    }else {
      // 重新排序后的新答案
      newAnswer = rdmArr[answer]
    }
    Object.assign(question, {
      option: newArr,
      answer: newAnswer
    })
    return question
  })
}

export default {randomArr,randomAnswer}
