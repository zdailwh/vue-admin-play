import request from '@/utils/request'

export function getInputs(params) {
  return request({
    url: '/inputs',
    method: 'get',
    params
  })
}

export function addInput(params) {
  return request({
    url: '/inputs',
    method: 'post',
    data: params
  })
}

export function getInput(params) {
  return request({
    url: '/inputs/' + params.id,
    method: 'get'
  })
}

export function updateInput(params) {
  return request({
    url: '/inputs/' + params.id,
    method: 'put',
    data: params
  })
}

export function delInput(params) {
  return request({
    url: '/inputs/' + params.id,
    method: 'delete'
  })
}

export function getOutputs(params) {
  return request({
    url: '/outputs',
    method: 'get',
    params
  })
}

export function addOutput(params) {
  return request({
    url: '/outputs',
    method: 'post',
    data: params
  })
}

export function getOutput(params) {
  return request({
    url: '/outputs/' + params.id,
    method: 'get'
  })
}

export function updateOutput(params) {
  return request({
    url: '/outputs/' + params.id,
    method: 'put',
    data: params
  })
}

export function delOutput(params) {
  return request({
    url: '/outputs/' + params.id,
    method: 'delete'
  })
}

export function getChannels(params) {
  return request({
    url: '/channels',
    method: 'get',
    params
  })
}

export function getChannel(params) {
  return request({
    url: '/channels/' + params.id,
    method: 'get'
  })
}

export function addChannel(params) {
  return request({
    url: '/channels',
    method: 'post',
    data: params
  })
}

export function updateChannel(params) {
  return request({
    url: '/channels/' + params.id,
    method: 'put',
    data: params
  })
}

export function channelStart(params) {
  return request({
    url: '/channels/' + params.id + '/start',
    method: 'put'
  })
}

export function channelStop(params) {
  return request({
    url: '/channels/' + params.id + '/stop',
    method: 'put'
  })
}

export function channelDisable(params) {
  return request({
    url: '/channels/' + params.id + '/disable',
    method: 'put'
  })
}

export function channelEnable(params) {
  return request({
    url: '/channels/' + params.id + '/enable',
    method: 'put'
  })
}

export function delChannel(params) {
  return request({
    url: '/channels/' + params.id,
    method: 'delete'
  })
}

export function getLogs(params) {
  return request({
    url: '/channels/' + params.id + '/log',
    method: 'get'
  })
}

export function getLogos(params) {
  return request({
    url: '/logos',
    method: 'get',
    params
  })
}

export function addLogo(params) {
  return request({
    url: '/logos',
    method: 'post',
    data: params
  })
}

export function logoUpload(params) {
  return request({
    url: '/logos/upload',
    method: 'post',
    data: params
  })
}

export function delLogo(params) {
  return request({
    url: '/logos/' + params.id,
    method: 'delete'
  })
}

export function getNetworks(params) {
  return request({
    url: '/configs/network',
    method: 'get',
    params
  })
}

export function updateNetwork(params) {
  return request({
    url: '/configs/network/' + params.name,
    method: 'put',
    data: params
  })
}
