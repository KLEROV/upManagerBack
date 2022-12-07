import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/UPUser/',
  
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/upCost/createUpCost',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/upCost/updateUpCost',
    method: 'put',
    data
  })
}
export function del(data) {
    return request({
      url: 'api/upCost/deleteUpCost',
      method: 'DELETE',
      data
    })
  }
export default { get, edit, add ,del}
