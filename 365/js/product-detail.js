$(function(){
    if(location.search.indexOf("lid")!=-1){
        var lid=location.search.split("=")[1];
        //console.log(lid);
        $.ajax({
            type:"get",
            url:"data/getProductById.php",
            data:{lid},
            dataType:"json",
            success:function(data){
                //console.log(data);
                var {product,pics}=data;
                var html="";
                for(var {xs, md, lg} of pics){
                    html+=`<li class="i1"><img src="${xs}" data-md="${md}" data-lg="${lg}"></li>`;
                    html+=`<li class="i1"><img src="${xs}" data-md="${md}" data-lg="${lg}"></li>`;
                }
                var {md,lg}=pics;
                $("#icon_list").html(html);
                $("#mImg").attr("src",pics[0].md);
                $("#largeDiv").css("background","url("+pics[0].lg+")");

                $("#icon_list>li:first-child>img").addClass("bor");
                $("#icon_list").on("click","img",function(){
                    //console.log(1);
                    $(this).addClass("bor").parent().siblings().children().removeClass("bor");
                    var md=$(this).attr("data-md");
                    var lg=$(this).attr("data-lg");
                    $("#mImg").attr("src",md);
                    $("#largeDiv").css("background","url("+lg+")");
                });

                var {lid,title,price,memory,spec,color}=product;
                var html="";
                html=`<ul>
                    <li><h3>${title}</h3></li>
                    <li>抢购价格:<span>￥${price}</span></li>
                    <li>内存大小:<span>${memory}</span></li>
                    <li>屏幕尺寸:<span>${spec}</span></li>
                    <li>机身颜色:<span>${color}</span></li>
                    <li>选择数量:<span class="reduce">-</span><input type="text" value="1"><span class="add">+</span></li>
                    <li><a href="${lid}" id="cart"><img src="img/products/details/details_03.png" height="21" width="21"/>加入购物车</a></li>
                </ul>`;
                $("#detail-right").html(html);


                var moved=0,offset=10;
                var liwidth=62;
                var ul=$("#icon_list").children().size();
                $("#icon_list").width(liwidth*ul+(ul-1)*14+"px");
                $(".backward").click(function(e){
                    e.preventDefault();
                    moved>0?moved--:moved=0;
                    $("#icon_list").css("left",-moved*(liwidth+offset)+"px");

                });
                $(".forward").click(function(e){
                    e.preventDefault();
                    moved++;
                    $("#icon_list").css("left",-moved*(liwidth+offset)+"px");
                    if(ul-moved===5){
                        moved=0;
                    }
                });

                var mask=$("#mask");
                var smask=$("#superMask");
                var lgdiv=$("#largeDiv");
                smask.mouseover(function(){
                    mask.css("display","block");
                    lgdiv.css("display","block");
                }).mouseout(function(){
                    mask.css("display","none");
                    lgdiv.css("display","none");
                });
                var MSIZE=200,SMSIZE=400;
                smask.mousemove(function(e){
                    var left=e.offsetX-MSIZE/2;
                    var top=e.offsetY-MSIZE/2;
                    left=left<0?0:left>SMSIZE-MSIZE?SMSIZE-MSIZE:left;
                    top=top<0?0:top>SMSIZE-MSIZE?SMSIZE-MSIZE:top;
                    mask.css({
                        left:left+"px",
                        top:top+"px"
                    });
                    lgdiv.css("backgroundPosition",-2*left+"px "+ -2*top+"px");
                });

                //点击多次出现蓝色选中--解决
                document.onselectstart=new Function("return false");

                $("#detail-right").on("click","span",function(){
                    var count=$(this).siblings("input").val();
                    if($(this).is(".reduce")){
                        count--;
                        if(count>0){
                            $(this).siblings("input").val(count);
                        }
                    }else if($(this).is(".add")){
                        count++;
                        if(count>0){
                            $(this).siblings("input").val(count);
                        }
                    }
                });
                //加入购物车
                $("#cart").click(function(e){
                    e.preventDefault();
                    var $a=$(this);
                    $.ajax({
                        type:"get",
                        url:"data/islogin.php",
                        dataType:"json",
                        success:function(data){
                            if(data.ok==1){
                                var lid=$a.attr("href"),
                                    count=parseInt($a.parent().prev().children("input").val());
                                //console.log(lid,count);
                                $.ajax({
                                    type:"get",
                                    url:"data/adddCart.php",
                                    data:{lid,count},
                                    success:function(data){
                                        if(data>0){
                                            var n= parseInt($("#cart-count").html());
                                            $("#cart-count").html(n+1);
                                            alert("添加成功！");
                                        }

                                    }
                                });
                            }else{
                                location.href="login.html?back="+location.href;
                            }
                        }
                    })
                })



            },
            error:function(){
                alert("网络故障请检查！");
            }
        });
    }
});