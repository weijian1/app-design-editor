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
        <template v-if="listeners.rotate">
            <div class="bar bar-radius bar-rotate" v-panstart="startRotate" v-panmove="rotating" v-panend="endRotate"></div>
            <div class="bar bar-line"></div>
        </template>
        <div class="bar bar-n directoin-n" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-s directoin-s" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-w directoin-w" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-e directoin-e" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rn direction-n" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rs direction-s" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rw direction-w" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-re direction-e" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rnw direction-nw" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rne direction-ne" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rsw direction-sw" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
        <div class="bar bar-radius bar-rse direction-se" v-panstart="startResize" v-panmove="resizing" v-panend="endResize"></div>
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
      },
      textIsEditing: {

      },
      listeners: {
          default() {
            return {
                resize: true,
                resizeDirection: [],
                resizeEqualProportion: false,
                rotate: true,
                move: true
            };
          }
      }
  },
  data() {
      return {
          mouseEnter: false,
          specialCssProperty: ['opacity', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color'],
          eventCommonDefine: {
            n: {
                axis: 'deltaY',
                direction: 'top'
            },
            s: {
                axis: 'deltaY',
                direction: 'bottom'
            },
            w: {
                axis: 'deltaX',
                direction: 'left'
            },
            e: {
                axis: 'deltaX',
                direction: 'right'
            }
        },
          eventData: {
            tempOpacity: 1,
            currentDirection: '',
            originElementPos: {
                top: 0,
                left: 0,
                width: 0,
                height: 0
            },
            originElementRect: {},
            eventMaxOffset: {},
            resizeOffset: {},
            moveOffset: {},
            resize: false,
            rotate: false,
            move: false,
          }
      }
            },
  methods: {
    // 记录元素起始位置
    recordStartPos() {
        let { top, left, width, height } = this.value;
        this.eventData.originElementPos.top = top;
        this.eventData.originElementPos.left = left;
        this.eventData.originElementPos.width = width;
        this.eventData.originElementPos.height = height;

        this.eventData.originElementRect = this.$el.getBoundingClientRect();
    },
      initStartEventData(e) {
        let { top, left, width, height } = this.value;
        this.eventData.originElementPos.top = parseFloat(top);
        this.eventData.originElementPos.left = parseFloat(left);
        this.eventData.originElementPos.width = parseFloat(width);
        this.eventData.originElementPos.height = parseFloat(height);

        this.eventData.originElementRect = this.$el.getBoundingClientRect();

        let arrClassList = e.target.classList.value.split(' ');

        for (let i = 0, len = arrClassList.length; i < len; i++) {
            let directionClass = 'direction-';
            let directionTextIndex = arrClassList[i].indexOf(directionClass);
            if (directionTextIndex == 0) {
                this.eventData.currentDirection = arrClassList[i].substr(directionClass.length);
                break;
            }
        }
    },
    formatSize(newTop, newLeft, newWidth ,newHeight) {
        this.value.top = parseFloat(newTop.toFixed(2));
        this.value.height = parseFloat(newHeight.toFixed(2));
        this.value.left = parseFloat(newLeft.toFixed(2));
        this.value.width = parseFloat(newWidth.toFixed(2));
    },
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

          if (this.listeners.resize == true) {
            this.initStartEventData(e);

            let direction = this.eventData.currentDirection;
            let borderRatio = this.eventData.originElementRect.width / this.eventData.originElementRect.height;
            let rectOriginEl = this.$el.getBoundingClientRect();
            let rectEditorRect = this.bodyParent.$el.getBoundingClientRect();

            let maxOffset = {
                left: rectOriginEl.left - rectEditorRect.left,
                top: rectOriginEl.top - rectEditorRect.top,
                right: rectEditorRect.right - rectOriginEl.right,
                bottom: rectEditorRect.bottom - rectOriginEl.bottom
            };

            if (this.listeners.resizeEqualProportion == true) {
                if (direction == 'se') {
                    if (maxOffset.bottom < maxOffset.right / borderRatio) {
                        maxOffset.right = maxOffset.bottom * borderRatio;
                    } else {
                        maxOffset.bottom = maxOffset.right / borderRatio;
                    }
                } else if (direction == 'sw') {
                    if (maxOffset.bottom < maxOffset.left / borderRatio) {
                        maxOffset.left = maxOffset.bottom * borderRatio;
                    } else {
                        maxOffset.bottom = maxOffset.left / borderRatio;
                    }
                } else if (direction == 'nw') {
                    if (maxOffset.top < maxOffset.left / borderRatio) {
                        maxOffset.left = maxOffset.top * borderRatio;
                    } else {
                        maxOffset.top = maxOffset.left / borderRatio;
                    }
                } else if (direction == 'ne') {
                    if (maxOffset.top < maxOffset.right / borderRatio) {
                        maxOffset.right = maxOffset.top * borderRatio;
                    } else {
                        maxOffset.top = maxOffset.right / borderRatio;
                    }
                } 
            }

            this.eventData.eventMaxOffset = maxOffset;

            this.eventData.resize = true;
            this.eventData.select = true;
            this.notifySelect();

            this.editorData.currentAction.resize = true;
          }
      },
      resizing(e) {
          e.srcEvent.stopPropagation();
          e.preventDefault();
          if (this.eventData.resize) {
            let direction = this.eventData.currentDirection;
            let allowDirection = this.listeners.resizeDirection.filter(item => item == direction);
            let borderRatio = this.eventData.originElementRect.width / this.eventData.originElementRect.height;

            if (this.listeners.resizeDirection.length == 0 || allowDirection.length == 1) {
                let originElementPos = this.eventData.originElementPos;
                let offset = {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                };

                let maxOffset = this.eventData.eventMaxOffset;
                const MIN_SIZE = 2;

                if (this.listeners.resizeEqualProportion == false) {
                    for (let i = 0; i < direction.length; i++) {
                        let commonDefine = this.eventCommonDefine[direction[i]];
                        let delta = e[commonDefine.axis];
                        delta = direction[i] == 'n' || direction[i] == 'w' ? -delta : delta;
                        let offsetLength = maxOffset[commonDefine.direction];

                        if (delta >= offsetLength) {
                            offset[commonDefine.direction] = offsetLength;
                        } else {
                            offset[commonDefine.direction] = delta;
                        }
                    }
                } else {
                    for (let i = 0; i < 1; i++) {
                        let commonDefine = this.eventCommonDefine[direction[i]];
                        let delta = e[commonDefine.axis];
                        delta = direction[i] == 'n' || direction[i] == 'w' ? -delta : delta;
                        let offsetLength = maxOffset[commonDefine.direction];

                        if (delta >= offsetLength) {
                            offset[commonDefine.direction] = offsetLength;
                        } else {
                            offset[commonDefine.direction] = delta;
                        }
                    }

                    if (direction.length == 2) {
                        let sourceCommonDefine = this.eventCommonDefine[direction[0]];
                        let commonDefine = this.eventCommonDefine[direction[1]];
    
                        offset[commonDefine.direction] = offset[sourceCommonDefine.direction] * borderRatio;
                    }
                }
                
                let newTop = originElementPos.top - offset.top;
                let newHeight = originElementPos.height + offset.top + offset.bottom;
                let newLeft = originElementPos.left - offset.left;
                let newWidth = originElementPos.width + offset.left + offset.right;

                if (newHeight < MIN_SIZE) {
                    if (direction.indexOf('n') >= 0) {
                        newTop += newHeight;
                        newTop -= MIN_SIZE;
                    }
                    newHeight = MIN_SIZE;
                }
                if (newWidth < MIN_SIZE) {
                    if (direction.indexOf('w') >= 0) {
                        newLeft += newWidth; 
                        newLeft -= MIN_SIZE;
                    }
                    newWidth = MIN_SIZE;
                }

                this.formatSize(newTop, newLeft, newWidth, newHeight);
            }
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

          if (this.listeners.rotate == true) {
            this.recordStartPos();
            this.eventData.rotate = true;
            this.eventData.select = true;
            this.notifySelect();

            this.editorData.currentAction.rotate = true;
          }
      },
      rotating(e) {
        e.srcEvent.stopPropagation();
        if (this.eventData.rotate) {
            let elRect = this.eventData.originElementRect;
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

          if (this.listeners.move == true) {
            if (this.elementType == 'text' && this.textIsEditing == true) {
                this.eventData.move = false;
            } else {

                let rectOriginEl = this.$el.getBoundingClientRect();
                let rectEditorRect = this.bodyParent.$el.getBoundingClientRect();

                let maxOffset = {
                    left: rectOriginEl.left - rectEditorRect.left,
                    top: rectOriginEl.top - rectEditorRect.top,
                    right: rectEditorRect.right - rectOriginEl.right,
                    bottom: rectEditorRect.bottom - rectOriginEl.bottom
                };
                this.eventData.eventMaxOffset = maxOffset;

                this.recordStartPos();
                this.eventData.move = true;
                this.notifySelect();

                this.editorData.currentAction.move = true;
            }
          }
      },
      moving(e) {
        e.srcEvent.stopPropagation();

        if (this.eventData.move == true) {        
            let offset = {
                top: 0,
                left: 0
            };

            let originEl = this.eventData.originElementPos;
            let maxOffset = this.eventData.eventMaxOffset;

            if (e.deltaX < 0) {
                if (-e.deltaX >= maxOffset.left) {
                    offset.left = -maxOffset.left;
                } else {
                    offset.left = e.deltaX;
                }
            } else if (e.deltaX > 0) {
                if (e.deltaX >= maxOffset.right) {
                    offset.left = maxOffset.right;
                } else {
                    offset.left = e.deltaX;
                }
            }

            if (e.deltaY < 0) {
                if (-e.deltaY >= maxOffset.top) {
                    offset.top = -maxOffset.top;
                } else {
                    offset.top = e.deltaY;
                }
            } else if (e.deltaY > 0) {
                if (e.deltaY >= maxOffset.bottom) {
                    offset.top = maxOffset.bottom;
                } else {
                    offset.top = e.deltaY;
                }
            }

            this.eventData.moveOffset = offset;
            this.$el.style.transform = `translate3d(${offset.left}px, ${offset.top}px, 1px) rotate(${this.value.rotate}deg)`;
        }
      },
      endMove(e) {
          e.srcEvent.stopPropagation();
          e.preventDefault();
          if (this.eventData.move) {
            this.value.left = Math.ceil(this.eventData.originElementPos.left + this.eventData.moveOffset.left);
            this.value.top = Math.ceil(this.eventData.originElementPos.top + this.eventData.moveOffset.top);
            this.$el.style.transform = `rotate(${this.value.rotate}deg)`;
            this.eventData.move = false;

            this.editorData.currentAction.move = false;
          }
      }
  },
  computed: {
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
