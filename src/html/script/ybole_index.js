//��������,ʵ��10�����ݵķ���
function AnimateContent() {
    //���������,���ø߶�Ϊ0,��͸��
	$("#itemfirst").prepend("<li class='index_listitem' style='height:0; opacity:0;'></li>");
	var content = $(".index_listitem:last").html();
	//remove�����һ��li
	$(".index_listitem:last").remove();
	//�����һ��Ԫ��li������д����һ����
	$(".index_listitem:first").html(content);
	//�����߶�
	var contentHeight = $(".item_content:first").height() + 15;
	if(contentHeight < 90){
		contentHeight = 90;
	}
	//����,�ȱ仯�߶�,������
	$(".index_listitem:first").animate({height:contentHeight},1000);
	$(".index_listitem:first").animate({opacity:1},800);
}

//ˢ�����ݵķ���
function FreshContent(){
	$.ajax({
        type: 'POST',
        url: '/search/mini',
        success: function (msg) {
			$("#itemfirst").html(msg);
		}
	});
}

function GetNumber()
{
	$.ajax({
        type: 'POST',
        url: 'count/',
        success: function (msg) {
        	$("#number").text(msg.split(',')[1]);
        }
    });
}

function GetHot()
{
	$.ajax({
        type: 'GET',
        url: 'hot/tag',
        success: function (msg) {
        	msg=msg.split('<div id="hot-content">')[1].split("</div>")[0];
            $(".hotjobs").html(msg);
        }
    });
}

//.....
$(function (){
	FreshContent();
	GetNumber();
	GetHot();
	setInterval(AnimateContent,5000);
});