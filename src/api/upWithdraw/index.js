import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/upOperation/queryTakingRecordByUp',
  
    method: 'get',
  })
}


export function edit(data) {
  return request({
    url: 'api/upOperation',
    method: 'post',
    data
  })
}
export default { get, edit}
