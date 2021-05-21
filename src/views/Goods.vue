<template>
  <div class="goods">
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
          <el-button type="primary" @click="addgoods">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <el-table
        height="667"
        :data="getGoodsLists.goods"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          label="#"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column prop="goods_name" width="750" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scoped">
            {{ scoped.row.add_time | getDate }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              circle
              @click="compileGoodsOpen(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              circle
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改商品" :visible.sync="compileDialog" width="600px">
        <el-form :model="compileForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="compileForm.goods_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="compileForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="compileForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="compileForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品参数" prop="goods_cat">
            <el-input v-model="compileForm.goods_cat"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDialog = false">取 消</el-button>
          <el-button type="primary" @click="compileGoods()">确 定</el-button>
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
        :total="getGoodsLists.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
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
          title: "商品列表",
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

      // 商品列表
      getGoodsLists: "",
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      // 编辑商品
      compileForm: {
        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: "",
      },
      compileDialog: false,
    };
  },
  methods: {
    // 商品数据列表
    getGoodsList() {
      this.$apis.productList(this.params).then((res) => {
        this.getGoodsLists = res.data;
      });
    },
    // 分页
    // 每页数量变化
    sizeChange(pagesize) {
      this.params.pagesize = Number(pagesize);
      // this.$router.replace({
      //   name: this.$route.name,
      //   query: {
      //     ...this.$route.query,
      //     pagesize,
      //   },
      // });
      this.getGoodsList();
    },

    // 跳转不同页面
    currentChange(pagenum) {
      this.params.pagenum = Number(pagenum);
      // this.$router.replace({
      //   name: this.$route.name,
      //   query: {
      //     ...this.$route.query,
      //     pagenum,
      //   },
      // });
      this.getGoodsList();
    },
    // index自加
    indexMethod(index) {
      return (this.params.pagenum - 1) * this.params.pagesize + index + 1;
    },
    //添加用户
    addgoods() {
      this.$router.push({
        name: "Addgoods",
      });
    },
    //根据 ID 查询用户信息
    search() {
      this.params.query = this.searchForm.search;
      this.getGoodsList();
    },

    // 编辑商品
    compileGoodsOpen(data) {
      this.$apis.compileGoodList(data.goods_id).then((res) => {
        this.compileForm = res.data;
      });
      this.compileDialog = true;
    },
    compileGoods() {
      this.$apis
        .compileGood(this.compileForm.goods_id, this.compileForm)
        .then((res) => {
          this.getGoodsList();
        });
      this.compileDialog = false;
    },

    // 删除商品
    deleteGoods(id) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.deleteGoods(id).then((res) => {
            this.getGoodsList();
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
    // 转化时间戳
    getDate(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
  },
  mounted() {
    this.getGoodsList();
  },
};
</script>

<style scoped lang="scss">
.goods {
  height: 100%;
  position: relative;
  .pagination {
    position: absolute;
    bottom: 0;
  }
}
</style>
