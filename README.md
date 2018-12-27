## 1.自动抓取指定微博下特定微博的视频地址并下载(2018.12.27)

### api

1. 微博H5个人主页地址: `https://m.weibo.cn/p/2304132948117283_-_WEIBO_SECOND_PROFILE_WEIBO`
2. 接口地址:

> `https://m.weibo.cn/api/container/getIndex?containerid=2304132948117283_-_WEIBO_SECOND_PROFILE_WEIBO&page_type=03&page=1`

各个参数的含义: 

1. `containerid`: 和用户相关,暂时不用管
2. `page_type`: 并不知道是干啥的,默认取值是03,但是不传貌似也没事
3. `page`: 页码.经观察,第一页默认10条数据,第二页已上默认是5条数据

### 接口返回值分析

```javascript
{
  data: {
    cards: [
      {
        card_type: 9,//微博模块
        mblog: {
          user: {},//用户信息
          page_info: { //视频相关信息
            type: 'video',
            media_info: {
              content2: '',
              mp4_sd_url: '',
              mp4_hd_url: '',
              mp4_720p_mp4: ''
            }
          }
        }
      }
    ]
  }
}
```