var OneFingerTouch = (function(){
    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup',
        cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
        pageX = hasTouch ? 'pageX' : 'clientX',
        pageY = hasTouch ? 'pageY' : 'clientY',
        options = {
            touching: false
        },
        
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
                enableHistory: false,
                debug: false,
                eventLevel: 0
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
            this._resetStored();

            this.touch = {
                identifier: touch.identifier,
                startTime: this.stored.time,
                delay: this.stored.delay,
                ignore: null,
                startX: touch[pageX],
                startY: touch[pageY],
                pageX: touch[pageX],
                pageY: touch[pageY],
                deltaX: 0,
                deltaY: 0,
                duration: 0,
                distance: 0,
                totalDistance: 0,
                speed: 0,
                direction: 'tap'
            }
    
            if (this.stored.delay > this.options.delayFilter){
                this._resetDirection('withoutEvent');

                options.touching = true;
            } else {
                this.touch.ignore = 'delay';
            }
        },
        
        _moveTouch: function(touch){
            this._store(touch);
            
            this.touch.pageX = touch[pageX];
            this.touch.pageY = touch[pageY];
            this.touch.deltaX = this.touch.pageX - this.touch.startX;
            this.touch.deltaY = this.touch.pageY - this.touch.startY;
            this.touch.duration = Date.now() - this.touch.startTime;
            if (this.options.calcSpeed || this.options.calcDistance){
                this.touch.distance = parseInt(Math.sqrt((this.touch.deltaX * this.touch.deltaX) + (this.touch.deltaY * this.touch.deltaY)), 10);
                this.touch.totalDistance += this.stored.distance;
                this.touch.speed = parseInt((this.touch.totalDistance / this.touch.duration * 1000), 10);
            }
            if (this.touch.direction == 'tap') this.touch.direction = null;

            this._changeDirection(this._getDirection());

            if (this.touch.direction){
                if (!this.stored.deltaMaxX || (this.stored.deltaX < 0 && this.stored.deltaX < this.stored.deltaMaxX) || (this.stored.deltaX > 0 && this.stored.deltaX > this.stored.deltaMaxX)){
                    this.stored.deltaMaxX = this.stored.deltaX;
                } else if ((Math.abs(this.stored.deltaMaxX) - Math.abs(this.stored.deltaX)) > this.options.minMove) {
                    this._resetDirection();
                }

                if (!this.stored.deltaMaxY || (this.stored.deltaY < 0 && this.stored.deltaY < this.stored.deltaMaxY) || (this.stored.deltaY > 0 && this.stored.deltaY > this.stored.deltaMaxY)){
                    this.stored.deltaMaxY = this.stored.deltaY;
                } else if ((Math.abs(this.stored.deltaMaxY) - Math.abs(this.stored.deltaY)) > this.options.minMove) {
                    this._resetDirection();
                }
            }
        },
        
        _endTouch: function(touch){            
            this.stored.oldTime = Date.now();
            this.stored.finger = null;

            this.touch.duration = Date.now() - this.touch.startTime;

            if (this.touch.direction == 'tap' && this.touch.duration < this.options.tapDuration){
                this.touch.direction = null;
                this.touch.ignore = 'tapDuration';
            }
            
            options.touching = false;
        },

        // Store touch values between touches
        _store: function(touch){
            this.stored.deltaX = touch[pageX] - this.stored.startX;
            this.stored.deltaY = touch[pageY] - this.stored.startY;
            if (this.options.calcSpeed || this.options.calcDistance){
                this.stored.distanceX =  touch[pageX] - (this.stored.oldPageX || 0);
                this.stored.distanceY =  touch[pageY] - (this.stored.oldPageY || 0);
                this.stored.distance = parseInt(Math.sqrt((this.stored.distanceX * this.stored.distanceX) + (this.stored.distanceY * this.stored.distanceY)), 10);
            }
            this.stored.oldPageX = touch[pageX];
            this.stored.oldPageY = touch[pageY];            
            
            // deltaMaxX, deltaMaxY are stored by _moveTouch()
            // startX, startY are stored by _resetDirection()
        },

        _resetStored: function(){
            this.stored.time = Date.now();
            this.stored.delay = this.stored.time - (this.stored.oldTime || 0);

            this.stored.startX = this.stored.startY = this.stored.deltaX =
            this.stored.deltaY = this.stored.deltaMaxX = this.stored.deltaMaxY =
            this.stored.distanceX = this.stored.distanceY = this.stored.distance =
            this.stored.oldPageX = this.stored.oldPageY = 0;

            // deltaMaxX, deltaMaxY are also reset by _resetDirection()
        },
        
        // Handle events
        handleEvent: function(event){
            switch (event.type){
                case startEvent:
                    this._log('start');
                    this._start(event);
                    break;
                case moveEvent:
                    this._log('move');
                    this._move(event);
                    break;
                case cancelEvent:
                    this._log('cancel');
                    this._cancel(event);
                    break;
                case endEvent:
                    this._log('end');
                    this._end(event);
                    break;
            }
        },
        
        _start: function(event){
            // Ignore if we are already tracking a finger
            if (options.touching) return this._ignoreTouch(event);
            
            if (this.options.stopPropagation) event.stopPropagation();
            
            this._startTouch(hasTouch ? event.touches[0] : event);
            
            if (!this.touch.ignore){
                this.context.addEventListener(moveEvent, this, false);
                this.context.addEventListener(endEvent, this, false);
                this.context.addEventListener(cancelEvent, this, false);
            }
            
            this._fireEvent(this.touch.ignore || 'start');
        },
        
        _move: function(event){
            // Ignore if more than one finger is touching
            if (hasTouch && event.touches.length > 1) return this._ignoreTouch(event);

            if (this.options.preventDefault) event.preventDefault();
            if (this.options.stopPropagation) event.stopPropagation();

            this._moveTouch(hasTouch ? event.touches[0] : event);

            this._fireEvent('move');            
        },
        
        _cancel: function(event){
            // Forward
            this._end(event);
        },
        
        _end: function(event){
            // If it's not the last finger ending the touch, 
            // forward to _move() to find out where the first one has gone
            if (hasTouch && event.touches.length) return this._move(event);
            
            if (this.options.stopPropagation) event.stopPropagation();
    
            this.context.removeEventListener(moveEvent, this, false);
            this.context.removeEventListener(endEvent, this, false);
            this.context.removeEventListener(cancelEvent, this, false);

            this._endTouch();
            
            this._fireEvent('end');
        },

        _ignoreTouch: function(event){
            if (this.options.preventDefault) event.preventDefault();
            if (this.options.stopPropagation) event.stopPropagation();
    
            this._fireEvent('ignore');
        },

        _fireEvent: function(type){
            var event;
            var log = type;

            // Construct event, depending on options.eventLevel
            switch (this.options.eventLevel){
                
                // Direction/tap event
                case 0:
                    if (type == 'end' && !this.touch.ignore && this.touch.direction){
                        event = document.createEvent("Event");
                        event.initEvent('onefingertouch', true, true);
                        event.onefingertouch = this.touch;
                        
                        log = this.touch.direction;
                    }
                    break;
                    
                // All internal events
                case 1:
                    event = document.createEvent("Event");
                    event.initEvent('onefingertouch-' + type, true, true);
                    event.onefingertouch = this.touch;
                    break;
                    
                // All events to a single listener
                case 2:
                    event = document.createEvent("Event");
                    event.initEvent('onefingertouch', true, true);
                    event.onefingertouch = {type: type, touch: this.touch};
                    break;
            }
            
                // enable history, could go here ? e.g.:
                // 
                // history.push(event.onefingertouch);
            
            if (event){
                this._log('_' + log);
                this.context.dispatchEvent(event);
            }
        },

        // Where's the finger going
        _getDirection: function(){
            var foundDirection = false;
            
            if (Math.abs(this.stored.deltaX) > this.options.minMove || Math.abs(this.stored.deltaY) > this.options.minMove){
                var triangle = {
                    side: {
                        a: Math.abs(this.stored.deltaY),
                        b: Math.abs(this.stored.deltaX),
                        c: null
                    },
                    angle: {
                        A: null,
                        B: null,
                        C: null
                    }
                };

                triangle.side.c = Math.sqrt((triangle.side.a * triangle.side.a) + (triangle.side.b * triangle.side.b));

                var above = (triangle.side.b * triangle.side.b) + (triangle.side.c * triangle.side.c) - (triangle.side.a * triangle.side.a);
                var below = 2 * triangle.side.b * triangle.side.c;

                triangle.angle.A = ((180/Math.PI) * Math.acos(above/below)) || 90;

                for (var direction in this.directions){
                    if (!foundDirection && this.directions[direction](this.stored.deltaX, this.stored.deltaY, triangle.angle.A)) foundDirection = direction;
                }
            }
    
            return foundDirection;
        },
        
        _changeDirection: function(direction){
            if (direction && direction != this.touch.direction){
                this.touch.direction = direction;

                this._fireEvent('directionChange');
            }
        },

        _resetDirection: function(withoutEvent){
            if (this.touch.direction != 'tap') this.touch.direction = null;
    
            this.stored.deltaMaxX = this.stored.deltaMaxY = 0;
            this.stored.startX = this.touch.pageX;
            this.stored.startY = this.touch.pageY;

            if (!withoutEvent) this._fireEvent('resetDirection');
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

        },

        // Debugging
        _log: function(log){
            if (this.options.debug) console.log(log);
        }
    };
    
    return OneFingerTouch;
})();