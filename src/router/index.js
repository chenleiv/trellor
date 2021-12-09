import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/pages/home.vue'
import workspace from '@/pages/workspace.vue'
import boardDetails from '@/pages/board-details.vue'
import taskDetails from '@/pages/task-details.vue'
import dashboard from '@/pages/dashboard.vue'
import mainMap from '@/pages/main-map.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: home
},
{
    path: '/workspace',
    name: 'workspace',
    component: workspace
},
{
    path: '/board/:boardId',
    name: 'boardDetails',
    component: boardDetails,
    children: [{
        path: 'task/:taskId',
        name: 'taskDetails',
        component: taskDetails
    },
    {
        path: 'dashboard',
        name: 'dashboard',
        component: dashboard
    },
    {
        path: 'main-map',
        name: 'mainMap',
        component: mainMap
    }]
},
]

const router = new VueRouter({
    routes
})

export default router





// {
//   path: '/about',
//   name: 'About',
// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
// },