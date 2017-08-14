<template>
  <div class="wrapper">
    <div class="content">
      <p class="title">成都印钞有限公司<br>{{year}}年{{sportName}}活动</p>
      <div class="margin-top-20">
        活动时间：{{year}}年8月15日至21日
      </div>
      <div class="btn margin-top-60">
        <x-button @click.native="jump('doc')">{{sportName}}知识学习</x-button>
        <x-button @click.native="jump('paper')">开始答题</x-button>
      </div>

    </div>
    <v-foot/>
  </div>
</template>
<script>
  import {
    XButton
  } from 'vux'

  export default {
    components: {
      XButton
    },
    data(){
      return{
        sportName:'成本月'
      }
    },
    computed:{
      year(){
        let date = new Date();
        return date.getFullYear();
      }
    },
    methods:{
      jump(router){
        this.$router.push(router);
      }
    }
  }

</script>
<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 13pt;
    color: #444;
    width: 100%;
    justify-content: center;
    .title {
      font-size: 22pt;
    }
    .btn{
      width: 80%;
    }
  }

</style>
