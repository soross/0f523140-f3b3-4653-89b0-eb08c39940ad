/**
 * jQuery 1.2.6+ Addfeed plugin
 * 插件名称: Addfeed
 * @version 1.05
 * Copyright (c) 2009 高飞(addfeed.cn)
 * Licensed under GPL licenses
 *
 * jQuery Addfeed插件是由分享家(addthis.org.cn)作者开发，是一个提供订阅按钮的小插件。
 * 目前收录了常用的15个网络订阅网站的按钮，以国内为主，精选国外常用若干个；
 * 浏览器兼容: Opera 9.0+  Firefox 1.5+  Safari 2.0 +  Chrome 1.0+  IE 6.0+
 *
 * 执行绑定：$("...").addfeed();
 * site: http://addfeed.cn
 * blog: http://heFlying.com    http://hfw828.blog.sohu.com/
 */

$.fn.addfeed = function(options){
		options = options || {};
		//绑定每个按钮
		return this.each(function() { 
			if (!$(this).attr("class").match(/(^|\s)addfeed_cn($|\s)/)) $(this).addClass("addfeed_cn");
			$$addfeed.initBtn(this);
		});
	};

var $$addfeed = {
		timeDelayout:420,
		feeds:{
			"rss":{id:0, name:"Rss订阅"},
			"google":{id:1, name:"谷歌阅览器"},
			"zhuaxia":{id:2, name:"抓虾"},
			"xianguo":{id:3, name:"鲜果"},
			//"qq":{id:4, name:"QQ邮箱"},
			"yahoo":{id:5, name:"雅虎"},
			"inezha":{id:7, name:"哪吒"},
			"Email":{id:8, name:"邮天下"},
			"youdao":{id:9, name:"有道"},
			"feige":{id:10, name:"飞鸽"},
			"bloglines":{id:12, name:"Bloglines"},
		},
		e:encodeURIComponent,
		gotourl:function(url,argStr){
			open(url + argStr, 'addthis');
			return false;
		},
		windowOffset:function(){
			var info={width:0,height:0,left:0,top:0,right:0,bottom:0};
			if(window.innerWidth&&window.innerWidth.constructor==Number){
					info.width=window.innerWidth; //窗口可见宽度
					info.height=window.innerHeight;
					info.left=window.pageXOffset; //页面滚动的宽度
					info.top=window.pageYOffset;
				}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){
					info.width=document.documentElement.clientWidth;
					info.height=document.documentElement.clientHeight;
					info.left=document.documentElement.scrollLeft;
					info.top=document.documentElement.scrollTop;
				}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){
					info.width=document.body.clientWidth;
					info.height=document.body.clientHeight;
					info.left=document.body.scrollLeft;
					info.top=document.body.scrollTop;
				}
			info.right=info.left+info.width;
			info.bottom=info.top+info.height;
			return info;
		},
		showposition:function(dropdown,fgdiv,bgfrm,btn){//参数为jQuery对象
			if(!$.boxModel){
				fgdiv.css("width", (fgdiv.get(0).clientWidth+parseInt(fgdiv.css("padding-left"))+parseInt(fgdiv.css("padding-right"))+(parseInt(fgdiv.css("border-left-width"))?parseInt(fgdiv.css("border-left-width")):0)+(parseInt(fgdiv.css("border-right-width"))?parseInt(fgdiv.css("border-right-width")):0))+"px");
			}
			dropdown.css("width", fgdiv.get(0).offsetWidth+"px");
			bgfrm.css("width", fgdiv.get(0).offsetWidth+"px");
			dropdown.css("height", fgdiv.get(0).offsetHeight+"px");
			bgfrm.css("height", fgdiv.get(0).offsetHeight+"px");
			var info_btn=btn.offset();
			var info_window=$$addfeed.windowOffset();
			var info_dropdown=dropdown.offset();
			var left=0,top=0;
			
			if(info_window.right-info_btn.left<=dropdown.width()){
				left=info_btn.left+btn.width() - dropdown.width();  //left=btn.width() - dropdown.width();
			}else{
				left=info_btn.left; //left=0;
			}
			
			if(info_window.bottom-info_btn.top-(btn.find("*").height()||16)<=dropdown.height()){
				top= info_btn.top-dropdown.height(); //top= -dropdown.height();
			}else{
				top=info_btn.top+btn.height(); //top=btn.height();
			}
			dropdown.css("left", left+"px");
			dropdown.css("top", top+"px");
			info_btn = info_window = info_dropdown = left = top = null;
		},
		showThisItem:function(thisItem){
			$(".addfeed_cn .addbox").hide();
			//$(".addfeed_cn").css("position","static");
			//$(thisItem).css("position", "relative");
			$(thisItem).find(".addbox").show();
		},
		initBtn:function(btn){ //btn{locked, argStr, mouse_over, boxmouseover, boxmouseout, timeOut, addthis, addbox, u , t, e}
			//btn为dom对象
			btn.mouse_over=function(jbtn, e){  
				if(btn.locked){$$addfeed.showThisItem(btn.addthis); return false;} //
				btn.locked=true;  //btn mouseover首次事件
				//if ($$addfeed.isMouseLeaveOrEnter(e||event, btn)) {
					//$$addfeed.timeOnOver = setTimeout(function(){
						//获取配置
						var btn_i = $(btn).attr("i")? "|"+$(btn).attr("i")+"|" : "";//alert(btn_i);
						if ($(btn).attr("href")&&$(btn).attr("href")!=document.location+"#"&&$(btn).attr("href")!=document.location&&$(btn).attr("href")!="#") {
							btn.u = $(btn).attr("href");
						} else { 
							btn.u = $("link[type='application/rss+xml'], link[type='application/atom+xml']").attr("href");
							//alert(btn.u);
						}
						btn.e = $(btn).attr("e") ? $(btn).attr("e") : "mouseover";
						btn.argStr = $$addfeed.e(btn.u);
						btn.addthis = btn;
						$(".addbox").hide();
						$$addfeed.showThisItem(btn.addthis);
						//生成.addbox  html
						$(btn).append('<div class="addbox"></div>');
						var addbox=$(btn).find("div.addbox").get(0);
						btn.addbox = addbox;

						var html= "";

						html += '<iframe class="bgfrm" frameborder="0" tabindex="-1" src="javascript:;" style="display:block;position:absolute;z-index:-1;"></iframe>';
						html += '<div class="addshow"><div class="addh"><div class="addt">订阅到:</div></div><div class="addbody"><div class="flist" style="position:inherit; margin:0 0 3px 0; padding:6px; width:232px;">';
						for(var key in $$addfeed.feeds){
							if (!btn_i || (btn_i && btn_i.indexOf("|"+$$addfeed.feeds[key].id+"|")>=0)) {
								html+='<div class="li" style=" float:left; display:inline; position:inherit; margin:0 0 0 3px; padding:0; line-height:16px; width:110px; height:22px; border:none; background:none; font-size:12px;"><a class="feed_'+ $$addfeed.feeds[key].id +'" item="'+ $$addfeed.feeds[key].id +'" href="#">&nbsp;</a></div>';
							}
						}
						html += '</div><div style="clear:both;line-height:0"></div></div>';
						html += '<div class="addbottom">by:<a href="http://addthis.org.cn" target="_blank">分享家(Addfeed)</a></div>';
						html += '</div>';
						$(addbox).html(html);
						//alert($(addbox).html());
						$$addfeed.showposition($(addbox), $(addbox).find(".addshow"), $(addbox).find(".bgfrm"), $(btn));
						//addbox.style.display="block";
						$(addbox).find(".flist .li a").click(function(evt){
							if (Number($(this).attr("item"))==0) {
								open(btn.u, 'addfeed');
							}
							else {
								a = $.attr(this,"item")
								switch(a){
									case "1":
										$$addfeed.gotourl("http://www.google.com/reader/view/feed/",btn.argStr);
										break;
									case "2":
										$$addfeed.gotourl("http://www.zhuaxia.com/add_channel.php?url=",btn.argStr);
										break;
									case "3":
										$$addfeed.gotourl("http://xianguo.com/subscribe?url=",btn.argStr);
										break;
									//case "4":
									//	$$addfeed.gotourl("http://mail.qq.com/cgi-bin/feed?u=",btn.argStr);
									//	break;
									case "5":
										$$addfeed.gotourl("http://add.my.yahoo.com/rss?url=",btn.argStr);
										break;
									case "7":
										$$addfeed.gotourl("http://inezha.com/add?url=",btn.argStr);
										break;
									case "8":
										$$addfeed.gotourl("http://www.emailrss.cn/?rss=",btn.argStr);
										break;
									case "9":
										$$addfeed.gotourl("http://reader.youdao.com/b.do?url=",btn.argStr);
										break;
									case "10":
										$$addfeed.gotourl("http://www.pageflakes.com/subscribe.aspx?url=",btn.argStr);
										break;
									case "12":
										$$addfeed.gotourl("http://www.bloglines.com/sub/",btn.argStr);
										break;
									case "15":
										$$addfeed.gotourl("http://rss.hexun.com/sub/",btn.argStr);
										break;
									case "16":
										$$addfeed.gotourl("http://9.douban.com/reader/subscribe?url=",btn.argStr);
										break;
								}
							}
							//$.cancelEvent(evt||event);
							//隐藏addbox
							$(btn.addbox).hide();
							return false;
						});
						//绑定事件
						$(btn.addthis).mouseover(function(evt){
							if ($$addfeed.isMouseLeaveOrEnter(evt||event, btn.addthis)) {
								if (btn.e=="click") {
									clearTimeout(btn.timeOut);
								} else if (btn.e=="mouseover"){
									btn.boxmouseover(evt);
									clearTimeout(btn.timeOut);
								}
							}
						});
						$(btn.addthis).mouseout(function(evt){
							if ($$addfeed.isMouseLeaveOrEnter(evt||event, btn.addthis)) {
								btn.timeOut = setTimeout(btn.boxmouseout, $$addfeed.timeDelayout);
							}
						});
						btn_i = btn_t = btn_u = btn_d =  addbox = html = null;
						
						
						
					//},$$addfeed.timeDelayOver);
				//} //end else
				//}
			};
			btn.boxmouseover=function(evt){
				$$addfeed.showposition($(btn.addbox), $(btn.addbox).find(".addshow"), $(btn.addbox).find(".bgfrm"), $(btn));
				$(btn.addbox).show();
			};
			btn.boxmouseout=function(evt){
				$(btn.addbox).fadeOut();
			};
			
			if ($(btn).attr("e")=="click") {
				$(btn).click(function(evt){
					btn.mouse_over(btn, evt); return false;
				});
			} else {
				$(btn).click(function(evt){
					return false;
				}).mouseover(function(evt){
					btn.mouse_over(btn, evt);
				});
			}
			
		},
		isMouseLeaveOrEnter: function(e, handler) {  
		   if (e.type != 'mouseout' && e.type != 'mouseover') return false;  
		   var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;  
		   while (reltg && reltg != handler)  
				 reltg = reltg.parentNode;  
		   return (reltg != handler);  
		}
	};
