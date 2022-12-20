<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
           
          <div>
            <!-- 搜索 -->
            <el-input
              v-model="query.id"
              clearable
              size="small"
              placeholder="UP主ID"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <!-- <el-select
              v-model="query.type"
              clearable
              size="small"
              placeholder="模式"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select> -->
            <rrOperation />
          </div>
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <template>
                <!-- <el-button  type="primary" size="small" @click='add'>查看</el-button> -->
                <el-button  type="primary" size="medium" @click='add' :disabled='active==null'>新增</el-button>
            </template>
            <!--表单组件-->
            
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModel" :title="dialogTitle" width="600px">
                <el-form ref="form" :model="dialogForm" :rules="rules" size="small" label-width="120px">
                    <!--<el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="cl1" name="first">
                            <el-form-item label="id">
                                <el-input v-model="form.id" style="width: 370px;" />
                            </el-form-item>
                            <el-form-item label="upId">
                                <el-input v-model="form.upId" style="width: 370px;" />
                            </el-form-item>
                            <el-form-item label="平台">
                                <el-select v-model="form.productLine" placeholder="请选择平台">
                                    <el-option label="cl1" value="cl1"></el-option>
                                    <el-option label="cl2" value="cl2"></el-option>
                                    <el-option label="cl3" value="cl3"></el-option>
                                    <el-option label="cl4" value="cl4"></el-option>
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
                        </el-tab-pane>
                        <el-tab-pane label="cl2" name="second">
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
                        </el-tab-pane>
                        <el-tab-pane label="cl3" name="third">角色管理</el-tab-pane>
                        <el-tab-pane label="cl4" name="fourth">定时任务补偿</el-tab-pane>
                    </el-tabs> -->
                    <el-form-item label="upId" >
                        <el-input v-model="dialogForm.upId" style="width: 370px"/>
                    </el-form-item>
                    <el-form-item label="平台">
                        <el-select v-model="dialogForm.productLine" placeholder="请选择平台" @change='change'>
                            <el-option  v-for='(item,index) in productLine' :label="item.key" :value="item.key" :key='index'></el-option>
                            <!-- <el-option label="cl2" value="2"></el-option>
                            <el-option label="cl3" value="3"></el-option>
                            <el-option label="cl4" value="4"></el-option> -->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="模式">
                        <el-select v-model="dialogForm.costModel" placeholder="请选择模式">
                            <el-option label="销售额(金币)" :value="1"></el-option>
                            <el-option label="播放量" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="扣量">
                        <el-input v-model="dialogForm.costs" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="dialogForm.price" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item label="分成">
                        <el-input v-model="dialogForm.divide" style="width: 370px;" />
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
                <el-table-column prop="upId" label="upId"  width="55"/>
                <el-table-column prop="headUrl" label="头像" width="150">
                    <template slot-scope="scope">
                        <img :src='scope.row.headUrl' style='width:100%'/>
                    </template>
                </el-table-column>

                <el-table-column prop="nickName" label="昵称" />
                <el-table-column label="扣量设置" width="250">
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.costModel" :key='index'>
                            {{item.productLine}}:{{item.costModel==1?'销售额':'播放量'}},单价{{item.price?item.price:0}}元/扣量{{item.costs?item.costs:0}}%/分成{{item.divide?item.divide:0}}%
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="createTime" width="140" />
                <el-table-column fixed="right" label="操作" width="60">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small">查看</el-button> -->
                        <el-button type="text" size="small" @click='editModelShow(scope.row)'>编辑</el-button>
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
import crudupUser from '@/api/upUser/index'
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
      url: "api/UPUser",
      sort: "createTime,desc",
      crudMethod: { ...crudupUser },
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
      enabledTypeOptions: [
        { key: '1', display_name: '销售额' },
        { key: '2', display_name: '播放量' },
        
      ],
      productLine:[
        { key: 'CL01', display_name: 'CL01' },
        { key: 'CL02', display_name: 'CL02' },
        { key: 'CL03', display_name: 'CL03' },
        { key: 'CL04', display_name: 'CL04' },
      ],
      active:null,
      dialogModel:false,
      dialogForm:{},
      dialogLoading:false,
      dialogTitle:'编辑',
      baseData:null
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
    change(value){
        if(this.dialogTitle=='编辑'){
            const oldProductLine=this.dialogForm.productLine;
            const newVlue=this.baseData.costModel.find(item=>value==item.productLine);
            if(!newVlue){
                this.$message.error(`请先添加${value}产品线扣量设置!`);
                this.dialogForm.productLine=this.dialogForm.productLineBack;
                return false;
            }
            this.dialogForm={...newVlue};
            this.dialogForm.upId=this.baseData.upId;
            this.dialogForm.productLineBack=this.dialogForm.productLine;
            this.dialogForm.id=this.dialogForm.costId;
        }
    },
    handleClick(tab, event){
        console.log(tab, event);
    },
    editModelShow(value){
        this.dialogTitle='编辑';
        if(!value.costModel){
            this.$message.error('该up主扣量设置为空,请先添加!');
            this.dialogLoading=false;
            return false
        }
        this.dialogModel=true;
        this.baseData={...value};
        this.dialogForm={...value.costModel[0]};
        this.dialogForm.upId=value.upId;
        this.dialogForm.productLineBack=this.dialogForm.productLine;
        this.dialogForm.id=this.dialogForm.costId;
       
    },
    dialogSubmit(){
        this.dialogLoading=true;
        if(!/^[1-9]\d*$/.test(this.dialogForm.upId)){
            this.$message.error('请正确输入upId!');
            this.dialogLoading=false;
            return false
        }
        if(!this.dialogForm.productLine){
            this.$message.error('请选择产品线!');
            this.dialogLoading=false;
            return false
        }
        if(!this.dialogForm.costModel){
            this.$message.error('请选择模式!');
            this.dialogLoading=false;
            return false
        }
        let fun=crudupUser.add;
        if(this.dialogTitle!='添加'){
            fun=crudupUser.edit;
            delete this.dialogForm.costId;
            // delete this.dialogForm.productLineBack;
        }
        
        fun(this.dialogForm).then(res=>{
            this.$message.success('操作成功!');
            this.crud.refresh();
            this.baseData={};
            this.dialogForm={};
            this.dialogModel=false;
            this.dialogLoading=false;
            this.active=null;
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
        this.dialogForm.upId=this.active.upId;
        this.dialogModel=true;
    }
  }
}
</script>

<style scoped>
:deep(.el-button--danger){
    display: none;
}
</style>
