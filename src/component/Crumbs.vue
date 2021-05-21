<template>
  <div class="crumbs">
    <el-breadcrumb :separator="separator">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumb"
        :key="index"
        :to="headleBreadcrumb(item.name)"
        >{{ item.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    breadcrumb: {
      type: Array,
    },
    separator: {
      type: String,
      default: "/",
    },
  },
  methods: {
    headleBreadcrumb(val) {
      if (val) {
        return { name: val };
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
