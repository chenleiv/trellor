import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/pages/home.vue'
import workspace from '@/pages/workspace.vue'
import boardDetails from '@/pages/board-details.vue'
import taskDetails from '@/pages/task-details.vue'

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
    component: boardDetails
},
{
    path: '/board/:boardId/task/:taskId',
    name: 'taskDetails',
    component: taskDetails
}]

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