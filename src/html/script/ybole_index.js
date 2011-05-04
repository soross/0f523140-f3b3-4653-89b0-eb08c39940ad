//动画方法,实现10条内容的翻滚
function AnimateContent() {
    //插入最外层,设置高度为0,不透明
	$("#itemfirst").prepend("<li class='index_listitem' style='height:0; opacity:0;'></li>");
	var content = $(".index_listitem:last").html();
	//remove掉最后一个li
	$(".index_listitem:last").remove();
	//将最后一个元素li的内容写到第一个中
	$(".index_listitem:first").html(content);
	//决定高度
	var contentHeight = $(".item_content:first").height() + 15;
	if(contentHeight < 90){
		contentHeight = 90;
	}
	//动画,先变化高度,再显现
	$(".index_listitem:first").animate({height:contentHeight},1000);
	$(".index_listitem:first").animate({opacity:1},800);
}

//刷新内容的方法
function FreshContent(){
	$.ajax({
        type: 'POST',
        url: '/search/show/0',
        data: { search: encodeURIComponent('all'), page: 0 },
        success: function (msg) {
			alert(msg);
			$("#itemfirst").html(msg);
		}
	});
}

//.....
$(function (){
	FreshContent();
	setInterval(AnimateContent,5000);
});