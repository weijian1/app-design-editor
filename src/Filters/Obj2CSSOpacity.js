export default function(value) {
    let resultCss = { transform: '' };

    if (typeof value.opacity != 'undefined') {
        resultCss.opacity = 1 - value.opacity;
    }

    return resultCss;
}