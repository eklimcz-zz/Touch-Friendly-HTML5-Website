var Scroller = new
function() {

	//Public Properties                                                   
	this.scroller = null;
	this.offsetX;
	this.offsetY;

	//Private Properties            
	var _mouseDown = false,
		_prevMouseX = 0,
		_prevMouseY = 0,
		_lastX, 
		_lastY, 
		_prevViewportX, 
		_prevViewportY, 
		_roundedViewportX = 0,
		_roundedViewportY = 0,
		_moveThreshold = 10,
		_targetX = 0,
		_targetY = 0,
		_viewPortX = 0,
		_viewPortY = 0,
		_curVelX = 0,
		_curVelY = 0,
		_curInertiaX = 0,
		_curInertiaY = 0,
		_prevMotion = 0,
		_direction = 0,
		_directionY, _processInertia = false,
		_viewPortMax = 0,
		_viewPortMin = 0,
		_lastMotion, _didDrag = false,
		self = this,
		_scrollDirection, 
		_eventType, 
		_selectorType = 'img',
		_clickElement,
		_supportsTransforms = Modernizr.csstransforms3d;

	this.init = function(ele, scrollDirection, useTouch) {

		this.scroller = ele;
		_scrollDirection = scrollDirection;
		_eventType = useTouch ? "touch" : "mouse";

		if (_scrollDirection == 'y') {

			//TODO:  Hard Coded Values should be dynamic
			this.scroller.style.width = '640px';
			this.scroller.className = 'hCenter';	
			this.scroller.style.marginLeft = '-320px';		
			_viewPortMax = this.scroller.clientHeight;
		}

		else if (_scrollDirection == 'x') {
		
			//TODO:  Hard Coded Values should be dynamic
			this.scroller.style.width = '12900px'; 
			this.scroller.style.height = '410px';
			this.scroller.className = 'vCenter';	
			this.scroller.style.marginTop = '-205px';		
			_viewPortMax =  this.scroller.clientWidth
		}

		this.addEventHandlers(_eventType);
			
		$(this.scroller).bind(this._dragStartEvt, this._dragStartCB);
	 	this.setElementTransform(this.scroller, 1 + "px", 0 + "px");  //reduces flicker for ios             	               

		this.animate();
	}
	
	this.changeOrientation = function(isPortrait){
	
		if(isPortrait){
			_scrollDirection = 'y';
			this.scroller.style.width = '640px';
			this.scroller.style.height = '8200px';
			this.scroller.className = this.scroller.className.replace(new RegExp('(^|\\s+)' + 'vCenter' + '(\\s+|$)'), 'hCenter');
			this.scroller.style.marginLeft = '-320px';		
			_viewPortMax = this.scroller.clientHeight;
		}
		else {
			_scrollDirection = 'x';
			this.scroller.style.width = '12900px';
			this.scroller.style.height = '410px';
			this.scroller.className = this.scroller.className.replace(new RegExp('(^|\\s+)' + 'hCenter' + '(\\s+|$)'), 'vCenter');
			this.scroller.style.marginTop = '-205px';		
			_viewPortMax =  this.scroller.clientWidth;
		}
	}


	///////////////////////////////////SCROLLER EVENTS///////////////////////////////////////////
	this.PreventSelection = function(mouseEvent) {
		mouseEvent.preventDefault();
	}

	this.OnMouseLost = function(mouseEvent) {
		this.OnMouseUp(mouseEvent);
	}

	this.OnMouseDown = function(e, ex, ey) {
		if(e.target.nodeName === _selectorType);
			_clickElement = e.target;
		
		_prevMouseX = ex;
		_prevMouseY = ey;
		_curInertiaX = 0;
		_curInertiaY = 0;
		_curVelX = 0;
		_curVelY = 0;
		_lastMotion = new Date().getTime();
		_lastX = _targetX;
		_lastY = _targetY;
		_mouseDown = true;
		_didDrag = false;

		this.enableTracking();
		e.preventDefault();

	}

	this.OnMouseMove = function(e, ex, ey) {

		if (_mouseDown) {
			var timeNow = new Date().getTime();
			var newX = ex;
			var newY = ey;
			var deltaX = newX - _prevMouseX;
			var deltaY = newY - _prevMouseY;

			if (_scrollDirection == 'x' && Math.abs(deltaX) < _moveThreshold) return false;
			if (_scrollDirection == 'y' && Math.abs(deltaY) < _moveThreshold) return false;

			_prevMouseX = newX;
			_prevMouseY = newY;
			_lastMotion = timeNow;

			if (_scrollDirection == 'y') {

				if ((_targetY) > 0 && (_targetY < _viewPortMax - browser_height)) _targetY -= deltaY;
				else _targetY -= deltaY / 3;

				var dY = _targetY - _lastY;
				_lastY = _targetY;

				var velocityY = Math.abs(dY);
				_curVelY += (velocityY - _curVelY) * .3;
				_directionY = dY < 0 ? -1 : 1;

			}
			else {

				if ((_targetX) > 0 && (_targetX < _viewPortMax - browser_width)) _targetX -= deltaX;
				else _targetX -= deltaX / 3;

				var dX = _targetX - _lastX;
				_lastX = _targetX;

				var velocity = Math.abs(dX);
				_curVelX += (velocity - _curVelX) * .3;
				_direction = dX < 0 ? -1 : 1;

			}
			_didDrag = true;
		}
	}

	this.OnMouseUp = function(e) {

		if (_mouseDown) {

			_mouseDown = false;
			_curInertiaX = Math.abs(_curVelX);
			_curInertiaY = Math.abs(_curVelY);
			_processInertia = true;
			var timeNow = new Date().getTime();
			var deltaTime = timeNow - _lastMotion;
			deltaTime = Math.max(10, deltaTime);
			_lastMotion = 0;
			_curVelX *= 1 - Math.min(1, Math.max(0, deltaTime / 100));
			_curVelY *= 1 - Math.min(1, Math.max(0, deltaTime / 100));
		}

		_prevMouseX = 0;
		_prevMouseY = 0;

		this.disableTracking();
		
		if(!_didDrag && _clickElement != null)										
			self.onItemClicked(_clickElement);
		
		
		return _didDrag ? false : undefined;
	}

	this.onItemClicked = function(){
		
	}
	
	
	this.draw = function() {

		this.update();
	}


	this.update = function() {

		if (_scrollDirection == 'x') {

			if (_processInertia) {

				_targetX += _curVelX * _direction;
				_curVelX *= .9;

				if (_targetX < _viewPortMin) {
					_curVelX = 0;
					_targetX = _viewPortMin;
					_processInertia = false;
				} else if (_targetX > _viewPortMax - browser_width) {
					_curVelX = 0;
					_targetX = _viewPortMax - browser_width;
					_processInertia = false;
				}

				if (_curVelX < 0.01) {
					_processInertia = false;
					_curVelX = 0;
				}
			}

			var ease = 0.12;
			var speed = (_targetX - _viewPortX) * ease;
			_viewPortX += speed;
			_roundedViewportX = Math.round(-_viewPortX);
		
			//Offset Viewport
			if (_supportsTransforms) {
				this.setElementTransform(this.scroller, _roundedViewportX + "px", 0 + "px");
				this.setElementTransform(document.getElementById('parallaxBg'), _roundedViewportX / 8 + "px", 0 + "px");
			}

			else {
				this.set2dTransform(this.scroller, _roundedViewportX + "px", 0 + "px");
				this.set2dTransform(document.getElementById('parallaxBg'), _roundedViewportX / 8 + "px", 0 + "px");
			}
		}

		else if (_scrollDirection == 'y') {
			if (_processInertia) {
				_targetY += _curVelY * _directionY;
				_curVelY *= .9;

				if (_targetY < _viewPortMin) {
					_curVelY = 0;
					_targetY = _viewPortMin;
					_processInertia = false;
				} else if (_targetY > _viewPortMax - browser_height) {
					_curVelY = 0;
					_targetY = _viewPortMax - browser_height;
					_processInertia = false;
				}
				if (_curVelY < 0.01) {
					_processInertia = false;
					_curVelY = 0;
				}
			}
			var ease = 0.12;
			var speedY = (_targetY - _viewPortY) * ease;
			_viewPortY += speedY;
			_roundedViewportY = Math.round(-_viewPortY);

			//Offset Viewport
			if (_supportsTransforms) this.setElementTransform(this.scroller, 0 + "px", _roundedViewportY + "px");

			else this.set2dTransform(this.scroller, 0 + "px", _roundedViewportY + "px");
		}
		
			this.offsetX = _roundedViewportX;
			this.offsetY = _roundedViewportY;
	}


	this.set2dTransform = function(ele, x, y) {

		var v = "translate(" + x + "," + y + ")";
		ele.style.transform = v;
		ele.style.WebkitTransform = v;
		ele.style.msTransform = v;
		ele.style.MozTransform = v;
		
	}

	this.setElementTransform = function(ele, x, y) {

		var v = "translate3d(" + x + "," + y + ", 0px)";		
		ele.style.transform = v;
		ele.style.WebkitTransform = v;
	}

	this.animate = function() {

		Scroller.draw();
		requestAnimFrame(Scroller.animate);
	}

	this.enableTracking = function() {

		$(this.scroller).bind(this._dragMoveEvt, this._dragMoveCB);
		$(this.scroller).bind(this._dragStopEvt, this._dragStopCB);
	}

	this.disableTracking = function() {

		$(this.scroller).unbind(this._dragMoveEvt, this._dragMoveCB);
		$(this.scroller).unbind(this._dragStopEvt, this._dragStopCB);
	}

	this.addEventHandlers = function(eventType) {

		if (eventType === 'mouse') {

			this._dragStartEvt = "mousedown";
			this._dragStartCB = function(e) {
				return self.OnMouseDown(e, e.clientX, e.clientY);
			};

			this._dragMoveEvt = "mousemove";
			this._dragMoveCB = function(e) {
				return self.OnMouseMove(e, e.clientX, e.clientY);
			};

			this._dragStopEvt = "mouseup";
			this._dragStopCB = function(e) {
				return self.OnMouseUp(e);
			};

			this._dragOutEvt = 'mouseout';
			this._dragOutCB = function(e) {
				return self.OnMouseUp(e);
			}

			$(window).bind(this._dragOutEvt, this._dragOutCB, true);
			$('document').bind('mousedown', this.PreventSelection)


		} else {

			this._dragStartEvt = "touchstart";
			this._dragStartCB = function(e) {
				var t = e.touches[0];
				return self.OnMouseDown(e, t.pageX, t.pageY);
			};

			this._dragMoveEvt = "touchmove";
			this._dragMoveCB = function(e) {
				var t = e.touches[0];
				return self.OnMouseMove(e, t.pageX, t.pageY);
			};

			this._dragStopEvt = "touchend";
			this._dragStopCB = function(e) {
				return self.OnMouseUp(e);
			};
		}
	}
	
	this.resize = function(){

			
	}

	
};
