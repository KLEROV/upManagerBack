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
              v-model="query.videoText"
              clearable
              size="small"
              placeholder="视频名称"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <el-select
              v-model="query.productLine"
              clearable
              size="small"
              placeholder="平台名称"
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
            <!-- <div>视频数量：2&nbsp;播放量：2&nbsp;播放量：2&nbsp;播放量（扣量后）：2&nbsp;销售额：2&nbsp;销售额（扣量后）：2</div> -->
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <!-- <crudOperation :permission="permission" /> -->
            <!--表单组件-->
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
               
                <el-table-column prop="totalDate" label="日期" />
                <el-table-column prop="videoId" label="视频id" />
                <el-table-column prop="upId" label="upId" />
                <el-table-column prop="videoText" label="视频标题" />
                <el-table-column prop="upId" label="视频数据">
                    <template slot-scope="scope">
                        <div>{{scope.row.costModel==1?'销售额':'播放量'}}:{{scope.row.costAfter}}</div>
                        <div>扣量后{{scope.row.costModel==1?'销售额':'播放量'}}:{{scope.row.costBefore}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="profitBefore" label="收益(分成前)" />
                <el-table-column prop="profitAfter" label="收益(分成后)" />
                <el-table-column prop="productLine" label="已发布平台"></el-table-column>
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
import crudupUser from '@/api/upUser/video'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
const defaultForm = {}
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation,DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "",
      url: "/api/UPUser/upDetailedTotal",
    //   url: "api/UPUser/detailed",
      sort: "id,desc",
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
        { key: 'CL01', display_name: 'CL01' },
        { key: 'CL02', display_name: 'CL02' },
        { key: 'CL03', display_name: 'CL03' },
        { key: 'CL04', display_name: 'CL04' }
      ],
    }
  },
  mounted(){
    
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {      
      return true
    },
    add(){
        this.dialogForm={};
        this.uploadList=[];
        this.indexCount =-1;
        this.videoUrl=null;
        this.dialogTitle='添加';
        this.dialogModel=true;
        this.playStatus=true;
    },
    edit(value,status){
        if(status){
            this.playStatus=false;
        }else{
            this.playStatus=true;
        }
        this.dialogTitle='编辑';
        this.imageUrl=null;
        this.dialogForm=={};
        this.dialogForm={...value};
        if(status){
            this.dialogTitle='播放';
        }
        this.dialogModel=true;
    },
    cancle(){
        this.crud.status.edit=0;
        this.crud.status.cu=0;
        this.uploadList=[];
        this.indexCount-1;
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.crud.form.id=undefined;
      this.imageUrl=null;
      this.crud.form.videoUrl=null;
     
      return true
    },
    [CRUD.HOOK.beforeToEdit]() {

      
    },
    submit(){
        var data = new FormData();
        let fun=crudupUser.uploadCover;
        if(this.dialogForm.text){
            this.dialogLoading=true;
            if(this.dialogForm.id==undefined){
                this.$message.error('videoId不能为空!');
                this.dialogLoading=false;
                return false;
            }
            if(!this.imageUrl){
                this.$message.error('未修改封面不能为提交!');
                this.dialogLoading=false;
                return false;
            }
            data.append('multipartFile', this.imageUrl)
        }else{
            if(!this.videoUrl){
                this.$message.error('视频不能为空!');
                // this.dialogLoading=false;
                return false;
            }
            this.indexCount++;
          
            data.append('multipartFile', this.videoUrl);
            fun=crudupUser.uploadVideo;
            this.uploadList.push({title:this.dialogForm.videoUrl,status:'上传中...',color:'loading',name:this.name,index:this.indexCount});
        }
        fun(data,this.dialogForm.id).then(res=>{
            const abc=this.uploadList.find((item)=>res.fileName.indexOf(item.name)>=0);
           
            if(res){
                if(this.uploadList.length>0){
                    this.$message.success(`${abc.name}上传成功!`);
                    this.uploadList[abc.index].color='success';
                    this.uploadList[abc.index].status='上传成功!';
                }else{
                    this.$message.success(`操作成功!`);
                    this.dialogModel=false;
                    this.crud.refresh();
                }
            }else{
                this.$message.error(res);
            }
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
</style>
