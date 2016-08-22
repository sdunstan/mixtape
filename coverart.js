/*jshint esversion: 6 */

module.exports = (function() {
    return {
        arrayToDataUrl: function(image) {
            let base64String = '';
            for (let i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
            }
            return 'data:' + image.format + ';base64,' + window.btoa(base64String);
        }
    };
}());
