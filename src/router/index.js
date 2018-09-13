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
        //     path: '/home',
        //     component: function(resolve) {
        //         require(['../pages/Home.vue'], resolve) // Home
        //     }
        // }, {
        path: '/doc',
        component: function(resolve) {
            require(['../pages/Doc.vue'], resolve)
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
    }, {
        path: '/login',
        component: function(resolve) {
            require(['../pages/Login.vue'], resolve)
        }
    }, {
        path: '/lucker',
        component: function(resolve) {
            require(['../pages/LuckyList.vue'], resolve)
        }
    }, {
        path: '/led',
        component: function(resolve) {
            require(['../pages/Led/Index.vue'], resolve)
        }
    }, {
        path: '/score',
        component: function(resolve) {
            require(['../pages/Score.vue'], resolve)
        }
    }, {
        path: '/answer',
        component: function(resolve) {
            require(['../pages/Answer.vue'], resolve)
        }
    }, {
        path: '/study',
        component: function(resolve) {
            require(['../pages/Study.vue'], resolve)
        }
    }, {
        path: '/user',
        component: function(resolve) {
            require(['../pages/UserInfo.vue'], resolve)
        }
    }, {
        path: '/lottery',
        component: function(resolve) {
            require(['../pages/Lottery.vue'], resolve)
        }
    }, {
        path: '/errlist',
        component: function(resolve) {
            require(['../pages/Errlist.vue'], resolve)
        }
    }]
})