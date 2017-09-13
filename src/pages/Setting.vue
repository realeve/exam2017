<template>
  <div class="home">
    <div class="content">
      <form-preview header-label="目前中奖人数" :header-value="curLucker+'(人)'" :body-items="list" />
      <group title="活动设置" class="wrapper">
        <x-input title="奖品名称" name="prize_name" v-model="prize_name"></x-input>
        <x-input title="奖品总数" name="prize_num" v-model="prize_num" keyboard="number"></x-input>
        <x-input title="预计参与人数" name="people_num" v-model="people_num" keyboard="number"></x-input>
      </group>
  
      <div class="submit">
        <x-button type="primary" @click.native="submit">提交信息</x-button>
        <x-button plain @click.native="clear">清空数据</x-button>
        <x-button plain @click.native="viewLucky">查看中奖列表</x-button>
      </div>
    </div>
    <toast v-model="toast.show">{{ toast.msg }}</toast>
  </div>
</template>

<script>
import {
  XButton,
  XInput,
  Group,
  Toast,
  FormPreview
} from 'vux'

import {
  mapState
} from 'vuex'

export default {
  components: {
    XButton,
    XInput,
    Group,
    Toast,
    FormPreview
  },
  data() {
    return {
      prize_num: 0,
      people_num: 0,
      prize_name: '',
      curPeople: 0,
      curLucker: 0,
      toast: {
        show: false,
        msg: ''
      },
    }
  },
  computed: {
    ...mapState(['cdnUrl','sport']),
    list() {
      let luckRate = 0, newRate = 0;
      let newPeople = this.people_num - this.curPeople;
      let newPrize = this.prize_num - this.curLucker;
      if (this.curPeople != '' && this.curPeople > 0) {
        luckRate = (this.curLucker * 100 / this.curPeople).toFixed(2) + ' %';
      }
      if (newPeople > 0) {
        newRate = (newPrize * 100 / newPeople).toFixed(2) + ' %';
      }
      return [{
        label: '已参与人数',
        value: this.curPeople
      }, {
        label: '已中奖人数',
        value: this.curLucker
      }, {
        label: '当前中奖率',
        value: luckRate
      }, {
        label: '预计新增人数',
        value: newPeople
      }, {
        label: '剩余奖品数',
        value: newPrize
      }, {
        label: '预计中奖率',
        value: newRate
      }];
    }
  },
  methods: {
    loadCurLucker() {
      let params = {
        s: '/addon/Api/Api/getExamCurLucker',
        sportid:this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data[0];
        this.curPeople = obj.people_num;
        this.curLucker = obj.prize_num;
      });
    },
    loadDefaultData() {
      let params = {
        s: '/addon/Api/Api/getExamSettings',
        sportid:this.sport.id
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        let obj = res.data[0];
        this.people_num = obj.people_num;
        this.prize_num = obj.prize_num;
        this.prize_name = obj.prize_name;
      });
    },
    viewLucky() {
      this.$router.push('/lucker');
    },
    submit() {
      let params = {
        s: '/addon/Api/Api/setExamSettings',
        sportid:this.sport.id,
        prize_num: this.prize_num,
        people_num: this.people_num,
        prize_name: this.prize_name
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.toast.show = true;
        this.toast.msg = res.data.msg;
      });
    },
    clear(){
       let params = {
        sportid:this.sport.id,
        s: '/addon/Api/Api/clearExamData'
      }
      this.$http.jsonp(this.cdnUrl, {
        params
      }).then(res => {
        this.toast.show = true;
        this.toast.msg = res.data.msg;
      });
    },
    init() {
      document.title = '奖品设置';
      this.loadCurLucker();
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
  .wrapper {
    padding-top: 20px;
  }
  .submit {
    padding: 30px 20px;
  }
}

</style>
