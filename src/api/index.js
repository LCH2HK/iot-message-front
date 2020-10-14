const api = {
    Login: '/sys/login',
    LoginByPhone: '/sys/verifyMessageLogin',
    Logout: '/sys/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    SendSms: '/sys/sendMessage/login',
    // get my info
    UserInfo: '/user/info'
}
export default api