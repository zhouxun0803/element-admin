<template>
  <div class="categories">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div class="addgoodsClassify">
      <el-button
        style="margin: 20px 0"
        type="primary"
        @click="goodsClassifyOpen"
        >添加分类</el-button
      >
    </div>
    <div class="main">
      <el-table
        :data="getgoodsClassifyLists.result"
        style="width: 100%; margin-bottom: 20px; height: 634px; overflow: auto"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="商品分类" prop="cat_name"> </el-table-column>
        <el-table-column label="级别">
          <template slot-scope="scope">{{
            scope.row.cat_level | catLevel
          }}</template>
        </el-table-column>
        <el-table-column label="是否有效" prop="">有效</el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="compileGoodsClassifyOpen(scope.row)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteGoodsClassify(scope.row.cat_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="getgoodsClassifyLists.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="添加商品分类"
      :visible.sync="goodsClassifyDialog"
      width="600px"
      destroy-on-close
    >
      <el-form
        :model="goodsClassify"
        ref="goodsClassify"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="goodsClassify.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="cat_pid">
          <el-cascader
            v-model="goodsClassify.cat_pid"
            :options="goodsClassifyList"
            :props="goodsClassifyLists"
            ref="goodsForm"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsClassifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="addgoodsClassify()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改商品分类"
      :visible.sync="compilegoodsClassifyDialog"
      width="600px"
      destroy-on-close
    >
      <el-form
        :model="compilegoodsClassifys"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="compilegoodsClassifys.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="compilegoodsClassifyDialog = false">取 消</el-button>
        <el-button type="primary" @click="compilegoodsClassify()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
          title: "商品分类",
        },
      ],
      goodsClassifyDialog: false,
      goodsClassify: {
        cat_name: "",
        cat_level: "2",
        cat_pid: [],
      },
      goodsClassifyList: [],
      goodsClassifyLists: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        cat_level: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      getgoodsClassifyLists: [],
      params: {
        type: 3,
        query: "",
        pagenum: 1,
        pagesize: 5,
      },

      //修改商品分类
      compilegoodsClassifyDialog: false,
      compilegoodsClassifys: {
        cat_name: "",
      },
      goodsClassifyId: "",
    };
  },
  methods: {
    getgoodsClassifyList() {
      this.$apis.categories(this.params).then((res) => {
        this.getgoodsClassifyLists = res.data;
      });
    },
    // 每页数量变化
    sizeChange(pagesize) {
      this.params.pagesize = Number(pagesize);
      this.getgoodsClassifyList();
    },
    // 跳转不同页面
    currentChange(pagenum) {
      this.params.pagenum = Number(pagenum);
      this.getgoodsClassifyList();
    },
    // 添加商品分类管理
    goodsClassifyOpen() {
      this.$apis.categories({ type: 2 }).then((res) => {
        this.goodsClassifyList = res.data;
      });
      this.goodsClassifyDialog = true;
    },
    addgoodsClassify() {
      this.$refs.goodsClassify.validate().then(() => {
        this.$apis
          .addGoodsClassify({
            cat_name: this.goodsClassify.cat_name,
            cat_level: "2",
            cat_pid: this.goodsClassify.cat_pid[
              this.goodsClassify.cat_pid.length - 1
            ],
          })
          .then((res) => {
            this.getgoodsClassifyList();
            this.$refs.goodsClassify.resetFields();
            this.goodsClassifyDialog = false;
          });
      });
    },
    // 修改商品分类
    compileGoodsClassifyOpen(data) {
      this.compilegoodsClassifys.cat_name = data.cat_name;
      this.goodsClassifyId = data.cat_id;
      this.compilegoodsClassifyDialog = true;
    },
    compilegoodsClassify() {
      this.$apis
        .compilegoodsClassify(this.goodsClassifyId, {
          cat_name: this.compilegoodsClassifys.cat_name,
        })
        .then((res) => {
          this.getgoodsClassifyList();
          this.compilegoodsClassifyDialog = false;
        });
    },
    // 删除商品分类
    deleteGoodsClassify(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.deletegoodsClassify(id).then((res) => {
            this.getgoodsClassifyList();
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
  filters: {
    catLevel(val) {
      if (val === 0) {
        return "一级";
      } else if (val === 1) {
        return "二级";
      } else {
        return "三级";
      }
    },
  },
  mounted() {
    this.getgoodsClassifyList();
  },
};
</script>

<style scoped lang="scss">
.categories {
  height: 100%;
  position: relative;
  .pagination {
    position: absolute;
    bottom: 0;
  }
}
</style>
