<template>
  <div>
    <audio v-if="playAudio" src="/static/audio/bgm.mp3" ref="audio" autoplay loop></audio>
    <p class="page-no" v-show="tips!=''">
      {{tips}}
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    playAudio() {
      return false ;//process.env.NODE_ENV !== 'mobile';
    },
    tips: {
      get() {
        return this.$store.state.tips;
      },
      set(val) {
        this.$store.commit('setTips', val);
      }
    }
  },
  mounted() {
    if (this.playAudio) {
      this.$refs.audio.volume = 0.5;
    }
  }
};
</script>
<style lang="less" scoped>
/*START: 提示信息：按键、计时器、页码 */

.tip-text {
    position: absolute;
    font-size: 13px;
    color: #fff;
}

.tip,
.page-no {
    .tip-text;
    right: 10px;
}

.tip-wrapper {
    padding: 3px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 2px;
}

.tip {
    top: 10px;
    .key {
        .tip-wrapper;
    }
}

.page-no{
    bottom: 10px;
    .tip-wrapper;
}


</style>
