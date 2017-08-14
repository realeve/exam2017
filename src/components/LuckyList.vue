<template>
  <div class="home">
    <div class="content">
      <panel header="幸运用户" :list="list" :type="type"></panel>
    </div>
  </div>
</template>

<script>
  import {
    Panel,
    Group
  } from 'vux'

  import {
    mapState
  } from 'vuex'

  export default {
    components: {
      Panel,
      Group
    },
    data() {
      return {
        type: '1',
        list: []
      }
    },
    computed: {
      ...mapState(['cdnUrl'])
    },
    methods: {
      loadDefaultData() {
        let params = {
          s: '/addon/Api/Api/getResearchLuckyList'
        }
        this.$http.jsonp(this.cdnUrl, {
          params
        }).then(res => {
          this.list = res.data.map((item, i) => {
            item.title = `${i + 1}.${item.title}`;
            return item;
          });
        });
      },
      init() {
        document.title = '现金使用情况问卷调查幸运用户列表';
        this.loadDefaultData();
      }
    },
    mounted() {
      this.init();
    }
  }

</script>

<style scoped lang="less">
  .home {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    font-weight: 100;
    margin-top: 10px;
    .content {
      flex: 1;
    }
  }

</style>
