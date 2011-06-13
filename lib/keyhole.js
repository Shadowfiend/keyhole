(function() {
  window.keyhole = function() {
    return new Keyhole();
  }

  var UNFOCUS_TIME = 0;

  var Keyhole = function() {
    this.canvas = Raphael(0, 0, window.innerWidth, window.innerHeight);
    this.queue = [];
  }

  Keyhole.prototype.focus = function(element) {
    if (typeof element === 'string') {
      element = document.getElementById(element);
    } else if (element.length && window.jQuery) {
      element = element[0];
    }

    this.queue.push([doFocus, this, element]);
    runQueue.apply(this);

    return this;
  }

  Keyhole.prototype.unfocus = function(callback) {
    this.queue.push([doUnfocus, this]);
    this.queue.push(['timeout', UNFOCUS_TIME]);
    this.queue.push([callback, this]);
    runQueue.apply(this);

    return this;
  }

  Keyhole.prototype.wait = function(timeInMs) {
    this.queue.push(['timeout', timeInMs]);
    runQueue.apply(this);

    return this;
  }

  function runQueue(forceRun) {
    if (this.queueRunning && ! forceRun)
      return;
    else
      runNext.apply(this);
  }

  function runNext() {
    if (this.queue.length) {
      this.queueRunning = true;

      var next = this.queue.splice(0, 1)[0],
          fn = next.splice(0, 1)[0],
          self = this;

      if (fn === "timeout") {
        var timeInMs = next[0];

        setTimeout(function() { runNext.apply(self) }, timeInMs);
      } else {
        var fnThis = next.splice(0, 1)[0];
        fn.apply(fnThis, next);

        setTimeout(function() { runNext.apply(self) }, 0);
      }
    } else {
      this.queueRunning = false;
    }
  }

  function doFocus(element) {
    if (element.length && typeof jQuery !== undefined) {
      element = element[0];
    }

    var size = { width: this.canvas.width, height: this.canvas.height };

    var dimensions = { x: element.offsetLeft, y: element.offsetTop,
                       width: element.offsetWidth, height: element.offsetHeight };

    // Draw the circle of goodness.
    var centerX = dimensions.x + dimensions.width / 2,
        heightToElement = dimensions.y + dimensions.height / 2,
        heightFromElement = size.height - heightToElement,
        ellipseVRadius = Math.sqrt(2) * dimensions.height / 2 + 10,
        ellipseHRadius = Math.sqrt(2) * dimensions.width / 2 + 10,
        widthToEllipse = centerX - ellipseHRadius,
        widthFromEllipse = size.width - (centerX + ellipseHRadius);

    var pathString =
      // top square
      'M0 ' + heightToElement + 'v-' + heightToElement + 'h' + size.width + 'v' + heightToElement +
      // first arc
      'h-' + widthFromEllipse + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 0 -' + (2 * ellipseHRadius) + ',0' +
      // bottom square
      'h-' + widthToEllipse + 'v' + heightFromElement + 'h' + size.width + 'v-' + heightFromElement +
      // second arc
      'h-' + widthFromEllipse + 'a' + ellipseHRadius + ',' + ellipseVRadius + ' 0 0 1 -' + (2 * ellipseHRadius) + ',0Z';

    if (this.currentFocus) {
      this.currentFocus.animate({ path: pathString }, 750, '>');
    } else {
      this.currentFocus = this.canvas.path(pathString);
      this.currentFocus.attr({ fill: 'black', opacity: 0.7, stroke: 'none' });
    }
  }

  function doUnfocus() {
    this.currentFocus.remove();
    this.currentFocus = undefined;
  }
})();
