import axios from 'axios'

export function request(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8888/api/private/v1/',
      timeout: 5000
    })
    instance(options)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
  })
}