(function() {
  function keyhole(elementId) {
    return new Keyhole(elementId);
  }
})();

window.Keyhole = function(elementId) {
  this.canvas = Raphael(elementId, window.innerWidth, window.innerHeight);
}

Keyhole.prototype.focus = function(element) {
  if (element.length && typeof jQuery !== undefined) {
    element = element[0];
  }

  var dimensions = { x: element.offsetLeft, y: element.offsetTop,
                     width: element.offsetWidth, height: element.offsetHeight };

  // Draw the circle of goodness.
}
