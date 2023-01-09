<!---->
<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          
            <!-- 搜索 -->
            <div>

            
            <el-input
              v-model="query.upId"
              clearable
              size="small"
              placeholder="UP主ID"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
          
            <el-date-picker v-model="query.totalDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style='position:relative;top:-5px;' format='yyyy-MM-dd'> </el-date-picker>
            <el-select
              v-model="query.costModel"
              clearable
              size="small"
              placeholder="模式"
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
            <el-button icon="el-icon-search" style='position:relative;top:-5px;' type="primary" @click='search'>搜索</el-button>
            </div>
            <!-- <el-button type="text" size="small" @click='edit(scope.row)'>搜索</el-button> -->
            <!-- <rrOperation /> -->
            
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <!-- <crudOperation :permission="permission" /> -->
            <!--表单组件-->
            <ul class='total'>
                <li>平台收益:{{total.totalOwen?total.totalOwen:0}}</li>
                <li>总收益:{{total.totalProfitBefore?total.totalProfitBefore:0}}</li>
                <li>up主收益:{{total.totalProfitAfter?total.totalProfitAfter:0}}</li>
            </ul>
           
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="upId" label="upId">
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" />
                <el-table-column prop="costModel" label="模式">
                    <template slot-scope="scope">
                        <div>{{scope.row.costModel==1?'销售量':'播放量'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="videoUrl" label="扣量数据" >
                    <template slot-scope="scope">
                        <div>{{scope.row.costModel==1?'销售':'播放'}}未扣量:{{scope.row.costBefore?scope.row.costBefore:0}}</div>
                        <div>{{scope.row.costModel==1?'销售':'播放'}}扣量后:{{scope.row.costAfter?scope.row.costAfter:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="profitBefore" label="收益（分成前）" >
                    <template slot-scope="scope">
                        <div>{{scope.row.profitBefore?scope.row.profitBefore:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="profitAfter" label="收益（分成后）" >
                    <template slot-scope="scope">
                        <div>{{scope.row.profitAfter?scope.row.profitAfter:0}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="totalDate" label="时间" />
                
                <!-- <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
                        <el-button type="text" size="small" @click='edit(scope.row,1)'>播放</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <!--分页组件-->
            <pagination />
        </div>
    </div>
</template>

<script>
import crudupUser from '@/api/admin/index'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
const defaultForm = {upId:3}
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation,DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "",
      url: "api/UPUser/upDetailedTotal",
      sort: "total_date,desc",
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
        add: ['admin', 'upOperation:add'],
        edit: ['admin', 'upOperation:edit'],
        del: ['admin', 'upOperation:del']
      },
      rules: {
      },

      enabledTypeOptions:[
        { key: '1', display_name: '销售量' },
        { key: '2', display_name: '播放量' },
      ],
      statusOptions:[
        { key: '1', display_name: '未审核' },
        { key: '2', display_name: '已通过' },
        { key: '3', display_name: '已驳回' },
      ],
      total:{}
    }
  },
  mounted(){
    this.getTotal('page=0&size=10&sort=total_date%2Cdesc');
    
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {      
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.crud.form.id=undefined;
      this.imageUrl=null;
      this.crud.form.videoUrl=null;
     
      return true
    },
    timeModel(val){
        const month=[['Jan','01'],['Feb','02'],['Mar','03'],['Apr','04'],['May','05'],['Jun','06'],['Jul','07'],['Aug','8'],['Sep','09'],['Oct',10],['Nov',11],['Dec',12]];
        let time=val;
        time=time.slice(0,time.indexOf('00:00:00')-1).replace(new RegExp(/( )/g),',');
        const monthGet=month.find(item=>time.indexOf(item[0])>0);
        time=time.replace(monthGet[0],monthGet[1]).split(',');
        return `${time[3]}-${time[1]}-${time[2]}`;
    },
    search(){
        if(this.crud.query.totalDate){
            this.crud.query.startTime=this.timeModel(this.crud.query.totalDate[0].toString());
            this.crud.query.endTime=this.timeModel(this.crud.query.totalDate[1].toString());
            // delete this.crud.query.totalDate;
        }else{
            this.crud.query.startTime='';
            this.crud.query.endTime='';
        }
        let param=`page=0&size=10&sort=total_date%2Cdesc&upId=${this.crud.query.upId==undefined?'':this.crud.query.upId}&&costModel=${this.crud.query.costModel==undefined?'':this.crud.query.costModel}&startTime=${this.crud.query.startTime==undefined?'':this.crud.query.startTime}&endTime=${this.crud.query.endTime==undefined?'':this.crud.query.endTime}`
        this.getTotal(param);
        this.crud.toQuery();
    },
    handleClick(tab, event){
        console.log(tab, event);
    },
    getTotal(param){
        
        crudupUser.getTotal(param).then(res=>{
            console.log(param)
        this.total=res;
    }).catch(err=>{

    })
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
    .total{
        overflow: hidden;
        padding: 0;
    }
    .total li{
        float: left;
        list-style: none;
        margin-right:20px;
    }
</style>
