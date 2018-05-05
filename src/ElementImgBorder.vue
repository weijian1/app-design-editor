<template>
  <div class="element-box" 
       :class="{'element-move': eventData.move, 'element-resize': eventData.resize, 'element-rotate': eventData.rotate}"
       v-tap="elementClick"
       @mouseenter="elementEnter"
       @mouseleave="elementLeave"
       @dblclick="elementDblClick"
       :style="value | Obj2CSS('exclude', specialCssProperty)">
    <div class="element-content" 
         v-panstart="startMove"
         v-panmove="moving"
         v-panend="endMove"
         :style="value | Obj2CSS('include', specialCssProperty)">
        <slot></slot>
    </div>
    <template v-if="mouseEnter || selected">
        <div class="bar bar-radius bar-rotate" v-panstart="startRotate" v-panmove="rotating" v-panend="endRotate"></div>
        <div class="bar bar-line"></div>
        <div class="bar bar-n" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-s" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-w" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-e" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rn" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rs" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rw" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-re" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rnw" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rne" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rsw" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rse" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
    </template>
  </div>
</template>


<script>
import HammerJS from './Directives/Hammer'
import Obj2CSS from './Filters/Obj2CSS'
import Obj2CSSOpacity from './Filters/Obj2CSSOpacity'
import EditorMinxin  from './Mixins/Editor'

export default {
  mixins: [ EditorMinxin ],
  props: {
      value: {

      },
      selected: {
          required: true
      },
      elementType: {
          required: true
      }
  },
  data() {
      return {
          mouseEnter: false,
          specialCssProperty: ['opacity', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color'],
          eventData: {
            tempOpacity: 1,
            currentDirection: '',
            originElementPos: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            },
            originElementRect: {

            },
            resizeOffset: {

            },
            moveOffset: {

            },
            resize: false,
            rotate: false,
            move: false,
          }
      }
  },
  methods: {
      elementDblClick() {
          this.$emit('elementdbclick');
      },
      notifySelect() {
          if (this.selected == false) {
              this.$emit('elementchange', true);
          }
      },
      elementClick(e) {
          e.srcEvent.stopPropagation();
          if (this.elementType == 'text' && this.textIsEditing == true) {

          } else {
              this.notifySelect();
          }
      },
      elementEnter() {
          this.mouseEnter = true;
      },
      elementLeave() {
          this.mouseEnter = false;
      },
      startResize(e) {
          e.srcEvent.stopPropagation();
          e.preventDefault();
          let arrClassList = e.target.classList.value.split(' ');

          for (let i = 0, len = arrClassList.length; i < len; i++) {
              if (arrClassList[i] == 'bar' || arrClassList[i] == 'bar-radius') {
                  continue;
              } else {
                  let directionClass = arrClassList[i].replace('bar-', '');
                  if (directionClass == 'rs' || directionClass == 's') {
                      this.eventData.currentDirection = 's';
                  } else if (directionClass == 'rn' || directionClass == 'n') {
                      this.eventData.currentDirection = 'n';
                  } else if (directionClass == 'rw' || directionClass == 'w') {
                      this.eventData.currentDirection = 'w';
                  } else if (directionClass == 're' || directionClass == 'e') {
                      this.eventData.currentDirection = 'e';
                  } else {
                      this.eventData.currentDirection = directionClass.substr(1);
                  }
              }
          }

          let img = this.$el.children[0].children[0];

          let rectOriginEl = this.$el.getBoundingClientRect();
          let rectEditorRect = this.bodyParent.$el.getBoundingClientRect();

          let maxOffset = {
              left: rectOriginEl.left - rectEditorRect.left,
              top: rectOriginEl.top - rectEditorRect.top,
              right: rectEditorRect.right - rectOriginEl.right,
              bottom: rectEditorRect.bottom - rectOriginEl.bottom
          };

          this.eventData.resizeOffset = maxOffset;

          this.recordStartPos();
          this.eventData.resize = true;
          this.eventData.select = true;
          this.notifySelect();

          this.editorData.currentAction.resize = true;
      },
      resizing(e) {
          e.srcEvent.stopPropagation();
          e.preventDefault();
          if (this.eventData.resize) {
            let originElementPos = this.eventData.originElementPos;
            let offset = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            };

            let picRatio = this.eventData.originElementRect.width / this.eventData.originElementRect.height;
            let direction = this.eventData.currentDirection;
            let resizeOffset = this.eventData.resizeOffset;
            const MIN_SIZE = 2;

            if (direction == 'se') {
                if (resizeOffset.right > resizeOffset.bottom) {
                    resizeOffset.right = resizeOffset.bottom * picRatio;
                } else {
                    resizeOffset.bottom = resizeOffset.right;
                }
            } else if (direction == 'sw') {
                if (resizeOffset.left > resizeOffset.bottom) {
                    resizeOffset.left = resizeOffset.bottom * picRatio;
                } else {
                    resizeOffset.bottom = resizeOffset.left;
                }
            } else if (direction == 'nw') {
                if (resizeOffset.left > resizeOffset.top) {
                    resizeOffset.left = resizeOffset.top * picRatio;
                } else {
                    resizeOffset.top = resizeOffset.left;
                }
            } else if (direction == 'ne') {
                if (resizeOffset.right > resizeOffset.top) {
                    resizeOffset.right = resizeOffset.top * picRatio;
                } else {
                    resizeOffset.top = resizeOffset.right;
                }
            }

            if (direction == 'se') {
                if (e.deltaX >= resizeOffset.right) {
                    offset.right = resizeOffset.right;
                    offset.bottom = resizeOffset.right / picRatio;
                } else {
                    offset.right = e.deltaX;
                    offset.bottom = e.deltaX / picRatio;
                }
            } else if (direction == 'ne') {
                if (e.deltaX >= resizeOffset.right) {
                    offset.right = resizeOffset.right;
                    offset.top = resizeOffset.right / picRatio;
                } else {
                    offset.right = e.deltaX;
                    offset.top = e.deltaX / picRatio;
                }
            } else if (direction == 'e') {
                if (e.deltaX >= resizeOffset.right) {
                    offset.right = resizeOffset.right;
                } else {
                    offset.right = e.deltaX;
                }
            } else if (direction == 'sw') {
                if (-e.deltaX >= resizeOffset.left) {
                    offset.left = resizeOffset.left;
                    offset.bottom = resizeOffset.left / picRatio;
                } else {
                    offset.left = -e.deltaX;
                    offset.bottom = -e.deltaX / picRatio;
                }
            } else if (direction == 'nw') {
                if (-e.deltaX >= resizeOffset.left) {
                    offset.left = resizeOffset.left;
                    offset.top = resizeOffset.left / picRatio;
                } else {
                    offset.left = -e.deltaX;
                    offset.top = -e.deltaX / picRatio;
                }
            } else if (direction == 'w') {
                if (-e.deltaX >= resizeOffset.left) {
                    offset.left = resizeOffset.left;
                } else {
                    offset.left = -e.deltaX;
                }
            } else if (direction == 'n') {
                if (-e.deltaY >= resizeOffset.top) {
                    offset.top = resizeOffset.top;
                } else {
                    offset.top = -e.deltaY;
                }
            } else if (direction == 's') {
                if (e.deltaY >= resizeOffset.bottom) {
                    offset.bottom = resizeOffset.bottom;
                } else {
                    offset.bottom = e.deltaY;
                }
            }

            let newTop = originElementPos.top - offset.top;
            let newHeight = originElementPos.height + offset.top + offset.bottom;
            let newLeft = originElementPos.left - offset.left;
            let newWidth = originElementPos.width + offset.left + offset.right;

            if (newHeight < MIN_SIZE) {
                if (this.eventData.currentDirection == 'n' || this.eventData.currentDirection == 'ne' || this.eventData.currentDirection == 'nw') {
                    newTop += newHeight;
                    newTop -= MIN_SIZE;
                }
                newHeight = MIN_SIZE;
            }
            if (newWidth < MIN_SIZE) {
                if (this.eventData.currentDirection == 'w' || this.eventData.currentDirection == 'nw' || this.eventData.currentDirection == 'sw') {
                    newLeft += newWidth; 
                    newLeft -= MIN_SIZE;
                }
                newWidth = MIN_SIZE;
            }

            this.value.top = newTop;
            this.value.height = newHeight;
            this.value.left = newLeft;
            this.value.width = newWidth;
          }
      },
      endResize(e) {
          e.srcEvent.stopPropagation();
          e.preventDefault();
          this.eventData.currentDirection = '';
          this.eventData.resize = false;

          this.editorData.currentAction.resize = false;
      },
      startRotate(e) {
          e.srcEvent.stopPropagation();
          this.recordStartPos();
          this.eventData.rotate = true;
          this.eventData.select = true;
          this.notifySelect();

          this.editorData.currentAction.rotate = true;
      },
      rotating(e) {
        e.srcEvent.stopPropagation();
        if (this.eventData.rotate) {
            let elRect = this.$el.getBoundingClientRect();
            let centerTop = elRect.top + this.eventData.originElementPos.height / 2;
            let centerLeft = elRect.left + this.eventData.originElementPos.width / 2;

            let px = centerLeft, py = centerTop, mx = e.center.x, my = e.center.y;

            let x = Math.abs(px-mx);
            let y = Math.abs(py-my);
            let z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            let cos = y/z;
            let radina = Math.acos(cos);//用反三角函数求弧度
            let angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

            if(mx > px && my > py){//鼠标在第四象限
                angle = 180 - angle;
            }

            if(mx == px && my > py){//鼠标在y轴负方向上
                angle = 180;
            }

            if(mx > px && my == py){//鼠标在x轴正方向上
                angle = 90;
            }

            if(mx < px && my > py){//鼠标在第三象限
                angle = 180 + angle;
            }

            if(mx < px && my== py){//鼠标在x轴负方向
                angle = 270;
            }

            if(mx < px && my < py){//鼠标在第二象限
                angle = 360 - angle;
            }

            this.value.rotate = angle;   
        }
      },
      endRotate(e) {
        e.srcEvent.stopPropagation();
        this.eventData.rotate = false;

        this.editorData.currentAction.rotate = false;
      },
      startMove(e) {
          e.srcEvent.stopPropagation();
          this.recordStartPos();

          if (this.elementType == 'text' && this.textIsEditing == true) {
              this.eventData.move = false;
          } else {
              this.eventData.move = true;
              this.notifySelect();

              this.editorData.currentAction.move = true;
          }
      },
      moving(e) {
        e.srcEvent.stopPropagation();
        if (this.eventData.move) {        
            var offset = {
                top: 0,
                left: 0
            };

            let elRect = this.$el.getBoundingClientRect();
            let editorBodyRect = this.editorBody.getBoundingClientRect();

            let maxOffsetLeft = this.eventData.originElementRect.left - editorBodyRect.left;
            let maxOffsetRight = editorBodyRect.right - this.eventData.originElementRect.right;
            if (-e.deltaX >= maxOffsetLeft) {
                offset.left = -maxOffsetLeft;
            } else if (e.deltaX >= maxOffsetRight) {
                offset.left = maxOffsetRight;
            } else {
                offset.left = e.deltaX;
            }

            let maxOffsetTop = this.eventData.originElementRect.top - editorBodyRect.top;
            let maxOffsetBottom = editorBodyRect.bottom - this.eventData.originElementRect.bottom;
            if (-e.deltaY >= maxOffsetTop) {
                offset.top = -maxOffsetTop;
            } else if (e.deltaY >= maxOffsetBottom) {
                offset.top = maxOffsetBottom;
            } else {
                offset.top = e.deltaY;
            }
            
            this.eventData.moveOffset = offset;
            this.$el.style.transform = `translate3d(${offset.left}px, ${offset.top}px, 1px) rotate(${this.value.rotate}deg)`;
        }
      },
      endMove(e) {
          e.srcEvent.stopPropagation();
          if (this.eventData.move) {
            this.value.left = this.eventData.originElementPos.left + this.eventData.moveOffset.left;
            this.value.top = this.eventData.originElementPos.top + this.eventData.moveOffset.top;
            this.$el.style.transform = `rotate(${this.value.rotate}deg)`;
            this.eventData.move = false;

            this.editorData.currentAction.move = false;
          }
      },
      // 记录元素起始位置
      recordStartPos() {
          let { top, left, width, height } = this.value;
          this.eventData.originElementPos.top = top;
          this.eventData.originElementPos.left = left;
          this.eventData.originElementPos.width = width;
          this.eventData.originElementPos.height = height;

          this.eventData.originElementRect = this.$el.getBoundingClientRect();
      }
  },
  computed: {
      editorWrapper() {
          let parentEl = this.$el;
          while(parentEl.className != 'editor-wrapper') {
              parentEl = parentEl.parentElement;
          }

          return parentEl;
      },
      editorBody() {
          let parentEl = this.$el;
          while(parentEl.className != 'editor-body') {
              parentEl = parentEl.parentElement;
          }

          return parentEl;
      },
      currentPageSize() {
          return this.$parent.$parent.pageSize;
      },
      editorData() {
          return this.editorParent.getEditorData();
      }
  },
  directives: {
      panstart: HammerJS.panstart,
      panmove: HammerJS.panmove,
      panend: HammerJS.panend,
      tap: HammerJS.tap
  },
  filters: {
      Obj2CSS,
      Obj2CSSOpacity
  }
}
</script>

<style lang="scss" scoped>
    .element-box {
        position: absolute;
        user-select: none;

        &.element-move {
            opacity: .4;
        }

        .element-content {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .content-inner {
            width: 100%;
            height: 100%;
        }

        .bar {
            position: absolute;
        }
        .bar-line {
            width: 2px;
            height: 18px;
            background: currentColor;
            top: -18px;
            left: 50%;
        }
        .bar.bar-rotate {
            top: -30px;
            left: 50%;
            margin-left: -5px;
            background: black;
            border: none;
            cursor: move;
        }
        .bar-radius {
            width: 12px;
            height: 12px;
            border-radius: 12px;
            background: white;
            border: 1px solid currentColor;
        }
        .bar-n {
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            cursor: n-resize;
        }
        .bar-s {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            cursor: n-resize;
        }
        .bar-w {
            top: 0;
            left: 0;
            width: 1px;
            height: 100%;
            background: currentColor;
            cursor: e-resize;
        }
        .bar-e {
            top: 0;
            right: 0;
            width: 1px;
            height: 100%;
            background: currentColor;
            cursor: e-resize;
        }
        .bar-rn {
            top: -6px;
            left: 50%;
            margin-left: -6px;
            cursor: n-resize;
        }
        .bar-rs {
            bottom: -6px;
            left: 50%;
            margin-left: -6px;
            cursor: s-resize;
        }
        .bar-rw {
            top: 50%;
            left: -6px;
            margin-top: -6px;
            cursor: w-resize
        }
        .bar-re {
            top: 50%;
            right: -6px;
            margin-top: -6px;
            cursor: e-resize;
        }
        .bar-rnw {
            top: -6px;
            left: -6px;
            cursor: nw-resize;
        }
        .bar-rne {
            top: -6px;
            right: -6px;
            cursor: ne-resize;
        }
        .bar-rsw {
            left: -6px;
            bottom: -6px;
            cursor: sw-resize;
        }
        .bar-rse {
            right: -6px;
            bottom: -6px;
            cursor: se-resize;
        }
    }

</style>
