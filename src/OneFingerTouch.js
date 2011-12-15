var OneFingerTouch = (function(){
    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup',
        cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
        pageX = hasTouch ? 'pageX' : 'clientX',
        pageY = hasTouch ? 'pageY' : 'clientY',
        
        OneFingerTouch = function(el, options){         
            this.context = typeof el == 'string' ? document.querySelector(el) : el;
            this.options = {
                preventDefault: true,
                stopPropagation: true,
                minMove: 30, // Pixels
                delayFilter: 500, // Milliseconds
                tapDuration: 50,
                calcSpeed: false,
                calcDistance: false,
                enableHistory: false
            };

            // User defined options
            for (i in options) this.options[i] = options[i];
            
            this.context.addEventListener(startEvent, this, false);
        };
        
    OneFingerTouch.prototype = {    
        touch: {
            identifier: null, // Unique ID of the Touch object
            startTime: null, // Milliseconds elapsed since 1 January 1970 00:00:00 UTC.
            delay: 0, // Milliseconds
            duration: 0,
            startX: 0, // Pixels
            startY: 0,
            pageX: 0,
            pageY: 0,
            deltaX: 0,
            deltaY: 0,
            distance: 0,
            totalDistance: 0,
            speed: 0, // Pixels per second
            direction: 'tap' // tap, up, down, left, right, upleft, upright, downleft, downright
        },
        stored: {
            // identifier: null,
            // time: null,
            // oldTime: null,
            // startX: 0,
            // startY: 0,
            // deltaX: 0,
            // deltaY: 0,
            // deltaMaxX: 0,
            // deltaMaxY: 0,
            // distanceX: 0,
            // distanceY: 0,
            // distance: 0,
            // oldPageX: 0,
            // oldPageY: 0
        },
        history: [],
        
        // Work the internal touch object
        _startTouch: function(touch){
            console.log(touch);
        },
        
        _updateTouch: function(touch){
            
        },
        
        _endTouch: function(touch){
            
        },
        
        _getChangedTouchByIdentifier: function(event){
            
        },

        // Store touch values between touches
        _storeTouch: function(){
            
            
            // deltaMaxX is stored by _updateTouch()
        },

        _resetStored: function(){

        },
        
        // Handle events
        handleEvent: function(event){
            switch (event.type){
                case startEvent:
                    this._start(event);
                    break;
                case moveEvent:
                    this._move(event);
                    break;
                case cancelEvent:
                    this._cancel(event);
                    break;
                case endEvent:
                    this._end(event);
                    break;
            }
        },
        
        _start: function(event){
            if (this.options.stopPropagation) event.stopPropagation();
            
            this._startTouch(event.touches ? event.touches[0] : event);
        },
        
        _move: function(event){
            
        },
        
        _cancel: function(event){
            
        },
        
        _end: function(event){
            
        },

        _ignoreTouch: function(event){

        },

        // Where's the finger going
        _calcDirection: function(){
            
        },
        
        _changeDirection: function(direction){

        },

        _resetDirection: function(withoutEvent){

        },
        
        directions: {
            // X pixels, Y pixels, A degrees
            
            'up': function(X, Y, A){
                return Y < 0 && A > 60;
            },

            'down': function(X, Y, A){
                return Y > 0 && A > 60;
            },

            'left': function(X, Y, A){
                return X < 0 && A < 30;
            },

            'right': function(X, Y, A){
                return X > 0 && A < 30;
            },

            'upleft': function(X, Y, A){
                return Y < 0 && X < 0 && A >= 30 && A <= 60;
            },

            'upright': function(X, Y, A){
                return Y < 0 && X > 0 && A >= 30 && A <= 60;
            },

            'downleft': function(X, Y, A){
                return Y > 0 && X < 0 && A >= 30 && A <= 60;
            },

            'downright': function(X, Y, A){
                return Y > 0 && X > 0 && A >= 30 && A <= 60;
            }

        }
    };
    
    return OneFingerTouch;
})();