<template>
    <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          
            <template>
                <!-- <el-button  type="primary" size="small" @click='add'>查看</el-button> -->
                <el-button  type="primary" size="medium" @click='add'>新增</el-button>
            </template>
                
            <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
            <!-- <crudOperation :permission="permission" /> -->
            <!--表单组件-->
            
            <el-dialog :close-on-click-modal="false" :visible.sync="dialogModel" :title="dialogTitle" width="600px">
                <el-form ref="dialogForm" :model="dialogForm" :rules="rules" size="small" label-width="70px">
                    <div v-if='playStatus'>
                      <div v-if='dialogForm.text'>   
                        <el-form-item label="id">
                            <el-input v-model="dialogForm.id" style="width: 370px;" :disabled='true'/>
                        </el-form-item>
                        <el-form-item label="上传封面">
                            <el-upload :on-change="change" action='' class="upload-demo" :auto-upload='false' :multiple='false' :limit='1'>
                                <span v-if='dialogForm.cover'>{{dialogForm.cover}}</span>
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item label="上传视频">
                            <el-upload :on-change="change1" action='' class="upload-demo" :auto-upload='false' :multiple='false' :limit='1'>
                                <span>{{dialogForm.videoUrl}}</span>
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="进度" v-if="uploadList.length>0">
                            <div v-for='(item,index) in uploadList' :key='index'>
                                <label :class='item.color'>{{item.title}}{{item.status}}</label>
                                <!-- <el-progress :percentage="100" color="green"  status="success"></el-progress> -->
                            </div>
                        </el-form-item>
                    </div> 
                   </div>
                    <video :src='dialogForm.videoUrl' :controls='true' width='100%' v-else/>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="dialogModel=false">取消</el-button>
                    <!-- <el-button type="text" @click="cancle" v-else>取消</el-button> -->
                    <el-button :loading="dialogLoading" type="primary" @click="submit" v-if='playStatus'>确认</el-button>
                </div>
            </el-dialog>
            
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="id" />
                <el-table-column prop="upId" label="upId" />
                <el-table-column prop="cover" label="封面">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover" style='width:100%'/>
                    </template>
                </el-table-column>
                <el-table-column prop="videoUrl" label="视频" />
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
                        <el-button type="text" size="small" @click='edit(scope.row,1)'>播放</el-button>
                    </template>
                </el-table-column>
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

const defaultForm = {}
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "",
    //   url: "api/UPUser",
      url: "/api/upOperation/queryUpVideo",
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
        add: ['admin', 'upUser:add'],
        edit: ['admin', 'upUser:edit'],
        del: ['admin', 'upUser:del']
      },
      rules: {
      },
      imageUrl: null,
      videoUrl:null,
      dialogModel:false,
      dialogTitle:'编辑',
      dialogLoading:false,
      dialogForm:{},
      playStatus:true,
      uploadList:[],
      name:null,
      indexCount:-1
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
                    this.uploadList[this.indexCount].color='success';
                    this.uploadList[this.indexCount].status='上传成功!';
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
    change(file){
       
        this.imageUrl=file.raw;
        this.dialogForm.cover=file.name;
    },
    change1(file){
        this.dialogForm.videoUrl=file.name;
       
        this.name=file.name.slice(0,file.name.lastIndexOf('.'));
        this.videoUrl=file.raw;
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
