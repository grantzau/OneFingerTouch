var touchEl = document.getElementById('touch');
var touchTracker = new OneFingerTouch(touchEl);

touchEl.addEventListener('onefingertouch', function(e){ log(e.onefingertouch.direction); });