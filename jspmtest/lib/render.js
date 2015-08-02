    import _ from '../jspm_packages/npm/lodash-node@3.10.0/modern/lang/isEqual.js';
    import $ from '../jspm_packages/github/components/jquery@2.1.4.js';
    import underscore from 'ramonhenrique';

    export function render() {
       this.$OuterDiv = $('<div></div>')
    .hide()
    .append($('<table></table>')
        .attr({ cellSpacing : 0 })
        .addClass("text")
    );
}
