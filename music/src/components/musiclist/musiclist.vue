<template>
  <div class="music-list">
    <router-link to='/singer'>
      <div class="back">
        <i class="iconfont icon-back ">&#xe618;</i>
      </div>
    </router-link>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="play" @click="random" v-show="songs.length>0">
          <i class="icon-play iconfont">&#xe768;</i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs"
            @scroll="scroll"
            :probe-type="probeType"
            class="list"
            ref="list"
            :listen-scroll="listenScroll">
      <div class="song-list-wrapper" >
        <song-list :songs="songs" @select="select"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixmin'
const SAVE_HEIGHT = 40
export default {
  mixins: [playlistMixin],
  data () {
    return {
      scrollY: 0
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return {
          default: []
        }
      }
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    select (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + SAVE_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      }
      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${SAVE_HEIGHT}px`
        this.$refs.play.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.play.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
      this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  }
}
</script>
<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top:0
    left: 0
    right: 0
    bottom:0
    background: $color-background
    .back
      position: absolute
      top:0
      left: 6px
      z-index:99
      .icon-back
        display:block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
        backround:green
    .title
      position:absolute
      top: 2px
      width:100%
      no-wrap()
      text-align:center
      color:$color-text
      font-size: $font-size-large
      line-height:40px
      z-index:90
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 40%
      bottom: 0
      width: 100%
      background: $color-background
</style>
