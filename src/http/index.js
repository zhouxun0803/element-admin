import axios from "axios"
import { Message } from 'element-ui'
import store from "../store/index"
import router from "../router/index"
import Vue from "vue";
// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'http://localhost:8889/api/private/v1/';
}
else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = 'https://www.ceshi.com';
}
else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'https://www.production.com';
}
Vue.prototype.$action = axios.defaults.baseURL;

axios.defaults.timeout = 3000;

axios.interceptors.request.use(
    config => {
        if (store.state.token) { //判断token是否存在
            config.headers.Authorization = store.state.token;  //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

function http(url, method = "POST", data = {}, params = {}, config = "application/json") {
    return axios({
        url,
        method,
        data,
        params,
        headers: { 'Content-Type': config }
    }).then(res => {
        if (res.status >= 200 && res.status < 300 || res.status === 304) {
            if (res.data.meta.status === 200 || res.data.meta.status === 201) {
                return res.data
            } else {
                Message({
                    type: "error",
                    message: res.data.meta.msg,
                });
                if (res.data.meta.msg === "无效token") {
                    router.replace({ name: "Login" })
                }
                return Promise.reject(res.data.meta.msg);
            }
        } else {
            Message({
                type: "error",
                message: res.statusText,
            });
            return Promise.reject(res.statusText)
        }
    })
}
export default http;