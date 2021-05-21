<template>
  <div class="roles">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div class="addRole">
      <el-button style="margin: 20px 0" type="primary" @click="addDialog = true"
        >添加角色</el-button
      >
    </div>
    <div class="main">
      <el-table height="700" :data="roleLists.data" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" class="demo-table-expand">
              <el-row
                :gutter="24"
                v-for="item in scope.row.children"
                :key="item.id"
              >
                <el-col :span="3"
                  ><div class="grid-content bg-purple">
                    <el-form-item>
                      <div style="display: flex; align-items: center">
                        <el-tag closable @close="closeRole(scope.row, item.id)">
                          {{ item.authName }}
                        </el-tag>
                        <span>&gt;</span>
                      </div>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="21"
                  ><div
                    class="grid-content bg-purple"
                    v-for="_item in item.children"
                    :key="_item.id"
                  >
                    <el-form-item>
                      <div style="display: flex; align-items: center">
                        <el-tag
                          closable
                          type="success"
                          @close="closeRole(scope.row, _item.id)"
                        >
                          {{ _item.authName }}
                        </el-tag>
                        <span>&gt;</span>
                        <div style="margin-left: 80px; display: flex">
                          <span
                            v-for="items in _item.children"
                            :key="items.id"
                            style="padding-left: 10px"
                          >
                            <el-tag
                              closable
                              type="warning"
                              @close="closeRole(scope.row, items.id)"
                            >
                              {{ items.authName }}
                            </el-tag>
                          </span>
                        </div>
                      </div>
                    </el-form-item>
                  </div></el-col
                >
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="
                compileOpen(
                  scope.row.id,
                  scope.row.roleName,
                  scope.row.roleDesc
                )
              "
              circle
            >
            </el-button>
            <el-button
              size="small"
              slot="reference"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteRole(scope.row.id)"
            ></el-button>
            <el-button
              size="small"
              type="success"
              icon="el-icon-check"
              circle
              @click="AccreditOpen(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增角色"
      :visible.sync="addDialog"
      width="600px"
      destroy-on-close
      @close="closeRoleForm"
    >
      <el-form
        :model="roleForm"
        ref="roleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="compileDialog" width="600px">
      <el-form :model="compileRole" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色ID" prop="id">
          <el-input v-model="compileRole.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="compileRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="compileRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="compileDialog = false">取 消</el-button>
        <el-button type="primary" @click="compileRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="角色授权" :visible.sync="accreditDialog" width="600px">
      <el-tree
        :data="roleAccreditList.data"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        default-expand-all
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="accreditDialog = false">取 消</el-button>
        <el-button type="primary" @click="roleAccredit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Crumbs from "../component/Crumbs.vue";
import bus from "../assets/eventBus";
export default {
  components: { Crumbs },
  data() {
    return {
      // 面包屑数据
      breadcrumb: [
        {
          title: "首页",
          name: "Home",
        },
        {
          title: "权限管理",
        },
        {
          title: "角色列表",
        },
      ],
      addDialog: false,
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      roleLists: {},
      administration: {},

      //编辑用户提交
      compileRole: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      compileDialog: false,

      // 角色授权
      accreditDialog: false,
      roleAccreditList: {},
      defaultProps: {
        children: "children",
        label: "authName",
      },
      checkedKeys: [],
      roleKeys: "",
    };
  },
  methods: {
    // 获取角色列表
    async roleList() {
      const res = await this.$apis.roleList();
      this.roleLists = res;
    },

    // 添加角色
    addRole() {
      this.$refs.roleForm
        .validate()
        .then(() => {
          this.$apis
            .addRole({
              roleName: this.roleForm.roleName,
              roleDesc: this.roleForm.roleDesc,
            })
            .then((res) => {
              this.roleList();
            })
            .catch((err) => {});
          this.addDialog = false;
          this.$refs.roleForm.resetFields();
        })
        .catch((err) => {});
    },
    closeRoleForm() {
      this.$refs.roleForm.resetFields();
    },

    //编辑用户角色
    compileOpen(id, roleName, roleDesc) {
      this.compileDialog = true;
      this.compileRole.id = id;
      this.compileRole.roleName = roleName;
      this.compileRole.roleDesc = roleDesc;
      this.compileId = id;
    },
    compileRoles() {
      this.$apis
        .compileRoles(this.compileRole.id, {
          id: this.compileRole.id,
          roleName: this.compileRole.roleName,
          roleDesc: this.compileRole.roleDesc,
        })
        .then((res) => {
          this.compileDialog = false;
          this.roleList();
        });
    },

    //删除角色
    deleteRole(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.deleteRole(id).then((res) => {
            this.roleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 角色授权
    AccreditOpen(data) {
      this.checkedKeys = [];
      // data.children.map((item) => {
      //   item.children.map((_item) => {
      //     _item.children.map((items) => {
      //       this.checkedKeys.push(items.id);
      //     });
      //   });
      // });
      // 递归获取三级节点的Id
      this.getKeafKeys(data, this.checkedKeys);
      this.$apis.roleAccreditList().then((res) => {
        this.roleAccreditList = res;
        this.accreditDialog = true;
      });
      this.roleKeys = data.id;
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到checkedKeys数组中
    getKeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getKeafKeys(item, arr);
      });
    },
    roleAccredit() {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ];
      this.$apis
        .roleAccredit(this.roleKeys, {
          rids: keys.join(","),
        })
        .then((res) => {
          this.roleList();
          bus.$emit("event");
        });
      this.accreditDialog = false;
    },
    // 删除角色指定权限
    closeRole(roleId, rightId) {
      this.$apis.closeRole(roleId.id, rightId).then((res) => {
        // this.roleList();
        // roleId.children = res.data;
        this.closes(roleId, rightId);
        bus.$emit("event");
        // roleId.children.forEach((item, index) => {
        //   if (item.id === rightId) {
        //     roleId.children.splice(index, 1);
        //   } else {
        //     item.children.forEach((_item, _index) => {
        //       if (_item.id === rightId) {
        //         item.children.splice(_index, 1);
        //       } else {
        //         _item.children.forEach((__item, __index) => {
        //           if (__item.id === rightId) {
        //             _item.children.splice(__index, 1);
        //           }
        //         });
        //       }
        //     });
        //   }
        // });
      });
    },
    // 递归实现删除
    closes(roleId, rightId) {
      roleId.children.forEach((item, index) => {
        if (item.id === rightId) {
          roleId.children.splice(index, 1);
        } else {
          if (item.children) {
            this.closes(item, rightId);
          }
        }
      });
    },
  },
  mounted() {
    this.roleList();
  },
};
</script>

<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
