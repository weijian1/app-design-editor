<template>
  <div class="element-navbar" :style="`background: ${bgColor}; color: ${textColor}; height: ${height}px;`">
      <h1>{{ title }}</h1>
      <div class="icon-list">
          <i class="icon icon-menu"></i>
          <i class="icon icon-more"></i>
      </div>
  </div>
</template>

<script>
export default {
  props: {
      title: {
          default: '小程序'
      },
      bgColor: {
          default: 'white'
      },
      textColor: {
          default: 'black'
      },
      height: {
          default: 44
      }
  }
}
</script>


<style lang="scss" scoped>
    .element-navbar {
        position: relative;
        width: 100%;
        height: 44px;
        h1 {
            font-size: 14px;
            line-height: 44px;
            margin: 0;
        }
        .icon-list {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            color: white;
            display: flex;
            flex-flow: row-reverse nowrap;
            align-items: center;
            i.icon {
                width: 22px;
                height: 22px;
                margin-right: 16px;
            }
        }
    }
</style>
