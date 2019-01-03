const { getList, downloadVideo } = require('../../utils/index')
const chalk = require('chalk')
const inquirer = require('inquirer')
const spin = require('io-spin')
const spinner = spin('loading...')

let page = 1
let data = []

const reg = /\d+/

const questions = [
  {
    type: 'input',
    name: 'start',
    message: '1. 输入开始的视频编号(包含)(倒序):'
  },
  {
    type: 'input',
    name: 'end',
    message: '2. 输入结束的视频编号(不包含)(倒序):'
  }
]



async function init (){
  const answers  = await inquirer.prompt(questions)
  let isTrue = true
  while(isTrue){
    let res = await getList(page)
    res.data.forEach(item => {
      if(item.title.match(reg)[0] > answers.end){
        data.push(item)
      }else{
        isTrue = false
      }
    })
    page ++
  }
  spinner.start()
  Promise.all(data.map(item => {
    return downloadVideo({
      url: item.url,
      title: item.title
    })
  })).then(res => {
    spinner.stop()
    console.log(`${chalk.green('下载完成...')}`)
  })
}



init()




