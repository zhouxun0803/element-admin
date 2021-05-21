<template>
  <div class="users" v-if="getUserList">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div style="margin-top: 15px" class="search">
      <el-form
        :model="searchForm"
        inline
        @submit.native.prevent
        @keyup.enter.native="search"
      >
        <el-form-item>
          <el-input
            placeholder="请输入内容"
            v-model="searchForm.search"
            clearable
          >
            <el-button
              slot="append"
              @click="search"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDialog = true"
            >添加用户</el-button
          >
        </el-form-item>
      </el-form>
      <el-dialog
        title="新增用户"
        :visible.sync="addDialog"
        width="600px"
        destroy-on-close
        @close="closeUser"
      >
        <el-form
          :model="addUsers"
          ref="userForm"
          label-width="100px"
          class="demo-ruleForm"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUsers.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUsers.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUsers.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addUsers.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="main">
      <el-table
        height="667"
        :data="getUserList.users"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.create_time | getDate }}
          </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="stateUser(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="
                compileOpen(
                  scope.row.username,
                  scope.row.email,
                  scope.row.mobile,
                  scope.row.id
                )
              "
              circle
              size="small"
            >
            </el-button>
            <el-button
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              size="small"
              @click="roleOpen(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑用户" :visible.sync="compileDialog" width="600px">
        <el-form
          :model="compileUsers"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="compileUsers.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="compileUsers.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="compileUsers.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDialog = false">取 消</el-button>
          <el-button type="primary" @click="compileUser()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="roleDeletes" width="600px">
        <el-form
          :model="compileUsers"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="roleUsers.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="username">
            <el-select v-model="value" placeholder="请选择">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option
                v-for="item in optionsRole"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDeletes = false">取 消</el-button>
          <el-button type="primary" @click="roleUser()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="getUserList.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Crumbs from "../component/Crumbs.vue";
import dayjs from "dayjs";
export default {
  components: { Crumbs },
  data() {
    return {
      // 用户数据列表
      getUserList: {},

      // 面包屑数据
      breadcrumb: [
        {
          title: "首页",
          name: "Home",
        },
        {
          title: "用户管理",
        },
        {
          title: "用户列表",
        },
      ],

      // 根据 ID 查询用户信息
      searchForm: {
        search: "",
      },

      //添加用户数据
      addDialog: false,
      addUsers: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不合法", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },

      // 分页
      params: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },

      //编辑用户提交
      compileUsers: {
        username: "",
        email: "",
        mobile: "",
      },
      compileId: "",
      compileDialog: false,

      // 删除单个用户
      deletes: false,

      // 分配用户角色数据
      roleUsers: {
        username: "",
        region: "",
      },
      optionsRole: [],
      value: "",
      roleId: "",
      roleDeletes: false,
    };
  },

  methods: {
    //用户数据列表
    getUser() {
      this.$apis.getUsers("get", this.params).then((res) => {
        this.getUserList = res;
      });
    },

    //添加用户
    addUser() {
      this.$refs.userForm
        .validate()
        .then(() => {
          this.$apis.addUsers(this.addUsers).then((res) => {
            this.getUser();
          });
          this.addDialog = false;
          this.$refs.userForm.resetFields();
        })
        .catch((err) => {});
    },
    closeUser() {
      this.$refs.userForm.resetFields();
    },

    //根据 ID 查询用户信息
    search() {
      this.$router.replace({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          query: this.searchForm.search,
          pagenum: 1,
        },
      });
      this.params.query = this.searchForm.search;
      // this.params.query = Object.assign(
      //   this.params.query,
      //   ...Number(this.searchForm.search)
      // );
      // this.params.query = Object.assign(
      //   this.params.query,
      //   this.searchForm.search
      // );
      // this.params.query = { ...this.params.query, ...then.searchForm.search };
      this.getUser();
    },

    // 修改用户状态
    async stateUser(id, type) {
      await this.$apis.stateUsers(id, type);
      this.getUser();
    },

    //编辑用户提交
    compileOpen(username, email, mobile, id) {
      this.compileDialog = true;
      this.username = username;
      compileUsers;
      this.compileUsers.email = email;
      this.compileUsers.mobile = mobile;
      this.compileId = id;
    },
    async compileUser() {
      await this.$apis.compileUsers(this.compileId, this.compileUsers);
      this.compileDialog = false;
      this.getUser();
    },

    // 删除单个用户
    deleteUser(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.deleteUsers(id).then((res) => {
            this.getUser();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分配用户角色
    async roleOpen(id) {
      const res = await this.$apis.roleSelect();
      this.optionsRole = res.data;
      const roleRes = await this.$apis.roleRid(id);
      this.roleId = roleRes.data.id;
      this.value = roleRes.data.rid;
      this.roleUsers.username = roleRes.data.username;
      this.roleDeletes = true;
    },
    async roleUser() {
      const res = await this.$apis.roleUsers(this.roleId, {
        id: this.roleId,
        rid: this.value,
      });
      this.$message({
        type: "success",
        message: res.meta.msg,
      });
      this.roleDeletes = false;
    },

    // 每页数量变化
    sizeChange(pagesize) {
      this.params.pagesize = Number(pagesize);
      this.$router.replace({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          pagesize,
        },
      });
      this.getUser();
    },

    // 跳转不同页面
    currentChange(pagenum) {
      this.params.pagenum = Number(pagenum);
      this.$router.replace({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          pagenum,
        },
      });
      this.getUser();
    },
    // index自加
    indexMethod(index) {
      return (this.params.pagenum - 1) * this.params.pagesize + index + 1;
    },
  },
  // watch: {
  //   $route: {
  //     immediate: true,
  //     handler(val) {
  //       if (val.query.pagesize && val.query.pagenum) {
  //         this.params.pagesize = Number(val.query.pagesize);
  //         this.params.pagenum = Number(val.query.pagenum);
  //         this.getUser();
  //       } else {
  //         this.getUser();
  //       }
  //     },
  //   },
  // },
  filters: {
    // 转化时间戳
    getDate(date) {
      return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
    },
  },
  mounted() {
    this.getUser();
    // this.params.pagesize = Number(this.$route.query.pagesize);
    // this.params.pagenum = Number(this.$route.query.pagenum);
    // this.searchForm.search = this.$route.query.query;
    // this.params.query = this.$route.query.search;
    // this.params.pagesize = Number(this.$route.query.pagesize);
    // this.params.pagenum = Number(this.$route.query.pagenum);
  },
};
</script>

<style scoped lang="scss">
.users {
  height: 100%;
  position: relative;
  .search {
    display: flex;
    .el-input-group {
      width: 260px;
      margin-right: 10px;
    }
  }
  .pagination {
    position: absolute;
    bottom: 0;
  }
}
</style>
