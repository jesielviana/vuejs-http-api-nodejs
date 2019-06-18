import Vue from 'vue'
import axios from 'axios'

Vue.use({install(Vue) {
        // Vue.prototype.$http = axios
        Vue.prototype.$http = axios.create({
            baseURL: 'http://localhost:3000',
            headers: {
            }
        })

    // Intercepta todas requisições
        Vue.prototype.$http.interceptors.request.use(config => {
            return config
        }, error => Promise.reject(error))

    // Intercepta todas as respostas
        Vue.prototype.$http.interceptors.response.use(res => {
            return res
        }, error => Promise.reject(error))
    }
})