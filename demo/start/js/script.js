var touch = new OneFingerTouch('#touch');

document.getElementById('touch').addEventListener('onefingertouch-start', function(e){ console.log(e.onefingertouch); });