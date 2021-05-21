<template>
  <div class="params" ref="scroll">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
      <el-alert
        style="margin: 20px 0"
        title="注意:只允许为第三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
    </div>
    <div class="selectGoods">
      <span>请选择商品分类：</span>
      <el-cascader
        v-model="goods_cat"
        :options="goodsList"
        @change="handleChange"
        :props="goodslists"
      ></el-cascader>
    </div>
    <div class="main">
      <el-tabs v-model="activeName" :before-leave="beforeTabLeave">
        <el-tab-pane label="动态参数" name="first">
          <el-button type="primary" style="small">设置动态参数</el-button>
          <el-table
            :data="getGoodsManyAttrVals"
            style="width: 100%"
            border
            id="out-table"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                  @submit.native.prevent
                >
                  <el-form-item>
                    <el-tag
                      v-for="(item, index) in props.row.attr_vals"
                      :key="index"
                      closable
                      :disable-transitions="false"
                      @close="closeGoodsMany(props.row, index)"
                      style="margin: 0 5px"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="addGoodsMany(props.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="inputVisible = true"
                      >+ New Tag</el-button
                    >
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="compileOpen(scope.row)"
                ></el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteGoodsMany(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="second">
          <el-button type="primary" style="small">设置静态参数</el-button>
          <el-table
            :data="getGoodsOnlyAttrVals"
            style="width: 100%"
            border
            id="out-table"
          >
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="属性值" prop=""></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="compileOnlyOpen(scope.row)"
                ></el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteGoodsOnly(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="修改分类参数"
        :visible.sync="compileDialog"
        width="600px"
      >
        <el-form
          :model="compileManys"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="说明" prop="username">
            <el-input disabled value="添加多个以逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="attr_vals">
            <el-input v-model="compileManys.attr_vals"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="attr_name">
            <el-input v-model="compileManys.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDialog = false">取 消</el-button>
          <el-button type="primary" @click="compileMany()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改分类参数"
        :visible.sync="compileDialogs"
        width="600px"
      >
        <el-form
          :model="compileOnlys"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称" prop="attr_name">
            <el-input v-model="compileOnlys.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDialogs = false">取 消</el-button>
          <el-button type="primary" @click="compileOnly()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <el-button
      @click="$router.push('/addressAdd')"
      type="primary"
      icon="el-icon-edit"
      >添加地址</el-button
    >
    <el-button @click="exportToExcel">导出</el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 面包屑数据
      breadcrumb: [
        {
          title: "首页",
          name: "Home",
        },
        {
          title: "商品管理",
        },
        {
          title: "分类参数",
        },
      ],
      // 获取商品列表
      goodsList: [],
      goodslists: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      goods_cat: [],
      activeName: "first",
      getGoodsManyAttrVals: [],
      getGoodsOnlyAttrVals: [],
      // 删除动态参数
      inputVisible: false,
      inputValue: "",

      //修改分类参数
      compileManys: {
        attr_sel: "",
        attr_vals: "",
        attr_name: "",
      },
      // 修改静态分类参数
      compileOnlys: {
        attr_sel: "",
        attr_vals: "",
        attr_name: "",
      },
      compileId: "",
      compileDialog: false,
      compileDialogs: false,
      manysId: "",
      onlyId: "",
    };
  },
  methods: {
    // 导出excel表
    exportToExcel: function () {
      let tables = document.getElementById("out-table");
      let table_book = this.$XLSX.utils.table_to_book(tables);
      var table_write = this.$XLSX.write(table_book, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        this.$FileSaver.saveAs(
          new Blob([table_write], { type: "application/octet-stream" }),
          "sheetjs.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, table_write);
      }
      return table_write;
    },
    // 商品数据列表
    categories() {
      this.$apis.categories({ type: 3 }).then((res) => {
        this.goodsList = res.data;
      });
    },
    handleChange() {
      this.getGoodsManyAttrVals = [];
      if (this.goods_cat.length !== 3) {
        this.goods_cat = [];
      } else {
        this.$apis
          .getGoodsMany(this.goods_cat[this.goods_cat.length - 1])
          .then((res) => {
            this.getGoodsManyAttrVals = res.data;
            this.getGoodsManyAttrVals.map((item) => {
              item.attr_vals = item.attr_vals.split(",");
            });
          });
        this.$apis
          .getGoodsOnly(this.goods_cat[this.goods_cat.length - 1])
          .then((res) => {
            this.getGoodsOnlyAttrVals = res.data;
          });
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "first" && this.goods_cat.length !== 3) {
        this.$message({
          type: "warning",
          message: "请选择三级分类",
        });
        return false;
      }
    },

    // 删除动态参数
    closeGoodsMany(data, index) {
      data.attr_vals.splice(index, 1);
      this.$apis.deleteMany(
        this.goods_cat[this.goods_cat.length - 1],
        data.attr_id,
        {
          attr_name: data.attr_name,
          attr_sel: data.attr_sel,
          attr_vals: data.attr_vals.join(","),
        }
      );
    },
    // 添加动态参数
    addGoodsMany(data) {
      data.attr_vals.push(this.inputValue);
      this.$apis.addGoodsMany(
        this.goods_cat[this.goods_cat.length - 1],
        data.attr_id,
        {
          attr_name: data.attr_name,
          attr_sel: "many",
          attr_vals: data.attr_vals.join(","),
        }
      );
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 修改动态分类参数
    compileOpen(data) {
      this.compileDialog = true;
      this.compileManys.attr_name = data.attr_name;
      this.compileManys.attr_vals = String(data.attr_vals);
      this.compileManys.attr_sel = data.attr_sel;
      this.manysId = data.attr_id;
    },
    compileMany() {
      this.$apis
        .addGoodsMany(
          this.goods_cat[this.goods_cat.length - 1],
          this.manysId,
          this.compileManys
        )
        .then((res) => {
          this.getGoodsManyAttrVals.map((item) => {
            if (item.attr_id === res.data.attr_id) {
              item.attr_name = res.data.attr_name;
              item.attr_vals = res.data.attr_vals.split(",");
            }
          });
        });
      this.compileDialog = false;
    },
    // 修改静态分类参数
    compileOnlyOpen(data) {
      this.compileDialogs = true;
      this.compileOnlys.attr_name = data.attr_name;
      this.compileOnlys.attr_vals = data.attr_vals;
      this.compileOnlys.attr_sel = data.attr_sel;
      this.onlyId = data.attr_id;
    },
    compileOnly() {
      this.$apis
        .addGoodsOnly(
          this.goods_cat[this.goods_cat.length - 1],
          this.onlyId,
          this.compileOnlys
        )
        .then((res) => {
          this.getGoodsOnlyAttrVals.map((item) => {
            if (item.attr_id === res.data.attr_id) {
              item.attr_name = res.data.attr_name;
            }
          });
        });
      this.compileDialogs = false;
    },

    // 删除动态分类参数
    deleteGoodsMany(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis
            .deleteGoodsMany(this.goods_cat[this.goods_cat.length - 1], id)
            .then((res) => {
              this.getGoodsManyAttrVals.map((item, index) => {
                if (item.attr_id === id) {
                  this.getGoodsManyAttrVals.splice(index, 1);
                }
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除静态分类参数
    deleteGoodsOnly(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis
            .deleteGoodsOnly(this.goods_cat[this.goods_cat.length - 1], id)
            .then((res) => {
              this.getGoodsOnlyAttrVals.map((item, index) => {
                if (item.attr_id === id) {
                  this.getGoodsOnlyAttrVals.splice(index, 1);
                }
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.categories();
  },
};
</script>

<style scoped lang="scss">
.params {
  height: 100%;
  overflow: auto;
}
</style>
