<template>
  <div class="users" v-if="getOrdersList">
    <div class="header" style="margin-bottom: 20px">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div class="main">
      <el-table
        height="699"
        :data="getOrdersLists.goods"
        style="width: 100%"
        border
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="400">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150">
        </el-table-column>
        <el-table-column label="是否付款" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="small">{{
              scope.row.pay_status | payStatus
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="150"
        ></el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.create_time | getDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="compileOpen(scope.row.order_id)"
              circle
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改地址" :visible.sync="compileDialog" width="600px">
        <el-form
          :model="compileOrder"
          label-width="100px"
          class="demo-ruleForm"
          :rules="rules"
        >
          <el-form-item label="省市区/县" prop="username">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="email">
            <el-input v-model="compileOrder.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="compileDialog = false">取 消</el-button>
          <el-button type="primary" @click="compileOrders()">确 定</el-button>
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
        :total="getOrdersLists.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode,
} from "element-china-area-data";
import Crumbs from "../component/Crumbs.vue";
import dayjs from "dayjs";
export default {
  components: { Crumbs },
  data() {
    return {
      // 订单数据列表
      getOrdersLists: {},

      // 面包屑数据
      breadcrumb: [
        {
          title: "首页",
          name: "Home",
        },
        {
          title: "订单管理",
        },
        {
          title: "订单列表",
        },
      ],
      // 分页
      params: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },

      //编辑订单提交
      compileOrder: {
        username: "",
        email: "",
      },
      compileId: "",
      compileDialog: false,
      rules: {
        username: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
      },
      options: regionData,
      selectedOptions: [],
    };
  },

  methods: {
    //订单数据列表
    getOrdersList() {
      this.$apis.getOrdersList(this.params).then((res) => {
        this.getOrdersLists = res.data;
      });
    },

    //编辑订单提交
    compileOpen(id) {
      this.compileDialog = true;
      this.compileId = id;
    },
    async compileOrders() {
      // await this.$apis.compileOrder(this.compileId, this.compileOrder);
      this.compileDialog = false;
      this.getOrdersList();
    },
    handleChange(value) {
      console.log(value); // value值为区域码
      // 用CodeToText转换成中文
      console.log(CodeToText[value[0]]);
      console.log(CodeToText[value[1]]);
    },
    // 每页数量变化
    sizeChange(pagesize) {
      this.params.pagesize = Number(pagesize);
      this.getOrdersList();
    },

    // 跳转不同页面
    currentChange(pagenum) {
      this.params.pagenum = Number(pagenum);
      this.getOrdersList();
    },
    // index自加
    indexMethod(index) {
      return (this.params.pagenum - 1) * this.params.pagesize + index + 1;
    },
  },
  filters: {
    // 转化时间戳
    getDate(date) {
      return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
    },
    payStatus(val) {
      if (val === "0") {
        return "未付款";
      } else {
        return "已付款";
      }
    },
  },
  mounted() {
    this.getOrdersList();
  },
};
</script>

<style scoped lang="scss">
.users {
  height: 100%;
  position: relative;
  .pagination {
    position: absolute;
    bottom: 15px;
  }
}
</style>

