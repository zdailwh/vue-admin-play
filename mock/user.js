import Mock from 'mockjs'

const user = {
  'id': '@id',
  'class': 'app\\user\\admin\\User',
  'class_name': '系统管理员',
  'model_name': '用户',
  'create_time': '@datetime',
  'update_time': '@datetime',
  'status|1': [1, 2],
  'statusstr|1': ['活跃', '禁用'],
  'path': '/api/admin/v1/users/2',
  'username': '@sentence(5, 10)',
  'mobile': '',
  'activity': '@integer(100, 500)'
}

const users = Mock.mock({
  'items|30': [user]
})

const authentications = Mock.mock({
  'items|30': [
    {
      'id': 965,
      'class': 'app\\user\\admin\\Authentication',
      'class_name': '登录认证',
      'model_name': '认证',
      'create_time': '2019-08-22 16:29:18',
      'update_time': '2019-08-22 16:49:40',
      'status|1': [0, 1, 2],
      'statusstr|1': ['活跃', '过期', '下线'],
      'path': '/api/admin/v1/authentications/965',
      'session': 'ej89fobjl830eoo8pdqhi63cmq',
      'clientip': '111.199.84.127',
      'expiretime': '2019-08-22 18:49:40',
      'user': user
    }
  ]
})

export default [
  {
    url: '/users',
    type: 'get',
    response: config => {
      const { username, mobile, status, page = 1, per_page = 20, sort } = config.query
      const items = users.items

      let mockList = items.filter(item => {
        if (username && item.username !== username) return false
        if (mobile && item.mobile !== mobile) return false
        if (status && status.length && status.findIndex((n) => n === item.status) === -1) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))

      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'where': {
          'username': username,
          'mobile': mobile,
          'status': status
        },
        'path': '/api/admin/v1/users',
        'items': pageList
      }
    }
  },
  {
    url: '/authentications',
    type: 'get',
    response: config => {
      const { page = 1, per_page = 20, sort } = config.query
      const items = authentications.items
      let mockList = items
      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * page && index >= per_page * (page - 1))
      return {
        'total': mockList.length,
        'page': page,
        'per_page': per_page,
        'count': pageList.length,
        'path': '/api/admin/v1/users',
        'items': pageList
      }
    }
  },
  {
    url: '/users/[0-9]',
    type: 'put',
    response: _ => {
      return user
    }
  },
  {
    url: '/users',
    type: 'post',
    response: _ => {
      return user
    }
  },
  {
    url: '/users/[0-9]',
    type: 'delete',
    response: _ => {
      return user
    }
  },
  {
    url: '/users/[0-9]/actived',
    type: 'put',
    response: _ => {
      return user
    }
  },
  {
    url: '/users/[0-9]/inactived',
    type: 'put',
    response: _ => {
      return user
    }
  }
]
