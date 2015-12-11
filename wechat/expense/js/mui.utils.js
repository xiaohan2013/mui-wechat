;(function(m){
	try {
		getComputedStyle(undefined)
	} catch(e) {
		var nativeGetComputedStyle = getComputedStyle;
		window.getComputedStyle = function(element){
		  try {
		    return nativeGetComputedStyle(element)
		  } catch(e) {
		    return null
		  }
		}
	}
	function defaultDisplay(nodeName) {
		var element, display
		if (!elementDisplay[nodeName]) {
			element = document.createElement(nodeName)
			document.body.appendChild(element)
			display = getComputedStyle(element, '').getPropertyValue("display")
			element.parentNode.removeChild(element)
			display == "none" && (display = "block")
			elementDisplay[nodeName] = display
		}
		return elementDisplay[nodeName]
	}
	m.fn.hide = function(){
		return this.each(function(){
	        this.style.display = "none";
	    })
	};
	m.fn.show = function(){
		return this.each(function(){
	        this.style.display == "none" && (this.style.display = '')
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	};
})(mui)