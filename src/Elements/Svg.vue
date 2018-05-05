<template>
  <element-border v-model="value.base_css" :selected="selected" :elementType="value.element_type">
    <div class="content-inner" v-html="svg_html"></div>
    <span class="svg-wrapper" :style="imgCss"></span>
  </element-border>
</template>

<script>
import ElementBorder from './../ElementImgBorder.vue'
import MixinElement from './../Mixins/Element'
import Obj2CSS from './../Filters/Obj2CSS'
import Base64Util from './../Utils/Base64'
import JQuery from 'jquery'

export default {
    mixins: [ MixinElement ],
    data() {
        return {
            svg_html: ''
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
        updateSvg(newVal, oldVal) {
            let svgEl = this.$el.querySelector(".content-inner svg");
            svgEl.style.fill = newVal;

            this.value.svg.property.svgBase64 = 'data:image/svg+xml;base64,' + Base64Util.encode(svgEl.parentElement.innerHTML);
        }
    },
    mounted() {
        this.svg_html = Base64Util.decode(this.value.svg.property.svgBase64);
        this.$watch('value.svg.property.fill', this.updateSvg);
        this.$nextTick(() => {
            this.updateSvg(this.value.svg.property.fill, '');
        });
    },
    computed: {
        imgCss() {
            return {
                backgroundImage: `url('${this.value.svg.property.svgBase64}')`,
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
