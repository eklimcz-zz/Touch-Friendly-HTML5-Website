// A simpler image loader implementation inspired by http://thecodecentral.com/2008/02/21/a-useful-javascript-image-loader

	var imgLoader = function(urls) {
		this.urls = urls || {};
		this.imgs = [];
		this.number_total_assets_to_load = 0;
	    this.current_number_loaded = 0;
    	this.progress_number = 0;
	};
	
	imgLoader.prototype = {
		load: function() {

			var deets = [];
			for(var u in this.urls) {
				this.number_total_assets_to_load++;
				if(!this.urls.hasOwnProperty(u)) { continue; }				
				deets.push(u);
			}
		
									
			for(var i = 0; i < deets.length; i++) {
				var imgDeet = deets[i],
					self = this;				
				// Wrapped in a closure to isolate each iterations load.
				(function(name, url, s) {
					setTimeout(function() {
						s.loadImg(name, url);
					}, 100);
				})(imgDeet, this.urls[imgDeet], self);
								
			}
		},
		loadImg: function(name, url) {
			var img = new Image(),
			self = this;
				
			img.src = url;
			img.alt = name;						
			
			img.onerror = function() {
				console.log('Error Loading Image', name, url, img);
			};
			
			img.onload = function() {
				
				var o = {				
					img: img,
					name: name,
					url: url
				};
				
				self.current_number_loaded ++;
       		 	self.progress_number = Math.round((self.current_number_loaded / self.number_total_assets_to_load)*100);                       				
				self.onImgLoaded(self.progress_number);					

				if(self.progress_number == 100)		                				            
        		       self.onComplete();	            	       			
			};
			
			this.imgs.push(img); 
		},
		onImgLoaded: function(){
		},
		onComplete: function(){

		}
	};
	
	// List of our images.
	var imgs = {
			
			img1: 'images/1.jpg',
			img2: 'images/2.jpg',
			img3: 'images/3.jpg',
			img4: 'images/4.jpg',
			img5: 'images/5.jpg',
			img6: 'images/6.jpg',
			img7: 'images/7.jpg',
			img8: 'images/8.jpg',
			img9: 'images/9.jpg',
			img10: 'images/10.jpg',											
			img11: 'images/11.jpg',											
			img12: 'images/12.jpg',											
			img13: 'images/13.jpg',											
			img14: 'images/14.jpg',											
			img15: 'images/15.jpg',											
			img16: 'images/16.jpg',											
			img17: 'images/17.jpg',											
			img18: 'images/18.jpg',											
			img19: 'images/19.jpg',
			img20: 'images/20.jpg'						
		}	
	
