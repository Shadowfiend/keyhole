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

    var size = { width: this.canvas.width, height: this.canvas.height };

    var dimensions = { x: element.offsetLeft, y: element.offsetTop,
                       width: element.offsetWidth, height: element.offsetHeight };

    // Draw the circle of goodness.
    var left = dimensions.x,
        right = dimensions.x + dimensions.width,
        top = dimensions.y,
        bottom = dimensions.y + dimensions.height,
        centerX = dimensions.x + dimensions.width / 2,
        centerY = dimensions.y + dimensions.height / 2,
        heightToElement = top + dimensions.height / 2,
        heightFromElement = size.height - heightToElement,
        ellipseVRadius = Math.sqrt(2) * dimensions.height / 2 + 10,
        ellipseHRadius = Math.sqrt(2) * dimensions.width / 2 + 10;

    var pathString =
      // top square
      'M0 ' + heightToElement + 'v-' + heightToElement + 'h' + size.width + 'v' + heightToElement +
      // first arc
      'h-' + (size.width - (centerX + ellipseHRadius)) + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 0 -' + (2 * ellipseHRadius) + ',0' +
      // bottom square
      'h-' + (centerX - ellipseHRadius) + 'v' + heightFromElement + 'h' + size.width + 'v-' + heightFromElement +
      // second arc
      'h-' + (size.width - (centerX + ellipseHRadius)) + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 1 -' + (2 * ellipseHRadius) + ',0Z';

    if (this.currentFocus) {
      this.currentFocus.animate({ path: pathString }, 750, '>');
    } else {
      this.currentFocus = this.canvas.path(pathString);
      this.currentFocus.attr({ fill: 'black', opacity: 0.7, stroke: 'none' });
    }
  }

  Keyhole.prototype.unfocus = function(callback) {
    this.currentFocus.remove();
    this.currentFocus = undefined;

    callback();
  }
})();
