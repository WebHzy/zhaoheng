$(function(){
    var $ul=$(".banner-img");
    var $ulIds=$(".indicators");
    var LIWIDTH=1900,interval=500,wait=3000,moved=0,timer=null;
    $.ajax({
        type:"get",
        url:"data/getcarousel.php",
        dataType:"json",
        success:function(pic){
            var html="";
            for(var c of pic){
                var {img,href,title}=c;
                html+=`<li><a href="${href}" title="${title}"><img src="${img}"/></a></li>`;
            }
            var {img,href,title}=pic[0];
            html+=`<li><a href="${href}" title="${title}"><img src="${img}"/></a></li>`;
            $ul.html(html).css("width",LIWIDTH*(pic.length+1));
            $ulIds.html("<span></span>".repeat(pic.length)).children(":first").addClass("bg");
            autoMove();
        },
        error:function(){
            alert("网络故障请检查！");
        }
    });
    function autoMove(){
        timer=setInterval(function(){
            move();
        },wait);
    }
    function move(){
        moved++;
        $ul.animate({
            left:-moved*LIWIDTH
        },interval,function(){
            if(moved==$ul.children().length-1){
                $ul.css("left",0);
                moved=0;
            }
            $ulIds.children(":eq("+moved+")").addClass("bg")
                .siblings().removeClass("bg");
        })
    }
    $("#banner").mouseenter(function(){
        clearInterval(timer);
        timer=null;
    }).mouseleave(function(){
        autoMove();
    });
    $ulIds.on("mouseenter","span",function(){
        var $li=$(this);
        var i=$li.index();
        moved=i;
        $ul.stop(true).animate({
            left:-moved*LIWIDTH
        },interval,function(){
            $ulIds.children(":eq("+moved+")").addClass("bg")
                .siblings().removeClass("bg");
        })
    });


    var $divlift=$("#left-floor"),$floors=$(".floor-1");
    $divlift.hide();
    $(window).scroll(function(){
        var scrollTop=$(window).scrollTop();
        if(scrollTop>500){
            $divlift.show();
            $floors.each(function(i,f){
                var $f=$(f);
                var offsetTop=$f.offset().top;
                if(offsetTop<=scrollTop+innerHeight/2){
                    $divlift.find(".lift_item:eq("+i+")").addClass("lift_item_on").siblings().removeClass("lift_item_on")
                }
            })
        }else{
            $divlift.hide();
        }
    });
    $divlift.children("ul").on("click","li",function(){
        var $li=$(this);
        var i=$li.index();
        var offsetTop=$($floors[i]).offset().top;
        $("body,html").stop(true).animate({
            scrollTop:offsetTop
        },500)
    })

});
