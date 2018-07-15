<template>
      <div class="player" v-show="playList.length>0">
        <transition name="normal"
        @enter="enter"
        @after-enter="afterenter"
        @leave="leave"
        @after-leave="afterleave">
          <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
              <div class="back" @click="back">
                <i class="iconfont icon-back">&#xe618;</i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
                 @touchstart.prevent="touchstart"
                 @touchmove.prevent="touchmove"
                 @touchend="touchend"
            >
              <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cls">
                    <img class="image" :src="currentSong.image">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{playinglyric}}</div>
                </div>
              </div>
              <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p ref="lyricLine"
                        class="text"
                       :class="{'current': currentLineNum === index}"
                        v-for="(line, index) in currentLyric.lines"
                        :key="index">{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
            </div>
            <div class="bottom">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active': currentshow == 'cd'}"></span>
                <span class="dot" :class="{'active': currentshow == 'lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                  <progress-bar ref="progressBar" :percent="percent" @percentChange="onProgressBarChange"
                               ></progress-bar>
                </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left">
                  <i :class="iconMode" @click="changeMode" class="iconfont"></i>
                </div>
                <div class="icon i-left">
                  <i @click="prev" class="icon-prev iconfont">&#xe7ea;</i>
                </div>
                <div class="icon i-center">
                  <i class="iconfont" @click="toggleplay" v-if="playing">&#xe629;</i>
                  <i class="iconfont" @click="toggleplay" v-if="!playing">&#xe768;</i>
                </div>
                <div class="icon i-right">
                  <i @click="next" class="icon-next iconfont">&#xe7eb;</i>
                </div>
                <div class="icon i-right">
                  <i class="icon icon-not-favorite iconfont">&#xe7df;</i>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition class="mini">
          <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
              <img width="40" height="40" :src="currentSong.image" :class="cls">
            </div>
            <div class="text">
              <h2 class="name" v-html="currentSong.name"></h2>
              <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
              <progress-circle :radius="R" :percent="percent">
                <i class="icon-playlist iconfont icon-mini" @click.stop="toggleplay" v-if="playing">&#xe629;</i>
                <i class="icon-playlist iconfont icon-mini" @click.stop="toggleplay" v-if="!playing">&#xe768;</i>
              </progress-circle>
            </div>
            <div class="control">
              <i class="icon-playlist iconfont">&#xe614;</i>
            </div>
          </div>
        </transition>
        <audio ref="audio" :src="currentSong.url"
               @playing="ready" @error="error"
                @timeupdate="updateTime"
                @ended="songend"></audio>
      </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utill'
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data () {
    return {
      songready: false,
      currentTime: 0,
      R: 32,
      currentLyric: null,
      currentLineNum: 0,
      currentshow: 'cd',
      playinglyric: ''
    }
  },
  components: {
    Scroll,
    progressBar,
    progressCircle
  },
  computed: {
    cls () {
      return this.playing ? 'play' : 'play pause'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    touchstart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    touchmove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentshow === 'cd' ? 0 : -window.innerWidth
      const width = Math.min(Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(width / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    touchend () {
      let width
      let opacity
      if (this.currentshow === 'cd') {
        if (this.touch.percent > 0.1) {
          width = -window.innerWidth
          opacity = 0
          this.currentshow = 'lyric'
        } else {
          width = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          width = 0
          opacity = 1
          this.currentshow = 'cd'
        } else {
          width = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${width}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = 0
    },
    songend () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setplaymode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.setlist(list)
    },
    resetCurrentindex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setindex(index)
    },
    back () {
      this.setfullscreen(false)
    },
    ...mapMutations({
      setfullscreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setcurrent: 'SET_CURRENT_INDEX',
      setplaymode: 'SET_PLAY_MODE',
      setlist: 'SET_PLAYLIST',
      setindex: 'SET_CURRENT_INDEX'
    }),
    open () {
      this.setfullscreen(true)
    },
    enter (el, done) {
      const {x, y, scale} = this.getpos()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterenter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this.getpos()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterleave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    getpos () {
      const targetw = 40
      const paddingleft = 40
      const paddingbottom = 30
      const paddingtop = 80
      const width = window.innerWidth * 0.8
      const scale = targetw / width
      const x = -(window.innerWidth / 2 - paddingleft)
      const y = window.innerHeight - paddingtop - width / 2 - paddingbottom
      return {
        x,
        y,
        scale
      }
    },
    toggleplay () {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    next () {
      if (!this.songready) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setcurrent(index)
        if (!this.playing) {
          this.toggleplay()
        }
      }
      this.songready = false
    },
    prev () {
      if (!this.songready) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setcurrent(index)
        if (!this.playing) {
          this.toggleplay()
        }
      }
      this.songready = false
    },
    ready () {
      this.songready = true
    },
    error () {
      this.songready = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this.pad(interval % 60 | 0)
      return `${minute}:${second}`
    },
    pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.toggleplay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playinglyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
    }
  },
  watch: {
    currentSong (newsong, oldsong) {
      if (newsong.id === oldsong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .current
              color: red
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            .icon-sequence:before
              content: '\e671'
            .icon-random:before
              content: '\e622'
            .icon-loop:before
              content: '\e649'
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
