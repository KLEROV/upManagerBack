<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <crudOperation :permission="permission" />
            <!--表单组件-->
            <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px">
                <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
                    <el-form-item label="id">
                        <el-input v-model="form.id" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="upId">
                        <el-input v-model="form.upId" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="平台">
                        <el-select v-model="form.productLine" placeholder="请选择平台">
                            <el-option label="cl1" value="1"></el-option>
                            <el-option label="cl2" value="2"></el-option>
                            <el-option label="cl3" value="3"></el-option>
                            <el-option label="cl4" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模式">
                        <el-select v-model="form.costModel" placeholder="请选择模式">
                            <el-option label="销售额(金币)" value="1"></el-option>
                            <el-option label="播放量" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="扣量">
                        <el-input v-model="form.costs" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="form.price" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="分成">
                        <el-input v-model="form.divide" style="width: 370px;" />
                    </el-form-item>
                    <!-- <el-form-item label="创建时间">
                        <el-input v-model="form.createTime" style="width: 370px;" />
                    </el-form-item> -->
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="crud.cancelCU">取消</el-button>
                    <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
                </div>
            </el-dialog>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <!-- <el-table-column prop="id" label="id" />
                <el-table-column prop="upId" label="upId" /> -->
                <el-table-column prop="costModel" label="costModel" />
                <el-table-column prop="costs" label="计费、扣量" />
                <el-table-column prop="price" label="单价" />
                <el-table-column prop="divide" label="divide" />
                <el-table-column prop="productLine" label="所属产品线" />
                <el-table-column prop="createTime" label="createTime" width="140" />
                <!-- <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column v-if="checkPer(['admin','upUser:edit','upUser:del'])" label="操作" width="150px" align="center" fixed="right">
                    <template slot-scope="scope">
                        <udOperation :data="scope.row" :permission="permission" />
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
        </div>
    </div>
</template>

<script>
import crudupUser from '@/api/upUser/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, upId: null, costModel: null, costs: null, price: null, divide: null, productLine: null, createTime: null }
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "扣量",
      url: "api/UPUser",
    //   url: "/api/logs/error",
      sort: "id,asc",
      crudMethod: { ...crudupUser },
      optShow: {
          add: true,
          edit: true,
          del: true,
          reset: false
        },
    });
  },
  data() {
    return {
      permission: {
        add: ['admin', 'upUser:add'],
        edit: ['admin', 'upUser:edit'],
        del: ['admin', 'upUser:del']
      },
      rules: {
      }    
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
        console.log(1)
      return true
    }
  }
}
</script>

<style scoped>
</style>
