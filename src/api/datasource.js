import { axios } from '@/utils/request'

const api = {
  user: '/api/user',
  role: '/api/role',
  service: '/api/service',
  permission: '/api/permission',
  permissionNoPager: '/api/permission/no-pager'
}

export default api

// post
export function getDataServiceUrl (url, parameter) {
  return axios({
    url: url,
    method: 'get',
    data: parameter
  })
}
