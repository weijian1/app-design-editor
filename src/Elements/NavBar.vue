<template>
  <div class="element-navbar" :style="`background: ${bgColor}; color: ${textColor}; height: ${height}px;`">
      <h1>{{ title }}</h1>
      <div class="icon-list">
          <i class="icon icon-menu">
            <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="100%" height="100%" viewBox="0 0 44 44" enable-background="new 0 0 44 44" xml:space="preserve" :style="`color: ${textColor};`">
            <g style="fill: currentColor;">
                <path d="M22.001,4.421c9.697,0,17.586,7.886,17.586,17.58c0,9.692-7.889,17.577-17.586,17.577
                    S4.414,31.693,4.414,22.001C4.414,12.308,12.304,4.421,22.001,4.421 M22.001,2.421c-10.818,0-19.587,8.766-19.587,19.58
                    c0,10.812,8.769,19.577,19.587,19.577s19.586-8.766,19.586-19.577C41.587,11.188,32.819,2.421,22.001,2.421L22.001,2.421z" style="fill: currentColor;"/>
            </g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.001,15.475c3.605,0,6.529,2.922,6.529,6.526
                s-2.924,6.526-6.529,6.526c-3.606,0-6.529-2.922-6.529-6.526S18.395,15.475,22.001,15.475z" style="fill: currentColor;"/>
            </svg>
          </i>
          <i class="icon icon-more">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="图层_1" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 44 44" enable-background="new 0 0 44 44" xml:space="preserve" :style="`color: ${textColor};`">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.234,17.848c2.295,0,4.154,1.857,4.154,4.152  c0,2.293-1.859,4.152-4.154,4.152c-2.294,0-4.154-1.859-4.154-4.152C0.081,19.705,1.94,17.848,4.234,17.848z" style="&#10;    fill: currentColor;&#10;"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.041,15.474c3.605,0,6.529,2.922,6.529,6.526  s-2.924,6.526-6.529,6.526c-3.606,0-6.529-2.922-6.529-6.526S18.434,15.474,22.041,15.474z" style="&#10;    fill: currentColor;&#10;"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M39.847,17.848C42.141,17.848,44,19.705,44,22  c0,2.293-1.859,4.152-4.153,4.152c-2.295,0-4.154-1.859-4.154-4.152C35.692,19.705,37.552,17.848,39.847,17.848z" style="&#10;    fill: currentColor;&#10;"/>
            </svg>
          </i>
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
