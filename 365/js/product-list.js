$(function(){
    $(".gt-top-x>ul>li:nth-child(2)").addClass("bgc").children().addClass("fc");
    $(".gt-top-x>ul").on("click","a",function(e){
        e.preventDefault();
        $(this).addClass("fc").parent().addClass("bgc").siblings().removeClass("bgc").children().removeClass("fc");
    });

    $(".gt-mid-top").on("click","a",function(e){
        e.preventDefault();
        $(this).addClass("agc").parent().siblings().children().removeClass("agc");
    });

    /*list*/
    function searchProduct(pno,pageSize,key){
        $.ajax({
            type:"get",
            url:"data/product-list-search.php",
            data:{pno,pageSize,key},
            dataType:"json",
            success:function(data){
                window.scrollTo(0,624);
                // console.log(data);
                var html="";
                var out=data.data;
                for(var item of out){
                    var {title,sm,price,lid}=item;
                    html+=`<div>
                            <ul>
                                <li><a href="${lid}"><img src="${sm}" height="200" width="200"/></a></li>
                                <li><a href="${lid}">${title.slice(0,28)}</a></li>
                                <li>品质价：￥<span>${parseInt(price).toFixed(2)}</span></li>
                            </ul>
                        </div>`;
                }
                $("#gt-mid-con").html(html);

                var pno=parseInt(data.pno);
                var pageCount=parseInt(data.pageCount);
                var html="";
                html+=`<li><a href="javascript:;" data-page="${key}" class="prev">上一页</a></li>`;
                if(pno-2>0){
                    html+=`<li><a href="#" data-page="${key}">${pno-2}</a></li>`;
                }
                if(pno-1>0){
                    html+=`<li><a href="#" data-page="${key}">${pno-1}</a></li>`;
                }
                html+=`<li><a href="#"  class="active" data-page="${key}">${pno}</a></li>`;
                if(pno+1<=pageCount){
                    html+=`<li><a href="#" data-page="${key}">${pno+1}</a></li>`;
                }
                if(pno+2<=pageCount){
                    html+=`<li><a href="#" data-page="${key}">${pno+2}</a></li>`;
                }
                html+=`<li><a href="javascript:;" data-page="${key}" class="next">下一页</a></li>`;
                $("#pagination").html(html);
                $("#pagination").on("click","a",function(e){
                    e.preventDefault();
                    var pno=parseInt($(this).html());
                    var key=$(this).attr("data-page");
                    searchProduct(pno,16,key);

                    if($(this).is(".prev")){
                        var key=$(this).attr("data-page");
                        var pno=parseInt($(this).parent().siblings().children(".active").html())-1;
                        searchProduct(pno,16,key);
                    }

                    if($(this).is(".next")){
                        var key=$(this).attr("data-page");
                        var pageCount=parseInt(data.pageCount);
                        var pno=parseInt($(this).parent().siblings().children(".active").html())+1;
                        if(pno<=pageCount){
                            searchProduct(pno,16,key);
                        }
                    }
                });
            }
            // error:function(){
            //     alert("网络故障请检查！");
            // }
        });
    }

    if(location.search.indexOf("kw=")!=-1){
        var key=location.search.split("=")[1];
        //console.log(decodeURIComponent(key));
        searchProduct(1,16,decodeURIComponent(key));
    }else{
        searchProduct(1,16,"");
    }

    $("#gt-mid-con").on("mouseenter","div",function(){
        $(this).addClass("bor").find("ul>li:eq(1)>a").addClass("bug")
                .parent().parent().parent().siblings()
            .removeClass("bor").find("ul>li:eq(1)>a").removeClass("bug");
    });

    $("#gt-mid-con").on("click","a",function(e){
        e.preventDefault();
        var lid=$(this).attr("href");
        //console.log(lid);
        location.href="product-detail.html?lid="+lid;
    });

});