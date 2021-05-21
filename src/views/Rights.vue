<template>
  <div class="rights">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div class="main">
      <el-table height="778" :data="getRightsList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="层级"></el-table-column>
      </el-table>
    </div>
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
          title: "权限管理",
        },
        {
          title: "权限列表",
        },
      ],
      getRightsList: [],
    };
  },
  methods: {
    jurisdictionList() {
      this.$apis.jurisdictionList().then((res) => {
        this.getRightsList = res.data;
        this.getRightsList.map((item) => {
          if (item.level === "0") {
            item.level = "一级";
          }
          if (item.level === "1") {
            item.level = "二级";
          }
          if (item.level === "2") {
            item.level = "三级";
          }
        });
      });
    },
  },
  mounted() {
    this.jurisdictionList();
  },
};
</script>

<style scoped lang="scss">
.main {
  margin-top: 30px;
}
</style>
