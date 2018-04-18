export default function(value, action, actionProperty = []) {
    let resultCss = { transform: '' };
    let arrPxUnits = ['width', 'height', 'top', 'left', 'fontSize', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderWidth', 'borderRadius'];
    let arrRotateProp = ['rotate'];

    for (let key in value) {
        let propValue = value[key];
        if (propValue == '') {
            continue;
        }

        let findLength = actionProperty.filter(item => item == key).length;

        if (action == 'include' && findLength != 1) {
            continue;
        } else if (action == 'exclude' && findLength == 1) {
            continue;
        }

        if (arrPxUnits.filter(item => item == key).length == 1) {
            resultCss[key] = `${propValue}px`;
        } else if (arrRotateProp.filter(item => item == key).length == 1 && propValue != 0) {
            resultCss.transform += ` ${key}(${propValue}deg)`;
        } else if (key == 'position' && propValue == 'fixed') {
            resultCss.position = 'absolute';
        } else if (key == 'backgroundImage') {
            resultCss.backgroundImage = `url(${propValue})`;
        } else {
            resultCss[key] = value[key];
        }
    }

    console.log(resultCss);

    return resultCss;
}