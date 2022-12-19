import request from '@/utils/request'


export function getUpAmount() {
  return request({
    url: `api/upOperation/queryInformationByUp`,
    method: 'get',
  })
}
export default {getUpAmount}