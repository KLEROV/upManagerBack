import request from '@/utils/request'


export function getUpAmount() {
  return request({
    url: `api/upOperation/queryInformationByUp`,
    method: 'get',
  })
}
export function getTotal(data) {
  return request({
    url: `api/UPUser/upDetailedTotal?${data}`,
    method: 'get',
  })
}
export default {getUpAmount,getTotal}