define([], function(){
	var _isShow = false;
	var $tag, $toys;
	var ctn, basicwrap;

	var combine = function(){
		if($tag){ document.getElementById("js-mobile-tagcloud").innerHTML = $tag.innerHTML; }
		if($toys){ document.getElementById("js-mobile-toys").innerHTML = $toys.innerHTML; }
	};

	var renderDOM = function(){
		var $viewer = document.createElement("div");
		$viewer.id = "viewer";
		$viewer.className = "hide";
		$tag = document.getElementById("js-tagcloud");
		$toys = document.getElementById("js-toys");
		var tagStr = $tag ? '<span class="viewer-title">标签</span><div class="viewer-div tagcloud" id="js-mobile-tagcloud"></div>' : "";
		var toysStr = $toys ? '<span class="viewer-title">一些小玩意儿</span><div class="viewer-div toys" id="js-mobile-toys"></div>' : "";
		$viewer.innerHTML = '<div id="viewer-box"><div class="viewer-box-l"><div class="viewer-header"><span class="viewer-header-title">导航</span><span class="viewer-close" id="viewer-close" aria-label="关闭"><i class="fa-solid fa-xmark"></i></span></div><div class="viewer-box-wrap">'+toysStr+tagStr+'</div></div><div class="viewer-box-r"></div></div>';
		document.getElementsByTagName("body")[0].appendChild($viewer);
		basicwrap = document.getElementById("viewer-box");
	};

	var show = function(){
		document.getElementById("viewer").className = "";
		basicwrap.className = "";
		_isShow = true;
		setTimeout(function(){ basicwrap.className = "anm-swipe"; }, 20);
	};

	var hide = function(){
		if(!_isShow) return;
		_isShow = false;
		basicwrap.className = "";
		setTimeout(function(){
			var v = document.getElementById("viewer");
			if(v && !_isShow){ v.className = "hide"; }
		}, 300);
	};

	var bindDOM = function(){
		var onTransEnd = function(){
			if(!_isShow){ document.getElementById("viewer").className = "hide"; }
		};
		basicwrap.addEventListener("transitionend", onTransEnd, false);
		basicwrap.addEventListener("webkitTransitionEnd", onTransEnd, false);

		ctn.addEventListener("click", function(e){
			e.stopPropagation();
			_isShow ? hide() : show();
		}, false);

		var $right = document.getElementsByClassName("viewer-box-r")[0];
		if($right){ $right.addEventListener("click", function(){ hide(); }, false); }

		var $close = document.getElementById("viewer-close");
		if($close){ $close.addEventListener("click", function(){ hide(); }, false); }

		document.addEventListener("keydown", function(e){
			if(e.key === "Escape" && _isShow){ hide(); }
		}, false);

		var $overlay = $("#mobile-nav .overlay");
		var $header = $(".js-mobile-header");
		window.onscroll = function(){
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollTop >= 69){ $overlay.addClass("fixed"); }else{ $overlay.removeClass("fixed"); }
			if(scrollTop >= 160){ $header.removeClass("hide").addClass("fixed"); }else{ $header.addClass("hide").removeClass("fixed"); }
		};
		if($header[0]){
			$header[0].addEventListener("click", function(){ $('html, body').animate({scrollTop:0}, 'slow'); }, false);
		}
	};

	return {
		init: function(){
			ctn = document.getElementsByClassName("slider-trigger")[0];
			if(!ctn) return;
			renderDOM();
			combine();
			bindDOM();
		}
	};
});
