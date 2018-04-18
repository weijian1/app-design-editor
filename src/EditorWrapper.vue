<template>
  <div class="editor-wrapper" :class="currentAction" :style="wrapperStyle | Obj2CSS">
      <div class="editor-content">
        <editor-header v-model="value.header" :navbar="defaultEditorStyle.navbar"></editor-header>
        <editor-body v-model="value.pages[this.currentPageIndex]" :editorStyle="defaultEditorStyle" :currentPageIndex="currentPageIndex"></editor-body>
        <div class="editor-drag" v-panstart="pageHeightDragStart" v-panmove="pageHeightDrag" v-panend="pageHeightDragEnd" :class="{'draging': eventData.isPageDragable == true}">
            <div class="editor-drag-tip"><i class="icon icon-down"></i><span>拖动调节页面高度</span><i class="icon icon-up"></i></div>
        </div>
      </div>
  </div>
</template>

<script>
import EditorHeader from './EditorHeader'
import EditorBody from './EditorBody'
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
        currentPageIndex: {
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

            this.eventData.currentPageHeight = this.value.pages[this.currentPageIndex].property.height;

            let rectWrapper = this.$el.getBoundingClientRect();
            let rectDrag = this.$el.querySelector(".editor-drag").getBoundingClientRect();
            let rectNavbar = this.$el.querySelector(".editor-header").getBoundingClientRect();
            let elChildren = this.bodyChildren.$el.children;
            let maxChildrenTopHeight = 0;
            let maxChildrenRect = {};

            for (let i = 0, len = elChildren.length; i < len; i++) {
                let rectChildren = elChildren[i].getBoundingClientRect();
                let childrenTopHeight = rectChildren.top + rectChildren.height;

                if (childrenTopHeight > maxChildrenTopHeight) {
                    maxChildrenTopHeight = childrenTopHeight;
                    maxChildrenRect = rectChildren;
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
                this.value.pages[this.currentPageIndex].property.height = this.eventData.minPos.height;
            } else if (pageMinHeight <= pageNewHeight) {
                this.value.pages[this.currentPageIndex].property.height = pageNewHeight;
            } else {
                this.value.pages[this.currentPageIndex].property.height = pageMinHeight;
            }
        },
        pageHeightDragEnd() {
            this.eventData.isPageDragable = false;
            this.editorParent.editorData.currentAction.move = false;
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
    }
</style>
