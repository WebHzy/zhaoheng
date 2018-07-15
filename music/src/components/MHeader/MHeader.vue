<template>
  <div class="m-header">
    <div class="icon"><img src="./logo.jpg" class="icon-img"></div>
    <div class="text">Y-Music</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'MHeader'
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .m-header
    position: relative
    height: 44px
    text-align: center
    color: $color-theme
    font-size: 0
    .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 30px
      height: 0
      padding-bottom:30px
      margin-right: 9px
      background-size: 30px 32px
      .icon-img
        width :100%
    .text
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: $font-size-large
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
