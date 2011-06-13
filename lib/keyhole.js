(function() {
  window.keyhole = function() {
    return new Keyhole();
  }

  var Keyhole = function() {
    this.canvas = Raphael(0, 0, window.innerWidth, window.innerHeight);
  }

  Keyhole.prototype.focus = function(element) {
    if (element.length && typeof jQuery !== undefined) {
      element = element[0];
    }
    if (this.currentFocus) {
      var self = this;
      this.unfocus(function() { self.focus(element) });
      return;
    }

    var dimensions = { x: element.offsetLeft, y: element.offsetTop,
                       width: element.offsetWidth, height: element.offsetHeight },
        size = { width: this.canvas.width, height: this.canvas.height };

    // Draw the circle of goodness.
    var left = dimensions.x,
        right = dimensions.x + dimensions.width,
        top = dimensions.y,
        bottom = dimensions.y + dimensions.height,
        centerX = dimensions.x + dimensions.width / 2,
        centerY = dimensions.y + dimensions.height / 2,
        heightToElement = top + dimensions.height / 2,
        heightFromElement = size.height - heightToElement,
        ellipseVRadius = Math.sqrt(2) * dimensions.height / 2,
        ellipseHRadius = Math.sqrt(2) * dimensions.width / 2;

    this.currentFocus =
      this.canvas.path(
          // top square
          'M0 ' + heightToElement + 'v-' + heightToElement + 'h' + size.width + 'v' + heightToElement +
          // first arc
          'h-' + (size.width - (centerX + ellipseHRadius)) + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 0 -' + (2 * ellipseHRadius) + ',0' +
          // bottom square
          'h-' + (centerX - ellipseHRadius) + 'v' + heightFromElement + 'h' + size.width + 'v-' + heightFromElement +
          // second arc
          'h-' + (size.width - (centerX + ellipseHRadius)) + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 1 -' + (2 * ellipseHRadius) + ',0Z');
    this.currentFocus.attr({ fill: '#000000' });
  }

  Keyhole.prototype.unfocus = function(callback) {
    this.currentFocus.remove();
    this.currentFocus = undefined;

    callback();
  }
})();
