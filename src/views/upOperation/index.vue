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
                            <el-upload :on-change="change" action='' class="upload-demo" :auto-upload='false' :multiple='false' :limit='1' :file-list='[]'>
                                <span v-if='dialogForm.cover'>{{dialogForm.cover}}</span>
                                <el-button size="small" type="primary">选择文件</el-button>
                            </el-upload>
                        </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item label="上传视频">
                            <div style='color:red;font-size:18px;'>若是长时上传无进度请刷新选择文件重新上传</div>
                            <el-upload :on-change="change1" action='' class="upload-demo" :auto-upload='false' :multiple='false' :limit='1' :file-list='[]' ref="file"> 
                                <el-button size="small" type="primary">选择文件</el-button>
                            </el-upload>
                            
                        </el-form-item>
                        <el-form-item label="进度" v-if="uploadList.length>0">
                            <div v-for='(item,index) in uploadList' :key='index'>
                                <label :class='item.color'>{{item.title}}{{item.status}}</label>
                                <el-progress :percentage="item.progress" color="green"></el-progress>
                            </div>
                        </el-form-item>
                    </div>
                    
                    <!-- <label style='color:red'>每次文件上传后请删除队列中的视频后再次上传</label>  -->
                   </div>
                    <video :src="dialogForm.videoUrl.replace('https://yany.info','http://18.163.188.47')" :controls='true' width='100%' v-else/>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="text" @click="dialogModel=false;crud.refresh();">取消</el-button>
                    <!-- <el-button type="text" @click="cancle" v-else>取消</el-button> -->
                    <el-button :loading="dialogLoading" type="primary" @click="submit" v-if='playStatus'>上传</el-button>
                </div>
            </el-dialog>
            
            <!--表格渲染-->
            <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="id" />
                <el-table-column prop="upId" label="upId" />
                <el-table-column prop="cover" label="封面">
                    <template slot-scope="scope">
                        <img :src="scope.row.cover?scope.row.cover.replace('https://yany.info','http://18.163.188.47'):''" style='width:100%'/>
                    </template>
                </el-table-column>
                <el-table-column prop="cover" label="时长">
                    <template slot-scope="scope">
                        <div>{{dealTime(scope.row.duration)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="text" label="视频" />
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
import hex_md5 from './md5'
import Tool from './tool'
const defaultForm = {}
export default {
  name: 'upUser',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({
      title: "",
    //   url: "api/UPUser",
      url: "api/upOperation",
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
      imageUrl: null,
      videoUrl:null,
      dialogModel:false,
      dialogTitle:'编辑',
      dialogLoading:false,
      dialogForm:{},
      playStatus:true,
      uploadList:[],
      name:null,
      indexCount:-1,
      shardSize: 50*1024 * 1024, //以50M为一个分片
      suffixs:['mp4','mov','MP4']
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
    uploadFile(nowFile) {//视频上传
        let _this = this;
        let formData = new window.FormData();
        
        let key = hex_md5(nowFile.name + nowFile.size + nowFile.type);
        let key10 = parseInt(key, 16);
        let key62 = Tool._10to62(key10);
        
        let suffixs = _this.suffixs;
        let fileName = nowFile.name;
      
        let suffix = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length).toLowerCase();
        if(!(!suffixs || JSON.stringify(suffixs) === "{}" || suffixs.length === 0)) {
            let validateSuffix = false;
            for(let s of this.suffixs) {
                if(s.toLocaleLowerCase() === suffix) {
                    validateSuffix = true;
                    break;
                }
            }
            if(!validateSuffix) {
                this.$message.error('请上传正确格式的文件!');
                this.dialogLoading=false;
                return false;
            }
        }
        // 文件分片
        let shardSize = _this.shardSize;  
        let shardIndex = 1;   // 分片索引，1表示第1个分片
        let size = nowFile.size;
        let shardTotal = Math.ceil(size / shardSize); // 总分片数
 
        let param = {
          'shardIndex': shardIndex,
          'shardSize': shardSize,
          'shardTotal': shardTotal,
          'name': nowFile.name.slice(0,fileName.lastIndexOf(".")),
          'suffix': suffix,
          'size': nowFile.size,
          'key': key62
        };
        _this.check(param);
      },
      check(param) {
        let _this = this;
        _this.indexCount++;
        _this.uploadList.push({title:_this.dialogForm.videoUrl.slice(0,_this.dialogForm.videoUrl.lastIndexOf(".")),status:'上传中...',color:'loading',index:_this.indexCount,data:_this.videoUrl,progress:0});
        crudupUser.uploadContinue(param.key).then((res)=> {
            
            if(res.key) {
              const abc=_this.uploadList.find((item)=>res.name.indexOf(item.title)>=0);
             
              if (res.shardIndex === res.shardTotal) {
                // 已上传分片 = 分片总数，说明已全部上传完，不需要再上传
                
                _this.$message.success(`${abc.title}上传成功!`);
                _this.uploadList[abc.index].color='success';
                _this.uploadList[abc.index].progress='100';
                _this.uploadList[abc.index].status='上传成功!';
              }else {
                let paramNow={...res};
                _this.uploadList[abc.index].progress=parseInt((res.shardIndex / res.shardTotal)*100);
                paramNow.shardIndex = paramNow.shardIndex + 1;
                
                _this.upload(paramNow,abc.data);
              }
            } else {
                _this.upload(param,_this.videoUrl);
            }
        }).catch((err) => {
            _this.$message.error(err);
        });
      },
      /**
       * 递归上传分片
       */
    upload(param,nowFile) {
        let _this = this;
        let shardIndex = param.shardIndex;
        let shardTotal = param.shardTotal;
        let shardSize = param.shardSize;
        let fileShard = _this.getFileShard(shardIndex,shardSize,nowFile);
    
        // 将文件转为base64进行传输
        let fileReader = new FileReader();
        fileReader.readAsDataURL(fileShard);
        fileReader.onload = function (e) {
            let base64 = e.target.result;
            param.shard = base64;
            
            crudupUser.uploadVideo(param).then((res)=> { 
                const abc=_this.uploadList.find((item)=>res.name==item.title); 
               
                if(res.shardIndex < res.shardTotal) {
                    let paramNow={...res};
                    _this.uploadList[abc.index].progress=parseInt((res.shardIndex / res.shardTotal)*100);
                    paramNow.shardIndex = res.shardIndex + 1;
                    _this.upload(paramNow,abc.data);
                } else {
                    _this.$message.success(`${abc.title}上传成功!`);
                    _this.uploadList[abc.index].progress=100;
                    _this.uploadList[abc.index].color='success';
                    _this.uploadList[abc.index].status='上传成功!';
                }
            }).catch(err=>{
                console.log(err,'错误');
            });
        };
    },

    getFileShard(shardIndex, shardSize) {
        let _this = this;
        let file = this.videoUrl.raw;
     
        let start = (shardIndex - 1) * shardSize; // 当前分片起始位置
        let end = Math.min(file.size, start + shardSize); // 当前分片结束位置
        let fileShard = file.slice(start, end); // 从文件中截取当前的分片数据
        return fileShard;
     },
    submit(){
        
        if(this.dialogForm.text){
            var data = new FormData();
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
            data.append('multipartFile', this.imageUrl);
            crudupUser.uploadCover(data,this.dialogForm.id).then(res=>{
                if(res){
                    this.$message.success(`操作成功!`);
                    this.dialogModel=false;
                    this.crud.refresh();
                }else{
                    this.$message.error(res);
                }
                this.dialogLoading=false;
            }).catch(err=>{
                this.$message.error(err);
                this.dialogLoading=false;
            })
        }else{
            if(!this.videoUrl){
                this.$message.error('视频不能为空!');
                return false;
            }
            this.uploadFile(this.videoUrl);
            
       }
        
    },
    change(file){
        this.imageUrl=file.raw;
        this.dialogForm.cover=file.name;
    },
    change1(file){
        this.dialogForm.videoUrl=file.name;
        this.name=file.name.slice(0,file.name.lastIndexOf('.'));
        this.videoUrl=file;
    },
    dealTime(time){
        if(!time){
            return 0
        }else{
            let secondTime = parseInt(time)//将传入的秒的值转化为Number
            let min = 0// 初始化分
            let h =0// 初始化小时
            let result=''
            if(secondTime>=60){//如果秒数大于等于60，将秒数转换成整数
                min=parseInt(secondTime/60)//获取分钟，除以60取整数，得到整数分钟
                secondTime=parseInt(secondTime%60)//获取秒数，秒数取佘，得到整数秒数
                if(min>=60){//如果分钟大于等于60，将分钟转换成小时
                    h=parseInt(min/60)//获取小时，获取分钟除以60，得到整数小时
                    min=parseInt(min%60) //获取小时后取佘的分，获取分钟除以60取佘的分
                }
            }
            result=`${h.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secondTime.toString().padStart(2,'0')}`
            return result
        }
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
