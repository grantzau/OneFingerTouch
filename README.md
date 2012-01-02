# OneFingerTouch

Get information about direction, distance and speed of a swipe from both mouse and touch events.

# Documentation

## Options

### minMove

The number of pixels it takes, before we count on the movement as "intended" by the user. This is also used to reset the direction, if the pointer moves the same number of pixels in the opposite direction. My test results shows 30 px to be the most reliable.

### delayFilter

On touch devices it often happens, that the user touches the screen with a second finger just after lifting the first finger. By ignoring touches within a short period of time, after ending another touch, we can avoid mistakes. 500 ms is what I have tested to be the most reliable.

### tapDuration

As with "delayFilter", this option helps us avoid any mistaken touches. To make sure, that the user is really "tapping", we expect the tap to last for at least some time. The default value is 50 ms.

# Usage

https://github.com/grantzau/OneFingerTouch/blob/master/demo/simple/js/script.js

More demos and help will follow.

# Inspiration

Code inspired by:

https://github.com/kamicane/mootools-touch

https://github.com/cubiq/SwipeView