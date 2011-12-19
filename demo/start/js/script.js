var touchEl = document.getElementById('touch');
var touchTracker = new OneFingerTouch(touchEl);

touchEl.addEventListener('onefingertouch-start', function(e){ console.log(e.onefingertouch); });