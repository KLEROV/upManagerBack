<!---->
<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          
            <!-- 搜索 -->
            <el-input
              v-model="query.upId"
              clearable
              size="small"
              placeholder="UP主ID"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <el-input
              v-model="query.id"
              clearable
              size="small"
              placeholder="结算ID"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <el-select
              v-model="query.verifyState"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="handleClick"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-select
              v-model="query.takingMode"
              clearable
              size="small"
              placeholder="结算方式"
              class="filter-item"
              style="width: 90px"
              @change="handleClick"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <rrOperation />
            
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <!-- <crudOperation :permission="permission" /> -->
            <!--表单组件-->
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="结算id" />
                <el-table-column prop="upId" label="upId">
                </el-table-column>
                <el-table-column prop="bankUser" label="昵称" />
                <el-table-column prop="amount" label="提现金额（元）" />
                <el-table-column prop="bankCard" label="提现账号" />
                <el-table-column prop="takingMode" label="提现方式">
                    <template slot-scope="scope">
                        <div>{{scope.row.takingMode==1?'银行卡':'USDT'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="verifyState" label="状态" >
                    <template slot-scope="scope">
                        <div v-if='scope.row.verifyState==0'>{{scope.row.verifyState==0?'未审核':''}}</div>
                        <div v-if='scope.row.verifyState==1'>{{scope.row.verifyState==1?'已通过':''}}</div>
                        <div v-if='scope.row.verifyState==2'>{{scope.row.verifyState==2?'驳回':''}}:{{scope.row.remark}}</div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='detail(scope.row)'>详情</el-button>
                        <el-button type="text" size="small" @click='check(scope.row,1)' v-if='scope.row.verifyState==0'>通过</el-button>
                        <el-button type="text" size="small" @click='check(scope.row,2)'>驳回</el-button>
                        <!-- <el-button type="text" size="small" @click='check(scope.row,1)'>通过</el-button>
                        <el-button type="text" size="small" @click='check(scope.row,2)'>驳回</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModel" :title="dialogTitle" width="600px">
                <el-form ref="form" :model="dialogForm" :rules="rules" size="small" label-width="120px">
                    <div v-if='passStatus'>
                        <div v-if='dialogForm.takingMode!=2'>
                            <el-form-item label="银行卡帐号">
                                <div class='border'>{{dialogForm.bankCard}}</div>
                            
                            </el-form-item>
                            <el-form-item label="收款人姓名">
                                <div class='border'>{{dialogForm.bankUser}}</div>
                                
                            </el-form-item>
                            <el-form-item label="所属支行">
                                <div class='border'>{{dialogForm.bankDeposit}}</div>
                            </el-form-item>
                        </div>
                        <el-form-item label="USDT钱包地址" v-else>
                            <div class='border'>{{dialogForm.usdtAddr}}</div>
                        </el-form-item>
                     </div>
                     <div v-else>
                         <el-form-item label="快捷理由(单选)">
                            <el-select v-model="dialogForm.reason" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.display_name"
                                :value="item.display_name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="自定义理由">
                            <el-input placeholder="请输入自定义理由" :show-button="false"  v-model="dialogForm.remark" type='textarea'/>
                        </el-form-item>
                     </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="dialogModel=false">取消</el-button>
                    <el-button :loading="dialogLoading" type="primary" @click="copy"  v-if='passStatus'>复制所有信息</el-button>
                    <el-button :loading="dialogLoading" type="primary" @click="submit"  v-else>提交</el-button>
                </div>
            </el-dialog>
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
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
const defaultForm = {upId:3}
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation,DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "",
      url: "api/upTakingRecord", 
      sort: "id,desc",
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
        add: ['admin', 'upOperation:add'],
        edit: ['admin', 'upOperation:edit'],
        del: ['admin', 'upOperation:del']
      },
      rules: {
      },
      options:[
        { display_name: '账号有误'},
        {display_name: '信息不全'}
      ],
      enabledTypeOptions:[
        { key: '1', display_name: '银行卡' },
        { key: '2', display_name: 'UTSD' },
      ],
      statusOptions:[
        { key: '0', display_name: '未审核' },
        { key: '1', display_name: '已通过' },
        { key: '2', display_name: '已驳回' },
      ],
      dialogModel:false,
      dialogForm:{},
      dialogLoading:false,
      dialogTitle:'编辑',
      passStatus:false
    }
  },
  mounted(){
    
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {      
      return true
    },
    detail(value){
        this.dialogTitle='详情';
        this.dialogForm={...value};
        this.dialogModel=true;
        this.passStatus=true;
    },
    check(value,status){
        this.dialogForm={...value};
        if(status==1){
            this.$confirm(`确认通过选中的数据提现?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dialogForm.verifyState=1;
                upTaking.setStatus(this.dialogForm).then(res=>{
                    this.$message.success('操作成功!');
                    this.crud.refresh();
                }).catch(err=>{
                    this.$message.error(err);
                })
            }).catch(() => {

            })
        }else{
            this.dialogTitle='驳回';
            this.dialogModel=true;
            this.passStatus=false;
        }
        
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.crud.form.id=undefined;
      this.imageUrl=null;
      this.crud.form.videoUrl=null;
     
      return true
    },
    [CRUD.HOOK.beforeToEdit]() {

      
    },
    async copy () {
        try {
            let msg='';
            if(this.dialogForm.takingMode==1){
                msg=`银行卡帐号:${this.dialogForm.bankCard}\n收款人姓名:${this.dialogForm.bankUser}\n所属支行:${this.dialogForm.bankDeposit}\n`;
            }else{
                msg=`${checkForm.value.usdtAddr}`;
            }
            
            await toClipboard(msg,document.getElementsByClassName('copy')[0]);
            this.$message.success('复制成功!');
        } catch (e) {
             this.$message.error('复制失败!!!');
            console.error(e);
        }
    },
    submit(){

        this.dialogLoading=true;
        if(!this.dialogForm.reason&&!this.dialogForm.remark){
            this.$message.error('驳回理由不能为空!');
            this.dialogLoading=false;
            return false;
        }
        if(!this.dialogForm.remark){
            this.dialogForm.remark=this.dialogForm.reason;
        }
        this.dialogForm.verifyState=2;
        upTaking.setStatus(this.dialogForm).then(res=>{
            this.$message.success('操作成功!');
            this.crud.refresh();
            this.dialogModel=false;
            this.dialogLoading=false;
        }).catch(err=>{
            this.$message.error(err);
            this.dialogLoading=false;
        })
        
    },
    handleClick(tab, event){
        console.log(tab, event);
    }
  }
}
</script>

<style scoped>
    :deep(.el-upload-list){
        /* display: none; */
    }
    .success{
        color:green;
    }
    .loading{
        color:#409eff;
    }
    .fail{
        color:red;
    }
    .border{
        border:1px solid black;
        padding-left:10px;
    }
</style>
