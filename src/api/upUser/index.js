import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/UPUser/',
    // url: '/api/logs/errorr/',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/upCost/',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/upCost/',
    method: 'put',
    data
  })
}
export function del(data) {
    return request({
      url: 'api/upCost',
      method: 'DELETE',
      data
    })
  }
export default { get, edit, add ,del}
