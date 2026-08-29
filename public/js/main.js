require([], function (){

	var isMobileInit = false;
	var loadMobile = function(){
		require(['/js/mobile.js'], function(mobile){
			mobile.init();
			isMobileInit = true;
		});
	}
	var isPCInit = false;
	var loadPC = function(){
		require(['/js/pc.js'], function(pc){
			pc.init();
			isPCInit = true;
		});
	}

	require(['/js/particles.js'], function(particlesJS) {
		window.particlesJS('particles-js',

		  {
		    "particles": {
		      "number": {
		        "value": ($(window).width() < 700 ? 20 : 80),
		        "density": {
		          "enable": true,
		          "value_area": 800
		        }
		      },
		      "color": {
		        "value": ['#0fc', '#0ff', '#ccc', '#ffa500', '#7b5d5f', '#ff945c', '#cfb7c4']
		      },
		      "shape": {
		        "type": "circle",
		        "stroke": {
		          "width": 0,
		          "color": "#000000"
		        },
		        "polygon": {
		          "nb_sides": 5
		        },
		        "image": {
		          "src": "img/github.svg",
		          "width": 100,
		          "height": 100
		        }
		      },
		      "opacity": {
		        "value": 0.5,
		        "random": false,
		        "anim": {
		          "enable": false,
		          "speed": 1,
		          "opacity_min": 0.1,
		          "sync": false
		        }
		      },
		      "size": {
		        "value": 5,
		        "random": true,
		        "anim": {
		          "enable": false,
		          "speed": 40,
		          "size_min": 0.1,
		          "sync": false
		        }
		      },
		      "line_linked": {
		        "enable": true,
		        "distance": ($(window).width() < 700 ? 100 : 150),
		        "color": "#ff945c",
		        "opacity": 0.4,
		        "width": 1
		      },
		      "move": {
		        "enable": true,
		        "speed": ($(window).width() < 700 ? 3 : 6),
		        "direction": "none",
		        "random": false,
		        "straight": false,
		        "out_mode": "out",
		        "attract": {
		          "enable": false,
		          "rotateX": 600,
		          "rotateY": 1200
		        }
		      }
		    },
		    "interactivity": {
		      "detect_on": "canvas",
		      "events": {
		        "onhover": {
		          "enable": true,
		          "mode": "repulse"
		        },
		        "onclick": {
		          "enable": true,
		          "mode": "push"
		        },
		        "resize": true
		      },
		      "modes": {
		        "grab": {
		          "distance": 400,
		          "line_linked": {
		            "opacity": 1
		          }
		        },
		        "bubble": {
		          "distance": 400,
		          "size": 40,
		          "duration": 2,
		          "opacity": 8,
		          "speed": 3
		        },
		        "repulse": {
		          "distance": 200
		        },
		        "push": {
		          "particles_nb": 4
		        },
		        "remove": {
		          "particles_nb": 2
		        }
		      }
		    },
		    "retina_detect": true,
		    "config_demo": {
		      "hide_card": false,
		      "background_color": "#b61924",
		      "background_image": "",
		      "background_position": "50% 50%",
		      "background_repeat": "no-repeat",
		      "background_size": "cover"
		    }
		  }

		);
	});
	var browser={
	    versions:function(){
	    var u = window.navigator.userAgent;
	    return {
	        trident: u.indexOf('Trident') > -1, //IE内核
	        presto: u.indexOf('Presto') > -1, //opera内核
	        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
	        iPad: u.indexOf('iPad') > -1, //是否为iPad
	        webApp: u.indexOf('Safari') == -1 ,//是否为web应用程序，没有头部与底部
	        weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
	        };
	    }()
	}

	$(window).bind("resize", function(){
		if(isMobileInit && isPCInit){
			$(window).unbind("resize");
			return;
		}
		var w = $(window).width();
		if(w >= 700){
			loadPC();
		}else{
			loadMobile();
		}
	});

	if(browser.versions.mobile === true || $(window).width() < 700){
		loadMobile();
	}else{
		loadPC();
	}

	//是否使用fancybox
	if(pixieConfig.fancybox === true){
		require(['/fancybox/jquery.fancybox.js'], function(pc){
			var isFancy = $(".isFancy");
			if(isFancy.length != 0){
				var imgArr = $(".article-inner img");
				for(var i=0,len=imgArr.length;i<len;i++){
					var src = imgArr.eq(i).attr("src");
					var title = imgArr.eq(i).attr("alt");
					imgArr.eq(i).replaceWith("<a href='"+src+"' title='"+title+"' rel='fancy-group' class='fancy-ctn fancybox'><img src='"+src+"' title='"+title+"'></a>");
				}
				$(".article-inner .fancy-ctn").fancybox();
			}
		});

	}
	//是否开启动画
	if(pixieConfig.animate === true){

		require(['/js/jquery.lazyload.js'], function(){
			//avatar
			$(".js-avatar").attr("src", $(".js-avatar").attr("lazy-src"));
			$(".js-avatar")[0].onload = function(){
				$(".profilepic").addClass("show");
			}
		});

		if(pixieConfig.isHome === true){
			//content
			function showArticle(){
				$(".article").each(function(){
					if( $(this).offset().top <= $(window).scrollTop()+$(window).height() && !($(this).hasClass('show')) ) {
						$(this).removeClass("hidden").addClass("show");
						$(this).addClass("is-hiddened");
					}else{
						if(!$(this).hasClass("is-hiddened")){
							$(this).addClass("hidden");
						}
					}
				});
			}
			$(window).on('scroll', function(){
				showArticle();
			});
			showArticle();
		}

	}

	//是否新窗口打开链接
	if(pixieConfig.open_in_new == true){
		$(".article-entry a[href]").attr("target", "_blank")
	}

	// 返回顶部按钮
	var $btt = $("#back-to-top");
	if($btt.length){
		$(window).on("scroll", function(){
			if($(window).scrollTop() > $(window).height()){
				$btt.addClass("show");
			}else{
				$btt.removeClass("show");
			}
		});
		$btt.on("click", function(){
			$("html,body").animate({scrollTop:0}, 400);
		});
	}

	$(document).on('keydown', function(e){
		var tag = document.activeElement.tagName;
		var typing = tag === 'INPUT' || tag === 'TEXTAREA';
		if(e.key === '/' && !typing){
			var $s = $('#search-input');
			if($s.length){ e.preventDefault(); $s.focus(); }
		}
		if((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')){
			var $s2 = $('#search-input');
			if($s2.length){ e.preventDefault(); $s2.focus(); }
		}
	});

	$('.article-entry figure.highlight, .article-entry pre').each(function(){
		var $block = $(this);
		if($block.find('.code-toolbar').length) return;
		if($block.is('pre') && $block.closest('figure.highlight').length) return;
		var $code = $block.find('code').length ? $block.find('code').first() : $block;
		var codeText = $code.text();
		var lineCount = $block.find('.line').length || codeText.split('\n').length;
		var $toolbar = $('<div class="code-toolbar"></div>');
		var $copy = $('<button class="code-copy-btn" title="复制"><i class="fa-solid fa-copy"></i></button>');
		$copy.on('click', function(){
			navigator.clipboard.writeText(codeText).then(function(){
				$copy.html('<i class="fa-solid fa-check"></i>');
				setTimeout(function(){ $copy.html('<i class="fa-solid fa-copy"></i>'); }, 2000);
			});
		});
		$toolbar.append($copy);
		$block.css('position', 'relative').prepend($toolbar);
		if(lineCount >= 5){
			var $fold = $('<button class="code-fold-btn" title="折叠">折叠</button>');
			$fold.on('click', function(){
				if($block.hasClass('collapsed')){
					$block.removeClass('collapsed');
					$fold.text('折叠');
				}else{
					$block.addClass('collapsed');
					$fold.text('展开');
				}
			});
			$toolbar.append($fold);
			var $expand = $('<button class="code-expand-btn">展开 <i class="fa-solid fa-chevron-down"></i></button>');
			$expand.on('click', function(){
				$block.removeClass('collapsed');
				$fold.text('折叠');
			});
			$block.append($expand);
		}
	});

});
