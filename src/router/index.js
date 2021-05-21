import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: {
      name: "Users"
    },
    children: [
      {
        path: "users",
        name: "Users",
        component: () => import("../views/User.vue")
      },
      {
        path: "roles",
        name: "Roles",
        component: () => import("../views/Roles.vue")
      },
      {
        path: "rights",
        name: "Rights",
        component: () => import("../views/Rights.vue")
      },
      {
        path: "goods",
        name: "Goods",
        component: () => import("../views/Goods.vue"),
      },
      {
        path: "params",
        name: "Params",
        component: () => import("../views/Params.vue")
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("../views/Categories.vue")
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("../views/Orders.vue")
      },
      {
        path: "reports",
        name: "Reports",
        component: () => import("../views/Reports.vue")
      },
      {
        path: "addgoods",
        name: "Addgoods",
        component: () => import("../views/Addgoods.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.name !== "Login") { // 判断是否已经登录过
    if (!store.state.token) {
      next({
        replace: true,
        name: "Login"
      })
      return;
    }
    next()
    return;
  }
  next();
});

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
