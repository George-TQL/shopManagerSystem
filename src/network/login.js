import {request} from './network'

export function getLoginData(options) {
  return request({
    url: 'login',
    params: options,
    method: 'post'
  })

}