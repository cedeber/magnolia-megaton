/**
 * Mouse Event polyfill
 */
try {
    new MouseEvent('test');
} catch (e) {
    var MouseEvent = function (eventType, params) {
        var mouseEvent = document.createEvent('MouseEvent');

        params = params || { bubbles: false, cancelable: false };
        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        return mouseEvent;
    };

    MouseEvent.prototype = Event.prototype;
    window.MouseEvent = MouseEvent;
}
