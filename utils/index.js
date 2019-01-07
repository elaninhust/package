const path = require('path')
const fetch = require('node-fetch')
const fs = require('fs')
const request = require('request');
const spin = require('io-spin')
const chalk = require('chalk')

const getApiUrl =  function(page){
  return `https://m.weibo.cn/api/container/getIndex?containerid=2304132948117283_-_WEIBO_SECOND_PROFILE_WEIBO&page_type=01&page=${page}`
}

/**
 * 获取视频
 * @param {page} page 
 * @param {number} number 
 */
const getList = function(page = 1){
  return new Promise(async (resolve, reject) => {
    let result = []
    let num = 0
    const spinner = spin('Fetching data')
    spinner.start()
    let { data } = await fetch(getApiUrl(page)).then(res => res.json())
    spinner.stop()
    if(data.cards.length > 0){
      data.cards.forEach(ele => {
        if(ele.card_type === 9 && ele.mblog !== undefined && ele.mblog.page_info !== undefined &&  ele.mblog.page_info.type === "video" && /\[第(\d)+次\]/.test(ele.mblog.page_info.media_info.next_title)){
          let title = ele.mblog.page_info.media_info.next_title.match(/第(\d)+次/)[0]
          let url = ele.mblog.page_info.media_info.mp4_720p_mp4
          result.push({
            title: title,
            url: url
          })
          num ++
        }
      })
    }
    resolve({
      data: result,
      total: num
    })
  })
}

/**
 * 下载视频
 * @param {url} url 
 * @param {title} name 
 */
const downloadVideo = function (options){
  if (!fs.existsSync(path.join(__dirname, '../dist/video/'))){
    fs.mkdirSync(path.join(__dirname, '../dist/'))
    fs.mkdirSync(path.join(__dirname, '../dist/video/'))
  }
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(path.join(__dirname, `../dist/video/${options.title}.mp4`))
    request(options.url).pipe(stream)
      .on('error', () => {
        console.log(`视频${chalk.yellow(options.title)}${chalk.red('下载失败')}...`)
        reject()
      })
      .on('close', () => {
        console.log(`视频${chalk.yellow(options.title)}${chalk.green('下载完成')}...`)
        resolve()
      });
  }) 
}

module.exports = {
  getList,
  downloadVideo,
}