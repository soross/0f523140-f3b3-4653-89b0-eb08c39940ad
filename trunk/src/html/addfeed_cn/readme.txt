
�ٷ���վ��http://addfeed.cn/feedtools/jQuery/
���ص�ַ��http://code.google.com/p/china-addthis/downloads/list


��װ��

��addfeed_cn�ļ��з�����վĿ¼��

���ã�

1������ҳ�в���
<link type="text/css" href="http://���url/addfeed_cn/CSS/addfeed.css" rel="stylesheet" media="all" />
<script type="text/javascript" src="http://���url/addfeed_cn/addfeed-jq.js" charset="UTF-8"></script>

2��ִ�а󶨣�$("...").addfeed(); 

ʵ����<a class="addfeed_cn" href="���rss��ַ"><img src="http://���url/addfeed_cn/images/f1.gif" alt="�����" align="absmiddle" /></a>���������������ԣ�������ģ�

���ĵ�readyʱ��ִ��$(".addfeed_cn").addfeed(); 


-----------------------------------------------------

��ϸ����˵����


<a class="addfeed_cn" 

    i="0|1|2|3|4|5|6|7"  <!--[��ѡ]������Ҫ�İ�ťid(��http://addfeed.cn/feedtools/)�������ñ�ʾȫ��ѡ��-->

    e="click����mouseover"  <!--[��ѡ]���ð󶨴����¼���Ĭ��Ϊmouseover-->

    href="[rss url]"   <!--[��ѡ]���rss��ַ����������ã����Զ�Ѱ����ҳhead��<link>��rss��ַ-->

    title="�����Ұ�">

        <img src="http://���url/addfeed_cn/images/f1.gif" alt="" align="absmiddle" />     <!--�����Զ���Ϊ�κ�ͼƬ������-->

</a>

<script type="text/javascript">
$(function(){
      $(".addfeed_cn").addfeed();
});
</script>


