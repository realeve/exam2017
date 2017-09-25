<template>
  <div>
    <div class="page-bg"></div>
    <div class="bg-dot"></div>
    <div class="fixedcon" v-show="isPC">
      <div class="control">
        <i class="fullsc show" :class="{'enabled':isFullScreen}" @click="fullScreen" title="全屏模式"></i>
        <i class="music show" :class="{mute}" title="背景音乐" @click="audioPlayer"></i>
        <audio src="./static/bg.m4a" autoplay="autoplay" loop="loop" ref="audio"></audio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toBottom: false,
      isFullScreen: false,
      mute: false,
    }
  },
  computed: {
    isPC() {
      return this.$store.state.isPC;
    },
    player(){
      return this.$refs.audio;
    }
  },
  methods: {
    // isFullScreen(){
    //  return (document.fullscreen||document.mozFullScreen|| document.webkitIsFullScreen||document.msFullscreenElement);
    // },
    enterFullScreen() {
      var docElm = document.documentElement;
      //W3C  
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox  
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等  
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    },
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },
    fullScreen() {
      if (this.isFullScreen) {
        this.exitFullScreen();
      } else {
        this.enterFullScreen();
      }
      this.isFullScreen = !this.isFullScreen;
    },
    audioPlayer() {
      if (this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
      this.mute = !this.mute;
    }
  },
  mounted() {
    this.player.volume = 0.4;
  },
  activated() {
    this.player.play();
  }
}
</script>
<style lang="less" scoped>
@import "./style.css";
// @import "./index.css";
</style>

