import EditorMinxin  from './Editor'

export default {
    mixins: [ EditorMinxin ],
    data() {
        return {
            selected: false,
            elementIndex: '',
            base_css: {
                top: '',
                left: '',
                width: '',
                height: '',
                position: '',
                fontSize: '',
                fontWeight: '',
                fontStyle: '',
                textDecoration: '',
                textAlign: '',
                lineHeight: '',
                opacity: 1,
                padding: '',
                rotate: '',
                zIndex: '',
                borderColor: '',
                borderWidth: '',
                borderStyle: '',
                borderRadius: ''
              }
        }
    },
    props: {
        index: {
            required: true
        }
    },
    mounted() {
        this.elementIndex = this.index;
        this.$children[0].$on('elementchange', (selected) => {
            if (selected) {
                this.editorParent.onElementChange(this.elementIndex);
            } else {
                this.editorParent.onElementChange(null);
            }

            this.selected = selected;
        });
    },
    methods: {
        unselect() {
            this.selected = false;
        },
        select() {
            this.selected = true;
        }
    }
}