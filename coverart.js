var imageLoader = (function() {
    return {
        arrayToDataUrl: function(image) {
            var base64String = "";
            for (var i = 0; i < image.data.length; i++) {
                base64String += String.fromCharCode(image.data[i]);
            }
            return "data:" + image.format + ";base64," + window.btoa(base64String);
        }
    }
}());
