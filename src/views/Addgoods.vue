<template>
  <div class="addgoods" ref="scroll">
    <div class="header">
      <Crumbs :breadcrumb="breadcrumb"></Crumbs>
    </div>
    <div class="main">
      <el-alert
        style="margin: 30px 0"
        show-icon
        title="添加商品信息"
        type="info"
        center
        :closable="false"
      ></el-alert>
      <div class="steps">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
        </el-steps>
      </div>
      <el-tabs :tab-position="'left'" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form
            :model="addGoodsForm"
            :rules="rules"
            ref="addGoodsForm"
            label-width="100px"
            class="demo-addGoodsForm"
            label-position="top"
          >
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="goodsList"
                @change="handleChange()"
                :props="goodslists"
                ref="goodsForm"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <template v-for="item in getGoodsManyAttrVals">
            <div :key="item.attr_id" v-if="item.attr_vals.length >= 0">
              <span>{{ item.attr_name }}</span> :
              <el-checkbox
                style="margin: 5px"
                v-for="(_item, index) in item.attr_vals"
                :key="index"
                border
                checked
                @change="closeAttrVals(item, index)"
              >
                {{ _item }}
              </el-checkbox>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form
            label-width="100px"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-form-item
              v-for="item in getGoodsOnlyList"
              :key="item.ttr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            list-type="picture"
            action=""
            :auto-upload="true"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="uploadChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <div class="editorBox">
            <!-- 调用富文本编辑器? -->
            <quill-editor
              ref="myText"
              v-model="addGoodsForm.goods_introduce"
              :config="froalaConfig"
              class="editor"
            >
            </quill-editor>
            <el-button type="primary" @click="addGoodsSubmit" class="submitBtn"
              >添加商品</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <iframe src="https://www.baidu.com" frameborder="0"></iframe> -->
    <el-dialog title="剪切图片" :visible.sync="dialogVisible">
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="clipOption.img"
          :autoCrop="clipOption.autoCrop"
        ></vueCropper>
        <div class="cropper_but">
          <el-button-group style="margin-right: 20px">
            <el-button
              type="primary"
              icon="el-icon-remove-outline"
              @click="scaleSmall"
            ></el-button>
            <el-button type="primary" @click="scaleBig"
              ><i class="el-icon-circle-plus-outline"></i
            ></el-button>
          </el-button-group>
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              @click="rotateLeft"
            ></el-button>
            <el-button type="primary" @click="rotateRight"
              ><i class="el-icon-refresh-right"></i
            ></el-button>
          </el-button-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clipImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor,
  },
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
      active: 0,
      addGoodsForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: [],
        attrs: [],
        prcs: [],
        goods_introduce: "",
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 获取商品列表
      goodsList: [],
      value: [],
      goodslists: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 获取商品参数
      getGoodsManyAttrVals: [],

      // 获取商品属性
      getGoodsOnlyList: [],

      fileList: [],
      fileImg: null,
      clipOption: {
        img: "",
        autoCrop: true,
        outputType: this.fileImg?.raw.type,
      },
      // 添加商品
      froalaConfig: {
        toolbarButtons: [
          "undo",
          "redo",
          "clearFormatting",
          "|",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "|",
          "fontFamily",
          "fontSize",
          "color",
          "|",
          "paragraphFormat",
          "align",
          "formatOL",
          "formatUL",
          "outdent",
          "indent",
          "quote",
          "-",
          "insertLink",
          "insertImage",
          "insertVideo",
          "embedly",
          "insertFile",
          "insertTable",
          "|",
          "emoticons",
          "specialCharacters",
          "insertHR",
          "selectAll",
          "|",
          "print",
          "spellChecker",
          "help",
          "|",
          "fullscreen",
        ], //['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'embedly', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],//显示可操作项
        // theme: "dark",//主题
        placeholder: "请填写内容",
        language: "zh_cn", //国际化
        imageUploadURL: this.$action + "upload", //上传url
        fileUploadURL: "http://i.froala.com/upload", //上传url 更多上传介绍 请访问https://www.froala.com/wysiwyg-editor/docs/options
        quickInsertButtons: ["image", "table", "ul", "ol", "hr"], //快速插入项
        // toolbarVisibleWithoutSelection: true,//是否开启 不选中模式
        // disableRightClick: true,//是否屏蔽右击
        colorsHEXInput: false, //关闭16进制色值
        toolbarSticky: true, //操作栏是否自动吸顶
        zIndex: 99999,
        events: {
          "froalaEditor.initialized": function () {
            console.log("initialized");
          },
        },
      },
      dialogVisible: false,
    };
  },
  methods: {
    // 商品数据列表
    categories() {
      this.$apis.categories({ type: 3 }).then((res) => {
        this.goodsList = res.data;
      });
    },
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = [];
      }
    },

    // 获取商品参数
    closeAttrVals(item, index) {
      this.getGoodsManyAttrVals.map((_item) => {
        if (item == _item) {
          _item.attr_vals.splice(index, 1);
        }
      });
    },
    uploadChange(file) {
      this.clipOption.img = file.url;
      this.fileImg = file;
      this.dialogVisible = true;
    },

    clipImg() {
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        console.log(data);
        let obj = new FormData(); //创建一个form对象,必须是form对象否则后端接受不到数据
        obj.append(
          "file",
          new window.File([data], this.fileImg.name, {
            type: data.type,
          })
        ); //append 向form表单添加数据
        this.$apis.uploadImg(obj).then((res) => {
          const url = res.data.url.replace("localhost:", "localhost:8889");
          this.fileList.unshift({ name: res.data.tmp_path, url });
        });
      });
      this.dialogVisible = false;
    },
    // 缩放图片
    scaleSmall() {
      this.$refs.cropper.changeScale(-10);
    },
    scaleBig() {
      this.$refs.cropper.changeScale(10);
    },
    // 旋转图片
    rotateLeft() {
      this.$refs.cropper.rotateRight();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },

    // 删除图片
    handleRemove(file) {
      let fileTmpPath = file.url;
      this.fileList.forEach((item, index) => {
        if (item.url === fileTmpPath) {
          this.fileList.splice(index, 1);
        }
      });
    },

    // 添加商品
    addGoodsSubmit() {
      this.$refs.addGoodsForm.validate().then(() => {
        this.fileList.map((item) => {
          this.addGoodsForm.prcs.push({ pic: item.url });
        });

        if (this.getGoodsManyAttrVals != "") {
          this.getGoodsManyAttrVals.forEach((item) => {
            this.addGoodsForm.attrs.push({
              attr_id: item.attr_id,
              attr_vals: item.attr_vals.join(","),
            });
          });
        }

        if (this.getGoodsOnlyList != "") {
          this.getGoodsOnlyList.forEach((item) => {
            this.addGoodsForm.attrs.push({
              attr_id: item.attr_id,
              attr_vals: item.attr_vals,
            });
          });
        }

        this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(",");
        this.$apis.addGoodsSubmit(this.addGoodsForm).then((res) => {
          this.$router.push({ name: "Goods" });
        });
        // this.$refs.addGoodsForm.resetFields();
      });
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length != 3) {
        this.$message({
          type: "error",
          message: "请选择三级分类",
        });
        return false;
      } else if (activeName === "1") {
        this.active = 2;
        // 获取商品参数
        this.$apis
          .getGoodsMany(
            this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
          )
          .then((res) => {
            this.getGoodsManyAttrVals = res.data;
            this.getGoodsManyAttrVals.map((item) => {
              item.attr_vals = item.attr_vals.split(",");
            });
          });
        // 获取商品属性
        this.$apis
          .getGoodsOnly(
            this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
          )
          .then((res) => {
            this.getGoodsOnlyList = res.data;
          });
      } else if (activeName === "2") {
        // this.addGoodsForm.attrs = [];
        this.active = 3;
        // if (this.getGoodsManyAttrVals != "") {
        //   this.getGoodsManyAttrVals.forEach((item) => {
        //     this.addGoodsForm.attrs.push({
        //       attr_id: item.attr_id,
        //       attr_vals: item.attr_vals.join(","),
        //     });
        //   });
        // }
        // // 获取商品属性
        // this.$apis
        //   .getGoodsOnly(
        //     this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1]
        //   )
        //   .then((res) => {
        //     this.getGoodsOnlyList = res.data;
        //   });
      } else if (activeName === "3") {
        this.active = 4;
        // if (this.getGoodsOnlyList != "") {
        //   this.getGoodsOnlyList.forEach((item) => {
        //     this.addGoodsForm.attrs.push({
        //       attr_id: item.attr_id,
        //       attr_vals: item.attr_vals,
        //     });
        //   });
        // }
      } else if (activeName === "4") {
        this.active = 5;
      }
    },
  },
  mounted() {
    this.categories();
  },
};
</script>

<style scoped lang="scss">
.addgoods {
  height: 100%;
  overflow: auto;
  ::v-deep .cropper {
    height: 400px;

    .cropper_but {
      position: absolute;
      bottom: 10px;
    }
  }
}
</style>
