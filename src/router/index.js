import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        component: function(resolve) {
            require(['../pages/Home.vue'], resolve)
        }
    }, {
        path: '/paper',
        component: function(resolve) {
            require(['../pages/Paper.vue'], resolve)
        }
    }, {
        path: '/info',
        component: function(resolve) {
            require(['../pages/Info.vue'], resolve)
        }
    }, {
        path: '/setting',
        component: function(resolve) {
            require(['../pages/Setting.vue'], resolve)
        }
    }]
})