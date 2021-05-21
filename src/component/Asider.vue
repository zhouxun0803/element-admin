<template>
  <div class="asider">
    <span class="tit">
      <img v-if="isCollapse" src="../assets/logo.jpg" alt="" />
      <h3 v-else>后台管理</h3>
    </span>
    <input
      class="ipt"
      type="checkbox"
      v-model="isCollapse"
      :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
    />
    <el-menu
      style="border-right: none"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#909399"
      active-text-color="#fff"
      :default-active="activeIndex"
      router
      unique-opened
    >
      >
      <el-submenu :index="'' + item.id" v-for="item in list" :key="item.id">
        <template slot="title">
          <i class="el-icon-user-solid" v-if="item.authName == '用户管理'"></i>
          <i class="el-icon-more" v-if="item.authName == '权限管理'"></i>
          <i class="el-icon-s-goods" v-if="item.authName == '商品管理'"></i>
          <i class="el-icon-s-order" v-if="item.authName == '订单管理'"></i>
          <i class="el-icon-s-data" v-if="item.authName == '数据统计'"></i>
          <span slot="title">{{ item.authName }}</span>
        </template>
        <el-menu-item-group
          v-for="_item in item.children"
          :key="_item.id"
          @click.native="headleClick(_item)"
        >
          <el-menu-item :index="'' + _item.path">{{
            _item.authName
          }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import bus from "../assets/eventBus";
export default {
  data() {
    return {
      isCollapse: false,
      list: [],
      activeIndex: "",
      record: [],
    };
  },
  methods: {
    async getMenus() {
      this.list = await this.$apis.getMenus();
    },
    headleClick(item) {
      bus.$emit("record", item);
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(val) {
        if (val.name === "Addgoods") {
          this.activeIndex = "goods";
        } else {
          this.activeIndex = val.name.toLowerCase();
        }
      },
    },
  },
  mounted() {
    this.getMenus();
    bus.$on("event", (mes) => {
      this.getMenus();
    });
  },
};
</script>

<style scoped lang="scss">
.asider {
  height: 100vh;
  background: #001529;
  position: relative;
  z-index: 99;
  .tit {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 20px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  .ipt {
    font-size: 25px;
    background-color: none;
    border: none;
    -webkit-appearance: none; /*去除默认样式*/
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    -ms-appearance: none;
    position: absolute;
    top: 13px;
    right: -50px;
    cursor: pointer;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
::v-deep .el-menu-item-group__title {
  padding: 0;
}
</style>
