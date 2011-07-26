//Global Vars
var min_width = 1024,
	min_height = 768,
	browser_width, 
	browser_height, 
	loader, 
	self = this;


$.ready(function () {

    var footerOpen = false;
    var myTweenable;

	//Shrink it down for iPhone
    var viewport = document.querySelector("meta[name=viewport]");
    if (navigator.userAgent.match(/iPhone/i)) viewport.setAttribute('content', 'width=device-width; initial-scale=.33; maximum-scale=1.0; user-scalable=0;');

    //load animation framework if there is no css animation/transition support
    Modernizr.load({
        test: Modernizr.csstransforms3d,
        nope: 'js/shifty.min.js',
        complete: function () {
            if (!Modernizr.csstransforms3d)
                myTweenable = (new Tweenable()).init();
        }
    });

    browser_width = window.innerWidth;
    browser_height = window.innerHeight;

	//Resize screen containers
    var container = document.getElementById('container');
    container.style.width = browser_width + 'px';
    container.style.height = browser_height + 'px';

	//Wire up common events
    var btnExpander = document.getElementById('btnExpand');
    $(btnExpander).bind('click', function () {
        ToggleFooter()
    });

    Scroller.onItemClicked = function (data) {
        CreateLightBox(data);
    }

    PositionFooter();
    PreloadImages();


    function PreloadImages() {
		
		var indicator = document.getElementById('progressBar');
		var progressNum = document.getElementById('progressNumber');
		var ldr = document.getElementById('loader');
		var container = document.getElementById('container');

        loader = new imgLoader(imgs);
        loader.load();
        loader.onComplete = function () {
			container.removeChild(ldr);
            init();
        };
        
        loader.onImgLoaded = function(num){
			//Draw Indicator on screen
			var w = browser_width * (num / 100);
			indicator.style.width = w+'px';
			progressNum.innerHTML = num + '%';			
        };
    }

    function BuildDomItems() {

        for (var i = 0; i < loader.imgs.length; i++) {

            var listImg = document.createElement("img");
            listImg.setAttribute("src", loader.imgs[i].src);
            listImg.className = ('listItem');
            document.getElementById('dataList').appendChild(listImg);
        }
    }

    function init() {

        BuildDomItems();  //Add images to list
        var list = document.getElementById('dataList');
        Scroller.init(list, 'x', $.hasTouch); //'x' or 'y'
    }


    function ToggleFooter() {

        var footer = document.getElementById('footer');
        var btn = document.getElementById('btnExpand');

        if ($.has3d) {  //if css3d transforms are supported

            if (!footerOpen) {
                footerOpen = true;
                set3dTranslate(footer, 0 + 'px', -150 + 'px');
                set3dRotate(btn, 180);
            }
            else {
                footerOpen = false;
                set3dTranslate(footer, 0 + 'px', 0 + 'px');
                set3dRotate(btn, 0);
            }
        }

        else {

            //Using Lightweight animation tweener Shifty.js as alternative
            if (!footerOpen) {
                footerOpen = true;
                myTweenable.tween({
                    from: { 'top': 0, 'rotate': 0 },
                    to: { 'top': -150, 'rotate': 180 },
                    'duration': 350, 'step': function () {
                        set2dTranslate(footer, 0 + 'px', this.top + 'px');
                        set2dRotate(btn, this.rotate);
                    }, 'easing': 'easeInOutQuad'
                });
            }
            else {
                footerOpen = false;
                myTweenable.tween({
                    from: { 'top': -150, 'rotate': 180 },
                    to: { 'top': 0, 'rotate': 0 },
                    'duration': 350, 'step': function () {
                        set2dTranslate(footer, 0 + 'px', this.top + 'px');
                        set2dRotate(btn, this.rotate);
                    }, 'easing': 'easeInOutQuad'
                });
            }
        }
    }


    function PositionFooter() {

        var footer = document.getElementById('footer');
        var footerHeight = footer.clientHeight;
        footer.style.top = browser_height - footerHeight + 'px'; //needed for iOS 
        footer.style.opacity = 1;
    }

    function HandleResize() {

        browser_width = window.innerWidth;
        browser_height = window.innerHeight;

        var container = document.getElementById('container');
        container.style.width = browser_width + 'px';
        container.style.height = browser_height + 'px';

        PositionFooter();

    }

    function CreateLightBox(img) {

        img.style.opacity = 0;
        var offset = findPos(img);
        var container = document.getElementById('container');
        var overlay = document.getElementById('modal');
        overlay.style.display = 'block';

        var centerX = browser_width / 2;
        var centerY = browser_height / 2;
        var distFromCenter = ((offset.X + Scroller.offsetX) - centerX) + ((img.clientWidth * 1.5) / 2);

        var displayImg = document.createElement('img');
        displayImg.className = 'listDisplayItem';
		displayImg.id = 'placeHolder';
        displayImg.setAttribute("src", img.src);
		
		var itemClickCB = function(e) {  //Scale Down Image Close Lightbox
				
			$(overlay).unbind('click', itemClickCB);
			
			if ($.has3d) {
                $(displayImg).bind('webkitTransitionEnd', function () {
                    overlay.style.display = 'none';
                    displayImg.parentNode.removeChild(displayImg);
                });

                displayImg.style.webkitTransform = 'scale3d(1,1,0) translate3d(' + (offset.X + Scroller.offsetX) + 'px,' + (offset.Y + Scroller.offsetY) + 'px, 0px)';
                img.style.opacity = 1;
            }else{
            
				myTweenable.tween({
                	   from: { 'scale': 1.5, 'x': (offset.X + Scroller.offsetX - distFromCenter), y: (offset.Y + Scroller.offsetY) },
                    	to: { 'scale': 1, 'x': (offset.X + Scroller.offsetX), y: (offset.Y + Scroller.offsetY) },
                    	'duration': 350, 'step': function () {
                        	set2dScaleTranslate(displayImg, this.x + 'px', this.y + 'px', this.scale, this.scale);
                    	}, 'easing': 'easeInOutQuad','fps':60,
                    	'callback': function () {
						overlay.style.display = 'none';
	                    displayImg.parentNode.removeChild(displayImg);
                    	}          
            	});
                img.style.opacity = 1;                                                                    
           }                       
		}
			
		$(overlay).bind('click', itemClickCB);
        container.appendChild(displayImg);

		//Scale up image
        if ($.has3d) {
            displayImg.style.webkitTransform = 'scale3d(1,1,0) translate3d(' + (offset.X + Scroller.offsetX) + 'px,' + (offset.Y + Scroller.offsetY) + 'px, 0px)';

            setTimeout(function () {
                displayImg.style.webkitTransform = 'scale3d(1.5,1.5,0) translate3d(' + (offset.X + Scroller.offsetX - distFromCenter) + 'px,' + (offset.Y + Scroller.offsetY) + 'px, 0px)';
                overlay.style.opacity = 1;
            }, 10);
        }
        else {
            
			set2dScaleTranslate(displayImg, (offset.X + Scroller.offsetX) + 'px', (offset.Y + Scroller.offsetY) + 'px', 1, 1);
			overlay.style.opacity = 1;

			myTweenable.tween({
                from: { 'scale': 1, 'x': (offset.X + Scroller.offsetX), 'y': (offset.Y + Scroller.offsetY)},
                to: { 'scale': 1.5, 'x':  (offset.X + Scroller.offsetX - distFromCenter), 'y' : (offset.Y + Scroller.offsetY) },
                'duration': 350, 'step': function () {
                    set2dScaleTranslate(displayImg, this.x + 'px', this.y + 'px', this.scale, this.scale);
                  }, 'easing': 'easeInOutQuad','fps':60
            });
        }
    }


    window.onorientationchange = function () {

        HandleResize();
    }

    window.onresize = function () {

        HandleResize();
    }

});
