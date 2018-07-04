<template>
    <div class="editor-context-menu" :style="`left: ${showPosition.left}px; top: ${showPosition.top}px;`">
        <template v-if="selectElementIndex.length > 0">
            <ul>
                <li><a href="#" @click="clickEditElement">编辑</a></li>
            </ul>
            <ul>
                <li><a href="#" @click="clickCopyElement">复制</a></li>
                <li :class="canPaste == false ? 'disabled' : ''"><a href="#" @click="clickPasteElement">粘贴</a></li>
                <li><a href="#" @click="clickDeleteElement">删除</a></li>
            </ul>
            <!-- <ul>
                <li><a href="#">上移一层</a></li>
                <li><a href="#">下移一层</a></li>
                <li><a href="#">置于顶层</a></li>
                <li><a href="#">置于底层</a></li>
            </ul> -->
        </template>
        <template v-else>
            <ul>
                <li :class="canPaste == false ? 'disabled' : ''"><a href="#" @click="clickPasteElement">粘贴</a></li>
            </ul>
        </template>
    </div>
</template>

<script>
    import EditorMinxin  from './Mixins/Editor'

    export default {
        mixins: [ EditorMinxin ],
        props: {
            showPosition: {
                type: Object,
                default: {
                    left: 0,
                    top: 0
                }
            },
            selectElementIndex: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                canPaste: false
            }
        },
        watch: {
            showPosition(newVal, oldVal) {
                this.showPosition = newVal;
            },
            selectElementIndex(newVal, oldVal) {
                this.selectElementIndex = newVal;
            }
        },
        mounted() {
            this.$parent.$watch('editorData.clipboardElement', (newVal, oldVal) => {
                if (newVal.length > 0) {
                    this.canPaste = true;
                } else {
                    this.canPaste = false;
                }
            });

            this.canPaste = this.$parent.$data.editorData.clipboardElement.length > 0 ? true : false;
        },
        methods: {
            clickEditElement() {
                this.$emit('editelement');
            },
            clickCopyElement() {
                this.$emit('copyelement');
            },
            clickPasteElement() {
                this.$emit('pasteelement');
            },
            clickDeleteElement() {
                this.$emit('deleteelement');
            }
        }
    }
</script>

<style lang="scss" scoped>
.editor-context-menu {
    position: absolute;
    z-index: 2000;
    background: #fcfcfc;
    border: solid 1px #f2f2f2;
    ul {
        list-style-type: none;
        width: 117px;
        font-size: 14px;
        margin: 0;
        border-bottom: solid 1px #f2f2f2;
        color: #4c4c4c;
        padding-left: 0;
        li {
            line-height: 34px;
        }
        li.disabled a {
            pointer-events: none;
            color: #808080;
        }
        a {
            display: block;
            padding-left: 18px;
            color: #4c4c4c;
            text-decoration: none;
        }
        a:hover {
            color: #000;
        }
        &:last-child {
            border-bottom: 0;
        }
    }
}
</style>
