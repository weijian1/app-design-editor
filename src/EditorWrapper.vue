<template>
  <div class="editor-wrapper" :class="currentAction" :style="wrapperStyle | Obj2CSS">
      <div class="editor-content">
        <editor-header v-model="header" :navbar="defaultEditorStyle.navbar"></editor-header>
        <editor-body v-model="value" :editorStyle="defaultEditorStyle"></editor-body>
        <div class="editor-drag" v-panstart="pageHeightDragStart" v-panmove="pageHeightDrag" v-panend="pageHeightDragEnd" :class="{'draging': eventData.isPageDragable == true}">
            <div class="editor-drag-tip"><i class="icon icon-down"></i><span>拖动调节页面高度</span><i class="icon icon-up"></i></div>
        </div>
      </div>
    <button class="save-btn" title="保存模板" @click="clickSave">
        <i class="icon-save">
            <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="200px" height="200px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve">
            <path d="M166.293,1.167H33.704c-17.943,0-32.537,14.594-32.537,32.537v132.598c0,17.933,14.594,32.532,32.537,32.532
                h132.598c17.933,0,32.532-14.6,32.532-32.532V33.704C198.834,15.761,184.234,1.167,166.293,1.167z M42.438,9.415h115.12
                c-0.032,0.206-0.123,0.395-0.123,0.609V66.85c0,5.555-4.522,10.081-10.077,10.081H52.643c-5.556,0-10.082-4.521-10.082-10.081
                V10.024C42.561,9.81,42.471,9.621,42.438,9.415z M190.581,166.302c0,13.391-10.896,24.283-24.288,24.283H33.704
                c-13.392,0-24.289-10.896-24.289-24.283V33.704c0-13.392,10.896-24.289,24.289-24.289h0.733c-0.033,0.206-0.124,0.396-0.124,0.609
                v56.829c0,10.102,8.224,18.33,18.333,18.33h94.703c10.11,0,18.334-8.224,18.334-18.333V10.024c0-0.214-0.091-0.403-0.123-0.609
                h0.732c13.392,0,24.288,10.9,24.288,24.289V166.302z"/>
            <path d="M128.407,61.504c2.285,0,4.125-1.845,4.125-4.123V28.967c0-2.273-1.84-4.122-4.125-4.122
                c-2.278,0-4.127,1.849-4.127,4.122v28.415C124.28,59.66,126.133,61.504,128.407,61.504z"/>
            </svg>
        </i>
    </button>
  </div>
</template>

<script>
import EditorHeader from './EditorHeader.vue'
import EditorBody from './EditorBody.vue'
import HammerJS from './Directives/Hammer'
import EditorMinxin  from './Mixins/Editor'
import Obj2CSS from './Filters/Obj2CSS'

export default {
    mixins: [ EditorMinxin ],
    components: {
        EditorHeader,
        EditorBody
    },
    props: {
        value: {
            required: true
        },
        header: {
            required: true
        },
        footer: {
            required: true
        }
    },
    data() {
        return {
            defaultEditorStyle: {
                navbar: {
                    height: 44
                },
                width: 375,
                height: 647,
                paddingSize: 12,
                borderSize: 1
            },
            eventData: {
                currentPageHeight: 0,
                isPageDragable: false,
                maxOffset: {
                    height: 0
                },
                minPos: {
                    height: 0
                }
            }
        }
    },
    methods: {
        pageHeightDragStart(e) {
            this.editorParent.unselectElemnt();

            this.eventData.currentPageHeight = this.value.property.height;

            let rectWrapper = this.$el.getBoundingClientRect();
            let rectDrag = this.$el.querySelector(".editor-drag").getBoundingClientRect();
            let rectNavbar = this.$el.querySelector(".editor-header").getBoundingClientRect();
            let elChildren = this.bodyChildren.$el.children;
            let maxChildrenTopHeight = 0;
            let maxChildrenRect = {};

            for (let i = 0, len = elChildren.length; i < len; i++) {
                // tabbar 不加入判断
                if (elChildren[i].__vue__ && elChildren[i].__vue__.elementType != 'tabbar') {
                    let rectChildren = elChildren[i].getBoundingClientRect();
                    let childrenTopHeight = rectChildren.top + rectChildren.height;

                    if (childrenTopHeight > maxChildrenTopHeight) {
                        maxChildrenTopHeight = childrenTopHeight;
                        maxChildrenRect = rectChildren;
                    }
                }
            }

            let navbarTopHeight = rectNavbar.top + rectNavbar.height;
            let minHeight = maxChildrenTopHeight - navbarTopHeight;
            let bodyHeight = this.defaultEditorStyle.height - this.defaultEditorStyle.navbar.height;
            if (minHeight < bodyHeight) {
                minHeight = bodyHeight;
            }
            
            this.eventData.minPos.height = minHeight;
            this.eventData.maxOffset.height = rectDrag.top - maxChildrenTopHeight;

            this.eventData.isPageDragable = true;
            this.editorParent.editorData.currentAction.move = true;
        },
        pageHeightDrag(e) {
            let pageMinHeight = this.defaultEditorStyle.height - this.defaultEditorStyle.navbar.height;
            let pageNewHeight = this.eventData.currentPageHeight + e.deltaY;

            if (-e.deltaY > this.eventData.maxOffset.height) {
                this.value.property.height = this.eventData.minPos.height;
            } else if (pageMinHeight <= pageNewHeight) {
                this.value.property.height = pageNewHeight;
            } else {
                this.value.property.height = pageMinHeight;
            }
        },
        pageHeightDragEnd() {
            this.eventData.isPageDragable = false;
            this.editorParent.editorData.currentAction.move = false;
        },
        clickSave() {
            this.editorParent.onSaveButtonClick();
        }
    },
    directives: HammerJS,
    computed: {
        wrapperStyle: function() {
            let defaultEditorStyle = this.defaultEditorStyle;
            let width = defaultEditorStyle.width + defaultEditorStyle.paddingSize * 2 + defaultEditorStyle.borderSize * 2;
            
            let paddingTop = defaultEditorStyle.paddingSize,
                paddingLeft = defaultEditorStyle.paddingSize,
                paddingRight = defaultEditorStyle.paddingSize;
            return { width, paddingLeft, paddingRight, paddingTop };
        },
        currentAction() {
            let editor = this.$parent;
            return editor.$data.editorData.currentAction;
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>

<style lang="scss" scoped>
    .editor-wrapper {
        position: absolute;
        width: 401px;
        height: auto;
        left: 0;
        right: 0;
        top: 8vh;
        margin: auto;
        border: 1px dashed #c7c6c6;
        margin-bottom: 100px;
        padding: 12px;
        padding-bottom: 0;
        background: white;
        box-sizing: border-box;

        .editor-drag {
            cursor: n-resize;
            .editor-drag-tip {
                padding: 5px 10px;
                margin: 0 auto;
                line-height: 36px;
                text-align: center;
                span {
                    color: #808080;
                    margin-left: 10px;
                    margin-right: 10px;
                }
                i.icon {
                    display: inline-block;
                    width: 10px;
                    height: 12px;
                }
            }
        }
        &.resize, &.move, &.rotate {
            pointer-events: none;
        }

        button.save-btn {
            position: absolute;
            right: -54px;
            bottom: 40px;
            width: 36px;
            height: 36px;
            background: #4d4d4d;
            border-radius: 36px;
            border: none;
            i {
                display: block;
                width: 18px;
                height: 18px;
                position: relative;
                margin: 0 auto;
            }
            svg {
                width: 18px;
                height: 18px;
                fill: white;
            }
            &:hover {
                background: black;
                svg {
                    fill: white;
                }
            }
        }
    }
</style>
