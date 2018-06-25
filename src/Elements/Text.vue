<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :textIsEditing="isEditing" v-cloak v-show="isLoadFinish">
    <div class="content-inner" @dblclick="showEditor" v-html="value.content"></div>
  </element-border>
</template>


<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import EditorMinxin from './../Mixins/Editor'
import JQuery from 'jquery'
import Bootstrap from 'bootstrap'
import SummerNote from 'summernote'
import 'summernote/dist/lang/summernote-zh-CN'
import 'summernote/dist/summernote.css'

export default {
    mixins: [ MixinElement, EditorMinxin ],
    data() {
        return {
            isEditing: false,
            tempContent: ''
        }
    },
    components: {
        ElementBorder
    },
    props: {
        value: {
            
        }
    },
    watch: {
        selected(newValue, oldValue) {
            if (newValue == false && this.isEditing == true) {
                this.destroyEditor();
                this.isEditing = false;
            }
        }
    },
    methods: {
        showEditor(e) {
            e.preventDefault();
            let that = this;
            let textEditorConfig = this.editorParent.textEditorConfig;
            $(this.$el).find('.content-inner').summernote({
                airMode: true,
                dialogsInBody: true,
                lang: "zh-CN",
                disableDragAndDrop: true,
                focus: true,
                fontNames: typeof textEditorConfig.fontNames != "undefined" ? textEditorConfig.fontNames : [],
                fontSizes: typeof textEditorConfig.fontSizes != "undefined" ? textEditorConfig.fontSizes : [],
                popover: {
                    disableDragAndDrop: true,
                    air: [
                        ['font', ['fontname', 'fontsize', 'color']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['para', ['paragraph', 'height']],
                    ]
                },
                callbacks: {
                    onInit: function() {
                        let div = $(this).parent().find('.note-editable')[0];
                        let range = document.createRange();
                        let len = div.innerText.length;
                        range.setStart(div, 0);
                        range.setEnd(div, 1);
                        getSelection().empty();
                        getSelection().addRange(range);

                        div.addEventListener('dragstart', function(e) {
                            e.preventDefault();
                        });

                        $(this).data('summernote').options.modules.airPopover.prototype.hide = function() {};
                        $(this).data('summernote').modules.airPopover.update();

                        that.isEditing = true;
                    },
                    onKeydown: function() {
                        let textHeight = $(this).parent().find('.note-editor').height();
                        let elHeight = that.value.base_css.height;

                        if (textHeight >= elHeight) {
                            that.value.base_css.height = textHeight;
                        }

                        $(this).data('summernote').modules.airPopover.update();
                    },
                    onChange: function(text) {
                        that.tempContent = text;
                    },
                    onPaste: function(e) {
                        e.preventDefault();
                        let insertText = e.originalEvent.clipboardData.getData('text');
                        document.execCommand('insertText', 0, insertText);
                    }
                }
            });
        },
        destroyEditor() {
            // 销毁summernote
            $(this.$el).find('.content-inner').summernote('destroy');
            if (this.tempContent != '') {
                this.value.content = this.tempContent;
                this.tempContent = '';
            }
        }
    }
}
</script>


<style lang="scss">
    .element-content, .note-editor, .note-editing-area, .note-editable {
        min-height: 100%;
        word-wrap: break-word;
    }
    .element-content {
        output {
            padding: 0!important;
        }
        .note-editing-area .note-editable {
            user-select: text;
        }
        .content-inner, .note-editor .note-editable {
            p {
                margin: 0;
            }
        }
    }

    .note-popover .dropdown-menu.dropdown-fontsize {
        max-height: 250px;
        overflow-y: scroll;
    }
</style>
