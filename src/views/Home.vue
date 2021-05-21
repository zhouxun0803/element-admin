<template>
  <div class="home">
    <el-container style="height: 100vh; background: #eeeeee">
      <Asider></Asider>
      <el-container style="height: 100vh">
        <el-header style="text-align: right; font-size: 12px">
          <Header></Header>
        </el-header>
        <el-main>
          <div class="content">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.home {
  .content {
    background-color: #fff;
    padding: 15px;
    border-radius: 5px;
    height: 100%;
    box-sizing: border-box;
    position: relative;
  }
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 60px;
  }
}
</style>
<script>
import Asider from "../component/Asider";
import Header from "../component/Header";
export default {
  components: {
    Asider,
    Header,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
