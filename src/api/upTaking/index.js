import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/upTakingConfig',
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: 'api/upTakingConfig',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/upTakingConfig',
    method: 'put',
    data
  })
}
export function del(data) {
    return request({
      url: 'api/upTakingConfig',
      method: 'DELETE',
      data
    })
  }
  export function setStatus(data) {
    return request({
      url: 'api/upTakingRecord/verify',
      method: 'put',
      data
    })
  }
  export function uploadPic(data) {
    return request({
      url: 'api/upTakingRecord/verify',
      method: 'put',
      data
    })
  }
  export function getTotal(data) {
    return request({
      url: `api/upTakingRecord/queryTotalTaking?${data}`,
      method: 'get',
    })
  }

export default { get, edit, add ,del,setStatus,uploadPic,getTotal}
