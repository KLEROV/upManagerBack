<template>
    <div class="app-container">
        <!--工具栏-->
           
            <!-- <div>
          
                <el-date-picker v-model="query.totalDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='position:relative;top:-5px;'> </el-date-picker>
                <el-button icon="el-icon-search" style='position:relative;top:-5px;' type="primary" @click='search'>搜索</el-button>
            </div> -->
    
           
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID"/>
                <el-table-column prop="upId" label="up主ID"/>
                <el-table-column prop="userId" label="用户id"/>
                <!-- <el-table-column prop="nickName" label="主播昵称"/> -->
                <el-table-column prop="userCode" label="产品线用户code" width="120"/>
                <el-table-column prop="type" label="订阅类型">
                    <template slot-scope="scope">
                        <div v-if='scope.row.type==1'>月</div>
                        <div v-if='scope.row.type==2'>季</div>
                        <div v-if='scope.row.type==3'>年</div>
                    </template>
                </el-table-column>
                <el-table-column prop="day" label="订阅天数"/>
                <el-table-column prop="coins" label="金币数"/>
                <el-table-column prop="productLine" label="产品线"/>
                <el-table-column prop="createTime" label="创建时间" width="140"/>
                <!-- <el-table-column prop="costs" label="扣量比">
                    <template slot-scope="scope">
                        <div>{{scope.row.costs?scope.row.costs:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="单价">
                    <template slot-scope="scope">
                        <div>{{scope.row.price?scope.row.price:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="divide" label="分成比">
                    <template slot-scope="scope">
                        <div>{{scope.row.divide?scope.row.divide:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="costAfter" label="扣量后">
                    <template slot-scope="scope">
                        <div>{{scope.row.costAfter?scope.row.costAfter:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="profitAfter" label="分成后">
                    <template slot-scope="scope">
                        <div>{{scope.row.profitAfter?scope.row.profitAfter:0}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="profitBefore" label="分成前">
                    <template slot-scope="scope">
                        <div>{{scope.row.profitBefore?scope.row.profitBefore:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="costModel" label="扣量模式">
                    <template slot-scope="scope">
                        <div v-if='scope.row.costModel==1'>销售额</div>
                        <div v-if='scope.row.costModel==2'>播放量</div>
                    </template>
                </el-table-column> -->
                
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
      url: "api/UPUser/querySubscribe",
      sort: "id,desc",
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
        { key: '1', display_name: '银行卡' },
        { key: '2', display_name: 'USDT(TRC20)' },
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
    timeModel(val){
        const month=[['Jan',1],['Feb',2],['Mar',3],['Apr',4],['May',5],['Jun',6],['Jul',7],['Aug',8],['Sep',9],['Oct',10],['Nov',11],['Dec',12]];
        let time=val;
        time=time.slice(0,time.indexOf('00:00:00')-1).replace(new RegExp(/( )/g),',');
        const monthGet=month.find(item=>time.indexOf(item[0])>0);
        time=time.replace(monthGet[0],monthGet[1]).split(',');
        return `${time[3]}-${time[1]}-${time[2]}`;
    },
    search(){
        if(this.crud.query.totalDate){
            this.crud.query.startTime=this.timeModel(this.crud.query.totalDate[0].toString())
            this.crud.query.endTime=this.timeModel(this.crud.query.totalDate[1].toString())
        }
        this.crud.toQuery();
    },
    selectionChangeHandler(val){
        if(val&&val.length==1){
            this.active=val[0];
        }else{
            this.active=null;
        }
    },
   
  }
}
</script>

<style scoped>
:deep(.el-button--danger){
    display: none;
}
</style>
