<template>
  <div>
    <full-image/>
    <template v-if="isPC">
      <v-header/>
      <flexbox :gutter="0" wrap="wrap" class="content">
        <flexbox-item :span="2/7">
          <v-left class="left-content" />
        </flexbox-item>
        <flexbox-item :span="2/7">
          <v-center class="center-content" />
        </flexbox-item>
        <flexbox-item :span="3/7">
          <v-right class="right-content" />
        </flexbox-item>
      </flexbox>
    </template>
    <template v-else>
      <div class="content" style="margin-top:40px;">
        <v-left class="left-content" />
        <v-center class="center-content" />
        <v-right class="right-content" style="margin-top:40px;" />
      </div>
    </template>
  </div>
</template>

<script>
import FullImage from "./IFullImage/index";
import VHeader from "./Header/";
import VCenter from "./Center.vue";
import VLeft from "./Left.vue";
import VRight from "./Right.vue";

import { Flexbox, FlexboxItem } from "vux";

export default {
  components: {
    Flexbox,
    FlexboxItem,
    FullImage,
    VHeader,
    VLeft,
    VCenter,
    VRight
  },
  computed: {
    isPC() {
      return this.$store.state.isPC;
    },
    peopleCount() {
      return this.$store.state.peopleCount;
    }
  },
  mounted() {
    document.title = "实时得分";
  }
};
</script>
<style scoped lang="less">
@div-offset: -100px;
.content {
  margin-top: @div-offset;
  color: #fff;
}

.left-content {
  padding: 0 5px 0px 10px;
  height: 100vh;
}

.center-content {
  padding: 50px 5px 0 5px;
}

.right-content {
  padding: 0px 0px 0px 10px;
  margin-top: -180px;
}

.info {
  position: absolute;
  right: 5px;
  top: 5px;
  color: #f2f2f2;
  line-height: 14px;
  font-size: 9pt;
}

.tip-mobile {
  text-align: right;
  color: #fff;
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 12pt;
}

.tip-mobile-left {
  color: #fff;
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 12pt;
}

.info-left {
  position: absolute;
  left: 10px;
  top: 10px;
  color: #f2f2f2;
  line-height: 14px;
  font-size: 9pt;
}
</style>
