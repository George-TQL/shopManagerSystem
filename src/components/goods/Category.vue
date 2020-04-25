<template>
  <div class="page">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- table-tree -->
      <table-tree :data="categoryList" :columns="columns" 
                  :selection-type="false" :expand-type="false" 
                  show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" 
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </table-tree>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" 
                     @current-change="handleCurrentChange" 
                     :current-page="querInfo.pagenum" 
                     :page-sizes="[3, 5, 10, 15]" 
                     :page-size="querInfo.pagesize" 
                     layout="total, sizes, prev, pager, next, jumper" 
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类提示框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="60%"
      @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item prop="cat_name" label="分类名称：">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader  
                       :options="parentCateList" 
                       :props="cascaderProps" 
                       v-model="selectedKeys" 
                       @change="parentCateChanged" 
                       clearable
                       >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Category',
  components: {},
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      categoryList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '200px'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          width: '100px'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          width: '100px'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      total: 0,
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message:'请输入分类名称', trigger:'blur'}
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCategoyList()
  },
  methods: {
    async getCategoyList() {
      const { data: res } = await this.$http.get('categories',{
        params: this.querInfo
      })
      // console.log(res);
      
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }

      this.categoryList = res.data.result
      this.total = res.data.total
      // console.log(this.categoryList);
      
    },
    // 处理页面显示大小变化事件
    handleSizeChange(value) {
      this.querInfo.pagesize = value
      this.getCategoyList()
    },
    // 处理当前页变化事件
    handleCurrentChange(value) {
      this.querInfo.pagenum = value
      this.getCategoyList()
    },
    // 处理添加分类事件
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList() {
      const { data: res} = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      // console.log(res.data);
      
      this.parentCateList = res.data
    },
    // 添加分类对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 点击添加分类确定按钮
    addCategory() {
      this.$refs.addCateFormRef.validate( async valid => {
        if (!valid) {
          return
        }
        const { data: res} = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.getCategoyList()
        this.addCateDialogVisible = false
      })
    },
    // 级联选择器选中变化
    parentCateChanged() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }

    }

  },
}
</script>

<style scoped>
.zk-table {
  margin-top: 12px;
}
/* .el-form-item__label {
  width: 50px !important
} */
.el-cascader {
  width: 100%;
}
</style>
