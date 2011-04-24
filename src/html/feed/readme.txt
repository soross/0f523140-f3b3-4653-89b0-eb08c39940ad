
官方网站：http://addfeed.cn/feedtools/jQuery/
下载地址：http://code.google.com/p/china-addthis/downloads/list


安装：

将addfeed_cn文件夹放在网站目录内

调用：

1、在网页中插入
<link type="text/css" href="http://你的url/addfeed_cn/CSS/addfeed.css" rel="stylesheet" media="all" />
<script type="text/javascript" src="http://你的url/addfeed_cn/addfeed-jq.js" charset="UTF-8"></script>

2、执行绑定：$("...").addfeed(); 

实例：<a class="addfeed_cn" href="你的rss地址"><img src="http://你的url/addfeed_cn/images/f1.gif" alt="分享家" align="absmiddle" /></a>（可自由配置属性，请见下文）

在文档ready时，执行$(".addfeed_cn").addfeed(); 


-----------------------------------------------------

详细配置说明：


<a class="addfeed_cn" 

    i="0|1|2|3|4|5|6|7"  <!--[可选]设置想要的按钮id(见http://addfeed.cn/feedtools/)，不设置表示全部选择-->

    e="click或者mouseover"  <!--[可选]设置绑定触发事件，默认为mouseover-->

    href="[rss url]"   <!--[可选]你的rss地址，如果不配置，将自动寻找网页head中<link>的rss地址-->

    title="订阅我吧">

        <img src="http://你的url/addfeed_cn/images/f1.gif" alt="" align="absmiddle" />     <!--可以自定义为任何图片、文字-->

</a>

<script type="text/javascript">
$(function(){
      $(".addfeed_cn").addfeed();
});
</script>


