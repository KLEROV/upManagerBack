import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/upOperation/queryUpVideo',
    method: 'get',
  })
}

export function uploadCover(data,videoId) {
  return request({
    url: `api/upOperation/uploadCover?videoId=${videoId}`,
    method: 'post',
    data
  })
}

export function uploadVideo(data) {
  return request({
    url: 'api/upOperation/uploadUpVideo/',
    method: 'post',
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
  //查询UP主视频总计接口
  export function total(data) {
    return request({
      url: 'api/UPUser/upDetailedTotal',
      method: 'get',
      data
    })
  }
export default { get, uploadVideo, uploadCover}
