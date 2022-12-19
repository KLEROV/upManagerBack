<template>
    <div class="app-container">
        <!--工具栏-->
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <div>
                <el-input
                v-model="query.id"
                clearable
                size="small"
                placeholder="提现订单"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
                />
                <date-range-picker v-model="query.createTime" class="date-item" />
                <el-select
                v-model="query.takingMode"
                clearable
                size="small"
                placeholder="提现方式"
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
            </div>
            
            <template>
                <!-- <el-button  type="primary" size="small" @click='add'>查看</el-button> -->
                <el-button  type="primary" size="medium" @click='add' style='margin-top:15px;'>提现</el-button>
            </template>
            <!--表单组件-->
            
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModel" :title="dialogTitle" width="600px">
                <el-form ref="form" :model="dialogForm" :rules="rules" size="small" label-width="120px">
                    <el-form-item label="提现方式" >
                        <el-radio-group v-model="dialogForm.takingMode">
                            <el-radio :label="1">银行卡</el-radio>
                            <el-radio :label="2">USDT</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="提现金额">
                        <el-input v-model="dialogForm.amount" style="width: 370px;" />
                    </el-form-item>
                    <div v-if='dialogForm.takingMode!=2'>
                        <el-form-item label="银行卡卡号">
                            <el-input v-model="dialogForm.bankCard" style="width: 370px;" />
                        </el-form-item>
                        <el-form-item label="持卡人">
                            <el-input v-model="dialogForm.bankUser" style="width: 370px;" />
                        </el-form-item>
                        <el-form-item label="开户行">
                            <el-input v-model="dialogForm.bankDeposit" style="width: 370px;" />
                        </el-form-item>
                    <el-form-item label="手机号">
                            <el-input v-model="dialogForm.phone" style="width: 370px;" />
                        </el-form-item>
                    </div>
                    
                    <el-form-item label="USDT钱包地址" v-else>
                        <el-input v-model="dialogForm.usdtAddr" style="width: 370px;" />
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
                <el-table-column prop="id" label="提现时间"/>
                <el-table-column prop="id" label="提现ID"/>
                <el-table-column prop="amount" label="提现总额(元)"></el-table-column>
                <el-table-column prop="takingAmount" label="提现方式">
                    <template slot-scope="scope">
                        <div>{{scope.row.takingMode==1?'银行卡':'USDT'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="状态">
                    <template slot-scope="scope">
                        <div v-if='scope.row.verifyState==0'>{{scope.row.verifyState==0?'未审核':''}}</div>
                        <div v-if='scope.row.verifyState==1'>{{scope.row.verifyState==1?'已通过':''}}</div>
                        <div v-if='scope.row.verifyState==2'>{{scope.row.verifyState==2?'驳回':''}}:{{scope.row.remark}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
        </div>
    </div>
</template>

<script>
import upWithdraw from '@/api/upWithdraw/index'
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
      url: "api/upOperation/queryTakingRecordByUp",
      sort: "createTime,desc",
      crudMethod: { ...upWithdraw },
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
      enabledTypeOptions:[
        { key: '1', display_name: '银行' },
        { key: '2', display_name: 'USDT' },
      ],
      active:true,
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
        if(this.dialogForm.takingMode==1){
            if(!/^[1-9]\d*$/.test(this.dialogForm.bankCard)){
                this.$message.error('请正确输入银行卡卡号!');
                this.dialogLoading=false;
                return false
            }
            if(this.dialogForm.bankUser==undefined||this.dialogForm.bankUser.replace(new RegExp(/( )/g),"")==''){
                this.$message.error(`持卡人不能为空!!!`);
                this.dialogLoading=false;
                return false;
            }
            if(this.dialogForm.bankDeposit==undefined||this.dialogForm.bankDeposit.replace(new RegExp(/( )/g),"")==''){
                this.$message.error(`开户行不能为空!!!`);
                this.dialogLoading=false;
                return false;
            }
            if(this.dialogForm.phone==undefined||this.dialogForm.phone.replace(new RegExp(/( )/g),"")==''){
                this.$message.error(`手机号不能为空!!!`);
                this.dialogLoading=false;
                return false;
            }
            delete this.dialogForm.usdtAddr;
        }else{
            if(this.dialogForm.usdtAddr==undefined||this.dialogForm.usdtAddr.replace(new RegExp(/( )/g),"")==''){
                this.$message.error(`USDT钱包地址不能为空!!!`);
                this.dialogLoading=false;
                return false;
            }
            delete this.dialogForm.bankCard;
            delete this.dialogForm.bankUser;
            delete this.dialogForm.bankDeposit;
            delete this.dialogForm.phone;
        }
        if(!/^[1-9]\d*$/.test(this.dialogForm.amount)){
            this.$message.error('请正确输入提现金额!');
            this.dialogLoading=false;
            return false
        }
        let fun=upWithdraw.edit;
        fun(this.dialogForm).then(res=>{
            if(res.code==200){
                this.$message.success('操作成功!');
                this.crud.refresh();
                this.dialogForm={};
                this.dialogModel=false;
                this.dialogLoading=false;
            }else{
                this.$message.error(res.msg);
                this.dialogLoading=false;
            }
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
        this.dialogTitle='提现';
        this.dialogForm={takingMode:1};
        this.dialogModel=true;
    },
  }
}
</script>

<style scoped>
:deep(.el-button--danger){
    display: none;
}
</style>
