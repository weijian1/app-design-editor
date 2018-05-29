<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.elementable_type" :listeners="borderListeners">
    <div class="content-inner" v-html="svg_html"></div>
    <span class="svg-wrapper" :style="imgCss | Obj2CSS"></span>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import Base64Util from './../Utils/Base64'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            svg_html: '',
            borderListeners: {
                move: true,
                rotate: true,
                resize: true,
                resizeEqualProportion: true,
                resizeDirection: []
            }
        }
    },
    components: {
        ElementBorder
    },
    props: {
        value: {
            
        }
    },
    methods: {
        updateSvgColor(newVal, oldVal) {
            let svgEl = this.$el.querySelector(".content-inner svg");
            svgEl.style.fill = newVal;

            this.value.svg.property.svgBase64 = 'data:image/svg+xml;base64,' + Base64Util.encode(svgEl.parentElement.innerHTML);
        },
        updateBase64(newVal) {
            this.svg_html = Base64Util.decode(newVal);
            this.$el.querySelector('.content-inner').innerHTML = this.svg_html;
            this.updateSvgColor(this.value.svg.property.fill, '');
        }
    },
    mounted() {
        this.svg_html = Base64Util.decode(this.value.svg.property.svgBase64);
        this.$watch('value.svg.property.fill', this.updateSvgColor);
        this.$watch('value.svg.property.svgBase64', this.updateBase64);
        this.$nextTick(() => {
            this.updateSvgColor(this.value.svg.property.fill, '');
        });
    },
    computed: {
        imgCss() {
            return {
                borderRadius: this.value.base_css.borderRadius,
                backgroundImage: this.value.svg.property.svgBase64,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center'
            };
        }
    },
    filters: {
        Obj2CSS
    }
}
</script>


<style lang="scss" scoped>
    .element-content {
        .content-inner {
            width: 100%;
            height: 100%;
            pointer-events: none;
            visibility: hidden;
        }
        span.svg-wrapper {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: block;
        }
    }
</style>
