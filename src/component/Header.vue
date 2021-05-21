<template>
  <div class="header">
    <div class="record">
      <router-link
        v-for="(item, index) in recordList"
        :key="index"
        :to="item.path"
      >
        <el-tag
          style="margin: 0 5px"
          closable
          type="success"
          @close.stop.prevent="handleClose(index)"
        >
          {{ item.title }}
        </el-tag>
      </router-link>
    </div>
    <div class="login">
      <!-- <el-switch
      v-model="skinSwitch"
      active-text="☀"
      inactive-text="☽"
      active-color="#13ce66"
      inactive-color="#ff4949"
      @change="switchClick"
    >
    </el-switch> -->
      <el-dropdown>
        <img src="../assets/user.jpg" alt="" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="quit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span style="z-index: 99">{{ $store.state.username }}</span>
    </div>
  </div>
</template>

<script>
import bus from "../assets/eventBus";
export default {
  data() {
    return {
      skinSwitch: "",
      recordList: [],
      routeName: "",
    };
  },
  methods: {
    quit() {
      this.$store.commit("login", {
        token: "",
        username: "",
      });
      localStorage.clear("recordList");
      this.$router.push({ name: "Login" });
    },
    handleClose(index) {
      this.recordList.splice(index, 1);
      localStorage.setItem("recordList", JSON.stringify(this.recordList));
    },
  },
  watch: {
    $route() {
      localStorage.setItem("recordList", JSON.stringify(this.recordList));
      // console.log(this.recordList);
      var newArr = [];
      var arrId = [];
      for (var item of this.recordList) {
        if (arrId.indexOf(item["title"]) == -1) {
          arrId.push(item["title"]);
          newArr.push(item);
        }
      }
      this.recordList = newArr;
    },
  },
  mounted() {
    bus.$on("record", (item) => {
      this.recordList.push({ path: item.path, title: item.authName });
    });
    this.recordList = JSON.parse(localStorage.getItem("recordList")) || [];
  },
};
</script>

<style scoped lang="scss">
.header {
  height: 60px;
  position: relative;
  .record {
    width: 90%;
    overflow: hidden;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    left: 25px;
    z-index: 9;
    ::v-deep span {
      position: relative;
    }
  }
  .el-dropdown {
    height: 60px;
    display: inline-flex;
    align-items: center;
    background: #fff;
    z-index: 66;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 8px;
      cursor: pointer;
      margin-right: 50px;
    }
  }
  ::v-deep span {
    position: absolute;
    right: 0px;
    font-size: 14px;
  }
}
</style>
