<template>
    <div class="app-container">
        <!--工具栏-->
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <template>
                <!-- <el-button  type="primary" size="small" @click='add'>查看</el-button> -->
                <el-button  type="primary" size="medium" @click='add'>新增</el-button>
            </template>
            <!--表单组件-->
            
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModel" :title="dialogTitle" width="600px">
                <el-form ref="form" :model="dialogForm" :rules="rules" size="small" label-width="120px">
            
                    <el-form-item label="key" >
                        <el-input v-model="dialogForm.key" style="width: 370px"/>
                    </el-form-item>
                    <el-form-item label="value">
                        <el-input v-model="dialogForm.value" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="dialogForm.remark" style="width: 370px;" type='textarea'/>
                    </el-form-item>
                   
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="dialogModel=false">取消</el-button>
                    <el-button :loading="dialogLoading" type="primary" @click="dialogSubmit">确认</el-button>
                </div>
            </el-dialog>
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <!-- <el-table-column prop="id" label="id"  width="55"/> -->
                <el-table-column prop="createTime" label="创建日期"/>
                <el-table-column prop="key" label="key">
                    
                </el-table-column>

                <el-table-column prop="value" label="value" />
                <el-table-column label="备注" width="150"  prop="remark">
                    
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <!--  -->
                        <el-button type="text" size="small" @click='editModelShow(scope.row)'>编辑</el-button>
                        <el-button type="text" size="small" @click='deleteData(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column v-if="checkPer(['admin','upUser:edit'])" label="操作" width="150px" align="center" fixed="right">
                    <template slot-scope="scope">
                        <udOperation :data="scope.row" :permission="permission" />
                    </template>
                </el-table-column> -->
            </el-table>
            <!--分页组件-->
            <pagination />
        </div>
    </div>
</template>

<script>
import upTaking from '@/api/upTaking/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
const defaultForm = { id: null, upId: null, costModel: null, costs: null, price: null, divide: null, productLine: null, createTime: null }
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation,DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "扣量",
      url: "api/upTakingConfig",
      sort: "createTime,desc",
      crudMethod: { ...upTaking },
      optShow: {
          add: true,
          edit: false,
          del: false,
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
      },
      dialogModel:false,
      dialogForm:{},
      dialogLoading:false,
      dialogTitle:'编辑',
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToEdit]() {
        
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
        
        //   return true
    },
    handleClick(tab, event){
        console.log(tab, event);
    },
    editModelShow(value){
        this.dialogTitle='编辑';
        this.dialogModel=true;
        this.dialogForm={...value};
    },
    dialogSubmit(){
        this.dialogLoading=true;
        if(!/^[0-9]\d*$/.test(this.dialogForm.value)){
            this.$message.error('请正确输入upId!');
            this.dialogLoading=false;
            return false
        }
        if(!/^[0-9]\d*$/.test(this.dialogForm.key)){
            this.$message.error('请正确输入upId!');
            this.dialogLoading=false;
            return false
        }
        let fun=upTaking.add;
        if(this.dialogTitle!='添加'){
            fun=upTaking.edit;
        }
        
        fun(this.dialogForm).then(res=>{
            this.$message.success('操作成功!');
            this.crud.refresh();
            this.dialogForm={};
            this.dialogModel=false;
            this.dialogLoading=false;
        }).catch(err=>{
            this.$message.error(err);
            this.dialogLoading=false;
        })
    },
    selectionChangeHandler(val){
        if(val&&val.length==1){
            this.active=val[0];
        }else{
            this.active=null;
        }
    },
    add(){
        this.dialogTitle='添加';
        this.dialogForm={};
        this.dialogModel=true;
    },
    deleteData(value){
        console.log(value);
        this.$confirm(`确认删除选中的数据?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            upTaking.del([value.id]).then(res=>{
                this.$message.success('操作成功!');
                this.crud.refresh();
            }).catch(err=>{
                
                this.$message.error(err);
            })
        }).catch(() => {
        })
    }
  }
}
</script>

<style scoped>
:deep(.el-button--danger){
    display: none;
}
</style>
