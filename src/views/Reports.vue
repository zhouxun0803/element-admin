<template>
  <div class="reports">
    <div class="header" style="margin-bottom: 20px">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <v-chart class="chart" :option="option" />
  </div>
</template>
<script>
import "vue-echarts";
import "echarts";
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
          title: "数据统计",
        },
        {
          title: "数据报表",
        },
      ],
      option: {
        toolbox: {
          right: 30,
          feature: {
            saveAsImage: {},
          },
        },
        color: ["#cf6c69", "#687782", "#8bb7bd", "#dca28e", "#add3c1"],
        title: {
          text: "折线图",
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,0.5)", //通过设置rgba调节背景颜色与透明度
          borderWidth: "0",
          fontSize: 12,
          textStyle: {
            color: "#fff",
          },
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        // legend: {
        //   data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"],
        // },
        // grid: {
        //   left: "3%",
        //   right: "4%",
        //   bottom: "3%",
        //   containLabel: true,
        // },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            // type: "value",
          },
        ],
        // series: [
        //   {
        //     name: "邮件营销",
        //     type: "line",
        //     stack: "总量",
        //     areaStyle: {},
        //     emphasis: {
        //       focus: "series",
        //     },
        //     data: [120, 132, 101, 134, 90, 230, 210],
        //   },
        // {
        //   name: "联盟广告",
        //   type: "line",
        //   stack: "总量",
        //   areaStyle: {},
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [220, 182, 191, 234, 290, 330, 310],
        // },
        // {
        //   name: "视频广告",
        //   type: "line",
        //   stack: "总量",
        //   areaStyle: {},
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [150, 232, 201, 154, 190, 330, 410],
        // },
        // {
        //   name: "直接访问",
        //   type: "line",
        //   stack: "总量",
        //   areaStyle: {},
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [320, 332, 301, 334, 390, 330, 320],
        // },
        // {
        //   name: "搜索引擎",
        //   type: "line",
        //   stack: "总量",
        //   label: {
        //     show: true,
        //     position: "top",
        //   },
        //   areaStyle: {},
        //   emphasis: {
        //     focus: "series",
        //   },
        //   data: [820, 932, 901, 934, 1290, 1330, 1320],
        // },
        // ],
      },
    };
  },
  methods: {
    getrEports() {
      this.$apis.getrEports().then((res) => {
        console.log(res);
        this.option = res.data;
      });
    },
  },
  mounted() {
    this.getrEports();
  },
};
</script>

<style scoped lang="scss">
.reports {
  height: 100%;
  .chart {
    width: 800px;
    height: 600px;
    background: #eeeeee;
  }
}
</style>