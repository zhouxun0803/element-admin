import http from "./index"
import router from "../router/index"
import store from "../store/index"
import { Message } from 'element-ui'
export default {
    // 登陆
    login: (data) => {
        http("login", "POST", data).then(res => {
            store.commit("login", {
                token: res.data.token,
                username: res.data.username,
            });
            router.push({
                name: "Home",
            });
            Message({
                type: "success",
                message: res.meta.msg,
            });
        }).catch(err => { })
    },

    //menus侧边栏
    async getMenus() {
        const res = await http("menus", "get")
        return res.data
    },

    //用户数据列表
    async getUsers(method, params) {
        const res = await http("users", method, null, params)
        return res.data
    },

    // 添加用户
    async addUsers(data) {
        await http("users", "POST", data).then(res => {
            Message({
                type: "success",
                message: res.meta.msg,
            });
        }).catch(err => { })
    },

    // 修改用户状态
    async stateUsers(id, type) {
        const res = await http(`users/${id}/state/${type}`, "put")
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },

    // 编辑用户提交
    async compileUsers(url, data) {
        const res = await http(`users/${url}`, "put", data)
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },

    // 删除单个用户
    async deleteUsers(url) {
        const res = await http(`users/${url}`, "delete")
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },

    // 获取角色列表
    async roleSelect() {
        const res = await http("roles", "get")
        return res;
    },
    async roleRid(id) {
        const res = await http(`users/${id}`, "get")
        return res;
    },
    // 分配用户角色
    async roleUsers(roleId, data) {
        const res = await http(`users/${roleId}/role`, "put", data)
        return res;
    },

    //角色列表
    async roleList() {
        const res = await http("roles", "get")
        return res;
    },

    //添加角色
    async addRole(data) {
        const res = await http("roles", "POST", data);
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },
    //  编辑提交角色
    async compileRoles(id, data) {
        const res = await http(`roles/${id}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },
    //  删除角色
    async deleteRole(id) {
        const res = await http(`roles/${id}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg,
        });
    },
    // 角色授权
    async roleAccreditList() {
        const res = await http("rights/tree", "get");
        return res;
    },
    async roleAccredit(roleId, data) {
        const res = await http(`roles/${roleId}/rights`, "POST", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
    },

    // 删除角色指定权限
    async closeRole(roleId, rightId) {
        const res = await http(`roles/${roleId}/rights/${rightId}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },

    // 所有权限列表
    async jurisdictionList() {
        const res = await http("rights/list", "get")
        return res;
    },

    // 商品数据列表
    async productList(params) {
        const res = await http("goods", "get", null, params)
        return res;
    },

    // 商品数据列表
    async categories(params) {
        const res = await http("categories", "get", null, params)
        return res;
    },

    // 获取编辑商品
    async compileGoodList(id) {
        const res = await http(`goods/${id}`, "get")
        return res;
    },
    // 编辑商品
    async compileGood(id, data) {
        const res = await http(`goods/${id}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
    },
    // 删除商品
    async deleteGoods(id) {
        const res = await http(`goods/${id}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg
        })
    },

    // 获取商品动态参数
    async getGoodsMany(id) {
        const res = await http(`categories/${id}/attributes?sel=many`, "get");
        return res;
    },
    // 获取商品静态属性
    async getGoodsOnly(id) {
        const res = await http(`categories/${id}/attributes?sel=only`, "get");
        return res;
    },
    // 上传图片
    async uploadImg(data) {
        const res = await http(`upload`, "post", data, null, "multipart / form - data");
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res;
    },
    // 添加商品
    async addGoodsSubmit(data) {
        const res = await http("goods", "POST", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
    },

    // 添加动态参数
    async addGoodsMany(id, attrid, data) {
        const res = await http(`categories/${id}/attributes/${attrid}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    // 添加静态参数
    async addGoodsOnly(id, attrid, data) {
        const res = await http(`categories/${id}/attributes/${attrid}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },

    // 删除动态参数
    async deleteGoodsMany(id, attrid) {
        const res = await http(`categories/${id}/attributes/${attrid}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    // 删除静态参数
    async deleteGoodsOnly(id, attrid) {
        const res = await http(`categories/${id}/attributes/${attrid}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    async deleteMany(id, attrid, data) {
        const res = await http(`categories/${id}/attributes/${attrid}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },

    //  添加商品分类管理
    async addGoodsClassify(data) {
        const res = await http(`categories`, "post", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    //  添加商品分类管理
    async compilegoodsClassify(id, data) {
        const res = await http(`categories/${id}`, "put", data);
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    //  添加商品分类管理
    async deletegoodsClassify(id) {
        const res = await http(`categories/${id}`, "delete");
        Message({
            type: "success",
            message: res.meta.msg
        })
        return res
    },
    //  订单数据列表
    async getOrdersList(params) {
        const res = await http(`orders`, "get", null, params);
        return res
    },
    //  数据统计
    async getrEports() {
        const res = await http(`reports/type/1`, "get");
        return res
    },

}