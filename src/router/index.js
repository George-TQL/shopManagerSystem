import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/childComps/Welcome')
const User = () => import('components/users/User')
const Right =() =>import('components/power/Right')
const Role =() =>import('components/power/Role')
const Category =() => import('components/goods/Category')
const Params =() => import('components/goods/Params')
const GoodsList =() => import('components/goods/List')
const Add =() => import('components/goods/Add')

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Right
      },
      {
        path: '/roles',
        component: Role
      },
      {
        path: '/categories',
        component: Category
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 判断前往页面是否为login
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  next()
})

export default router
