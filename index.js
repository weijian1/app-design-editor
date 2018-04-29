import AppDesignEditor from './src/AppDesignEditor.vue'
import './src/assets/scss/icon.scss'
import Vue from 'vue'

const components = [
    AppDesignEditor,
];

function install(Vue) {
    components.map(component => {
        Vue.component(component.name, component);
    });
}


export default install;