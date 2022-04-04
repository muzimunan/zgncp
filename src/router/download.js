import Axios from 'axios'
/*
 * @params {string} url 请求地址
 * @params {object} resOpts 请求配置参数
 */
const download = ({ url, method, params }) => {
  const queryArgs = {
    url,
    method,
    params,
    responseType: 'blob'
  }
  // tips: 这里直接返回的是response整体!
  return Axios.request(queryArgs).catch(err => console.log(err))
}

export default download
