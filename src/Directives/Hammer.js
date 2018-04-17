import HammerJS from 'hammerjs'

function createHammerEventListener(eventName, el, callback) {
    let hammer = new Hammer(el);
    hammer.options.domEvents = true;
    if (eventName == 'pan' || eventName == 'panstart' || eventName == 'panmove' || eventName == 'panend') {
        hammer.get('press').options.enable = false;
        hammer.get('swipe').options.enable = false;
        hammer.get('tap').options.enable = false;

        hammer.get('pan').set({
            threshold: 0
        });
    }

    hammer.on(eventName, callback);
}

export default {
    pan: {
        bind(el, bingding) {
            createHammerEventListener('pan', el, bingding.value);
        }
    },
    panstart: {
        bind(el, bingding) {
            createHammerEventListener('panstart', el, bingding.value);
        }
    },
    panmove: {
        bind(el, bingding) {
            createHammerEventListener('panmove', el, bingding.value);
        }
    },
    panend: {
        bind(el, bingding) {
            createHammerEventListener('panend', el, bingding.value);
        }
    },
    tap: {
        bind(el, bingding) {
            createHammerEventListener('tap', el, bingding.value);
        }
    }
}