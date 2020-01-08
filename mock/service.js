import Mock from 'mockjs'

const input = {
  'id': '@id',
  'class': 'app\\ffmpeg\\admin\\Input',
  'class_name': '编码输入',
  'model_name': '输入',
  'create_time': '2019-11-04 23:06:54',
  'update_time': '2019-11-04 23:06:54',
  'status': 0,
  'statusstr': '空闲',
  'path': '/api/admin/ffmpeg/v1/inputs/3',
  'type|1': [0, 1, 2],
  'typename|1': ['设备', '网络', '文件'],
  'protocol': 'udp',
  'url': 'udp://239.0.0.2',
  'para_name1': '',
  'para_value1': '',
  'para_name2': '',
  'para_value2': '',
  'para_name3': '',
  'para_value3': '',
  'log': null
}
const output = {
  'id': '@id',
  'class': 'app\\ffmpeg\\admin\\Output',
  'class_name': '编码输出',
  'model_name': '输出',
  'create_time': '2019-11-04 23:06:30',
  'update_time': '2019-11-04 23:06:30',
  'status': 0,
  'statusstr': '空闲',
  'path': '/api/admin/ffmpeg/v1/outputs/2',
  'type': 1,
  'typename': '网络',
  'protocol': 'udp',
  'url': 'udp://239.1.1.1:8002/',
  'para_name1': '',
  'para_value1': '',
  'para_name2': '',
  'para_value2': '',
  'para_name3': '',
  'para_value3': '',
  'log': null
}

const channel = {
  'id': 4,
  'class': 'app\\ffmpeg\\admin\\Channel',
  'class_name': '频道',
  'model_name': '频道',
  'create_time': '2019-11-07 17:56:18',
  'update_time': '2019-11-07 17:56:18',
  'status': 0,
  'statusstr': '停止的',
  'path': '/api/admin/ffmpeg/v1/channels/5',
  'name': 'test1',
  'type': 0,
  'input': {
    'id': 2,
    'class': 'app\\ffmpeg\\admin\\Input',
    'class_name': '编码输入',
    'model_name': '输入',
    'create_time': '2019-11-07 17:14:11',
    'update_time': '2019-11-07 17:14:11',
    'status': 0,
    'statusstr': '空闲',
    'type': 0,
    'typename': '设备',
    'protocol': 'decklink',
    'url': 'DeckLink 8K Pro (1)',
    'para_name1': '',
    'para_value1': '',
    'para_name2': '',
    'para_value2': '',
    'para_name3': '',
    'para_value3': '',
    'log': null
  },
  'output': [{
    'id': 6,
    'class': 'app\\ffmpeg\\admin\\Output',
    'class_name': '编码输出',
    'model_name': '输出',
    'create_time': '2019-11-04 23:06:30',
    'update_time': '2019-11-04 23:06:30',
    'status': 0,
    'statusstr': '空闲',
    'type': 1,
    'typename': '网络',
    'protocol': 'udp',
    'url': 'udp://239.1.1.1:8002/',
    'para_name1': '',
    'para_value1': '',
    'para_name2': '',
    'para_value2': '',
    'para_name3': '',
    'para_value3': '',
    'log': null
  }],
  'logo': null,
  'left_percent': 0,
  'top_percent': 0,
  'width_percent': 0,
  'height_percent': 0,
  'v_codec': 'hevc_nvenc',
  'v_resolution_w': 7840,
  'v_resolution_h': 4320,
  'v_bitrate': 10000000,
  'v_framerate': 0,
  'v_profile': '',
  'v_preset': '',
  'a_codec': 'aac',
  'a_samplerate': 0,
  'a_bitrate': 500000,
  'format': '',
  'previewurl': 'rtmp://192.168.5.41:1935/mylive/5_1',
  'log': ''
}

const logo = {
  'id': '@id',
  'class': 'app\\media\\logic\\ImageFile',
  'class_name': '图片文件',
  'model_name': '图片文件',
  'create_time': '2019-11-06 14:45:14',
  'update_time': '2019-11-06 14:45:16',
  'status': 0,
  'statusstr': '未定义',
  'path': '20191106/bca838b15f93fbec194b080d65140a57.png',
  'name': 'bca838b15f93fbec194b080d65140a57',
  'origin': '微信图片_20191025113947.png',
  'filename': 'bca838b15f93fbec194b080d65140a57.png',
  'ext': 'png',
  'realpath': '/data/web/www1/public/uploads/image/20191106/bca838b15f93fbec194b080d65140a57.png',
  'type': 'png',
  'mime': 'image/png',
  'size': 4292,
  'sizestr': '4.191KB',
  'height': 96,
  'width': 76,
  'md5': '1952b5ac9f4d90fcbab71840dc43c68c',
  'sha1': '5f26bb1a3ed11f39c0f6e5d1ecbcd36fac0378c5',
  'ref': 1,
  'url': '/uploads/image/20191106/bca838b15f93fbec194b080d65140a57.png',
  'thumb': '/uploads/image/20191106/bca838b15f93fbec194b080d65140a57_thumb.png'
}

// const log = {
//   'id': '@id',
//   'create_time': '2019-11-06 14:45:14',
//   'update_time': '2019-11-06 14:45:16',
//   'msg': 'dlsicksid'
// }

const inputs = Mock.mock({
  'items|5': [input]
})

const outputs = Mock.mock({
  'items|5': [output]
})

const channels = Mock.mock({
  'items|5': [channel]
})

const logos = Mock.mock({
  'items|5': [logo]
})

// const logs = Mock.mock([
//   'log message line 0',
//   'log message line 1',
//   'log message line 2',
//   'log message line 3',
//   'log message line 4',
//   'log message line 5',
//   'log message line 6',
//   'log message line 7',
//   'log message line 8',
//   'log message line 9',
//   'log message line 10',
//   'log message line 11',
//   'log message line 12',
//   'log message line 13',
//   'log message line 14',
//   'log message line 15',
//   'log message line 16',
//   'log message line 17',
//   'log message line 18',
//   'log message line 19',
//   'log message line 20',
//   'log message line 21',
//   'log message line 22',
//   'log message line 23',
//   'log message line 24',
//   'log message line 25',
//   'log message line 26',
//   'log message line 27',
//   'log message line 28',
//   'log message line 29',
//   'log message line 30',
//   'log message line 31',
//   'log message line 32',
//   'log message line 33',
//   'log message line 34',
//   'log message line 35',
//   'log message line 36',
//   'log message line 37',
//   'log message line 38',
//   'log message line 39',
//   'log message line 40',
//   'log message line 41',
//   'log message line 42',
//   'log message line 43',
//   'log message line 44',
//   'log message line 45',
//   'log message line 46',
//   'log message line 47',
//   'log message line 48',
//   'log message line 49'
// ])

export default [
  {
    url: '/inputs',
    type: 'get',
    response: config => {
      const { page = 1, per_page = 20 } = config.query
      const items = inputs.items

      var mockList = items
      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))

      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'where': {
        },
        'path': '/api/admin/ffmpeg/v1/inputs',
        'items': pageList
      }
    }
  },

  {
    url: '/inputs',
    type: 'post',
    response: config => {
      const item = input
      return item
    }
  },

  {
    url: '/inputs/[0-9]',
    type: 'get',
    response: config => {
      const item = input
      return item
    }
  },

  {
    url: '/inputs/[0-9]',
    type: 'put',
    response: config => {
      const item = input
      return item
    }
  },

  {
    url: '/inputs/[0-9]',
    type: 'delete',
    response: config => {
      const item = input
      return item
    }
  },

  {
    url: '/outputs',
    type: 'get',
    response: config => {
      const { page = 1, per_page = 20 } = config.query
      const items = outputs.items

      var mockList = items
      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))

      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'where': {
        },
        'path': '/api/admin/ffmpeg/v1/outputs',
        'items': pageList
      }
    }
  },

  {
    url: '/outputs',
    type: 'post',
    response: config => {
      const item = output
      return item
    }
  },

  {
    url: '/outputs/[0-9]',
    type: 'get',
    response: config => {
      const item = output
      return item
    }
  },

  {
    url: '/outputs/[0-9]',
    type: 'put',
    response: config => {
      const item = output
      return item
    }
  },

  {
    url: '/outputs/[0-9]',
    type: 'delete',
    response: config => {
      const item = output
      return item
    }
  },

  // {
  //   url: '/channels/[0-9]/log',
  //   type: 'get',
  //   response: config => {
  //     return logs
  //   }
  // },

  {
    url: '/channels/[0-9]',
    type: 'get',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels/[0-9]',
    type: 'put',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels',
    type: 'get',
    response: config => {
      const { page = 1, per_page = 20 } = config.query
      const items = channels.items

      var mockList = items
      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))

      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'where': {
        },
        'path': '/api/admin/ffmpeg/v1/channels',
        'items': pageList
      }
    }
  },

  {
    url: '/channels',
    type: 'post',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels/[0-9]/start',
    type: 'put',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels/[0-9]/stop',
    type: 'put',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels/[0-9]/disable',
    type: 'put',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/channels/[0-9]/enable',
    type: 'put',
    response: config => {
      const item = channel
      return item
    }
  },

  {
    url: '/logos',
    type: 'get',
    response: config => {
      const { page = 1, per_page = 20 } = config.query
      const items = logos.items

      var mockList = items
      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))

      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'where': {
        },
        'path': '/api/admin/ffmpeg/v1/logos',
        'items': pageList
      }
    }
  },

  {
    url: '/logos',
    type: 'post',
    response: config => {
      const item = logo
      return item
    }
  },

  {
    url: '/logos/upload',
    type: 'post',
    response: config => {
      const item = logo
      return item
    }
  }
]
