<template>
  <div class="exception">
    <div class="img">
      <img :src="img" />
    </div>
    <div class="content">
      <h1>权限不足</h1>
      <div class="desc">请联系管理员授权</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
.exception {
  min-height: 500px;
  height: 80%;
  align-items: center;
  text-align: center;
  margin-top: 150px;
  .img {
    display: inline-block;
    padding-right: 52px;
    zoom: 1;
    img {
      height: 360px;
      max-width: 430px;
    }
  }
  .content {
    display: inline-block;
    flex: auto;
    h1 {
      color: #434e59;
      font-size: 70px;
      font-weight: 600;
      line-height: 70px;
      margin-bottom: 24px;
    }
    .desc {
      color: rgba(0, 0, 0, 0.45);
      font-size: 25px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}

.mobile {
  .exception {
    margin-top: 30px;
    .img {
      padding-right: unset;

      img {
        height: 40%;
        max-width: 80%;
      }
    }
  }
}
</style>