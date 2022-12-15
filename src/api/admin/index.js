import request from '@/utils/request'


export function getUpAmount() {
  return request({
    url: `api/UPUser/upAmount`,
    method: 'get',
  })
}
export default {getUpAmount}