import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function getAuthenticationList(params) {
  return request({
    url: '/authentications',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'delete',
    data
  })
}

export function activedUser(data) {
  return request({
    url: '/users/' + data.id + '/actived',
    method: 'put',
    data
  })
}

export function inactivedUser(data) {
  return request({
    url: '/users/' + data.id + '/inactived',
    method: 'put',
    data
  })
}
