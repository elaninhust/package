const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const request = require('request');

const file = path.join(__dirname, './dist/output.json')

let page = 1

let result = {}

let num = 0

function getApiUrl(){
  return `https://m.weibo.cn/api/container/getIndex?containerid=2304132948117283_-_WEIBO_SECOND_PROFILE_WEIBO&page_type=01&page=${page}`
}

async function getData(){
  let { data } = await fetch(getApiUrl()).then(res => res.json())

  if(data.cards.length > 0){
    data.cards.forEach(ele => {
      // console.log(ele.mblog.page_info)
      if(ele.card_type === 9 && ele.mblog !== undefined && ele.mblog.page_info !== undefined &&  ele.mblog.page_info.type === "video" && /\[第(\d)+次\]/.test(ele.mblog.page_info.media_info.next_title)){
        let title = ele.mblog.page_info.media_info.next_title.match(/第(\d)+次/)[0]
        let url = ele.mblog.page_info.media_info.mp4_720p_mp4
        console.log(title, url)
        result[title] = url
        num ++

        // let stream = fs.createWriteStream(path.join(__dirname, `./dist/video/${title}.mp4`))
        // request(url).pipe(stream).on('close', () => {
        //   console.log(`${title}下载完成`)
        // }); 

      }
    })
  }

  if(page < 5){
    page ++
    getData()
  }else{
    console.log(`第1页到第${page}页,一共有${num}条符合条件的数据`)
    fs.writeFileSync(file, JSON.stringify(result))
  }
}

getData()



