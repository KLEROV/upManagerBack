<template>
    <div class="app-container">
        <div style='' class='admin'>
            <div class='title'>
                用户账号:{{userName}}
            </div>
            <div>未提现金额:{{dataList.balance?dataList.balance:0}}<span>累计已提现:</span>{{dataList.takings?dataList.takings:0}}</div>
        </div>
        
        <ul>
            <li>
                <div class='title'>上传视频总数</div>
                <div class='count'>{{dataList.uploadCount?dataList.uploadCount:0}}</div>
            </li>
            <li>
                <div class='title'>发布视频总数</div>
                <div class='count'>{{dataList.releaseCount?dataList.releaseCount:0}}</div>
            </li>
            <li>
                <div class='title'>订阅总数</div>
                <div class='count'>{{dataList.subscribeCount?dataList.subscribeCount:0}}</div>
            </li>
            <li>
                <div class='title'>当天订阅总数</div>
                <div class='count'>{{dataList.daySubscribeCount?dataList.daySubscribeCount:0}}</div>
            </li>
            <li>
                <div class='title'>当天播放总数</div>
                <div class='count'>{{dataList.dayPlayCount?dataList.dayPlayCount:0}}</div>
            </li>
            <li>
                <div class='title'>当天销售额</div>
                <div class='count'>{{dataList.dayPayMoney?dataList.dayPayMoney:0}}</div>
            </li>
            <li>
                <div class='title'>总销售额</div>
                <div class='count'>{{dataList.totalPayMoney?dataList.totalPayMoney:0}}</div>
            </li>
            <li>
                <div class='title'>总收益</div>
                <div class='count'>{{dataList.totalProfit?dataList.totalProfit:0}}</div>
            </li>
            <li>
                <div class='title'>已提现</div>
                <div class='count'>{{dataList.takings?dataList.takings:0}}</div>
            </li>
            <li>
                <div class='title'>余额</div>
                <div class='count'>{{dataList.balance?dataList.balance:0}}</div>
            </li>
        </ul>
        
    </div>
</template>

<script>
import {getUpAmount} from '@/api/admin/index';
export default {
  name: 'upAmount',
  data() {
    return {
        dataList:{},
        userName:localStorage.getItem('name')
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    getData(){
        getUpAmount().then(res=>{
            this.dataList=res;
        }).catch(err=>{
            this.$message.error(err);
        })
    },
    
  }
}
</script>

<style scoped>
    .admin {
        border:1px solid black;
        margin-left:40px;
    }
    span{
        margin-left:20px; 
    }
    ul{
        min-width:600px ;
        overflow: hidden;
    }
    li{
        list-style: none;
        border:1px solid black;
        float: left;
        margin:0 15px 15px 0;
        width:30%;
    }
    li div,.admin div{
        padding:15px;
        font-size: 18px;
    }
    .title{
        font-size: 20px;
        font-weight: 600;
    }
    @media (min-width:1000px) {
        li{
            width:23%;
        }
    }
    @media (min-width:1500px) {
        li{
            width:15.5%;
        }
    }
</style>
