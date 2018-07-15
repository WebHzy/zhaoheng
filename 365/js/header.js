$(function(){
    $("#header").load("header.html",function(){
        var link=document.createElement("link");
        link.rel="stylesheet";
        link.href="css/header.css";
        document.head.appendChild(link);

        /*drop-list*/
        $(".drop-list").hide();
        $(".h-list").mouseenter(function(){
            $(this).children(".drop-list").show();
        }).mouseleave(function(){
            $(this).children(".drop-list").hide();
        });

        $(".drop-list").on("mouseenter","li",function(){
            $(this).addClass("bgli").children("a").addClass("bga")
                .parent().siblings("li").removeClass("bgli").children("a").removeClass("bga");
            $(this).children(".list-right").show().parent().siblings().children(".list-right").hide();
        });

        $.ajax({
            type:"get",
            url:"data/islogin.php",
            dataType:"json",
            success:function(data){
                if(data.ok==0){
                    $("#login").show();
                    $("#register").show();
                    $("#loginout").hide();
                }else{
                    var {uname}=data;
                    $("#login").hide();
                    $("#register").hide();
                    $("#loginout").show();
                    $("#user-name").html(uname);
                }
            }
        });

        $("#login").click(function(e){
            e.preventDefault();
            location.href="login.html";
        });
        $("#register").click(function(e){
            e.preventDefault();
            location.href="register.html";
        });

        $("#loginout").click(function(e){
            e.preventDefault();
            $.ajax({
                type:"get",
                url:"data/signout.php",
                success:function(){
                    location.reload(true);
                }
            })
        });

        $(".my-list").hide();
        $(".con-list>li:nth-child(6)").on("mouseenter",".fuwu",function(){
            $(".my-list").show();
            $(this).siblings("img").attr("src","img/header/jian1_03.png");
        });
        $(".con-list>li:nth-child(6)").mouseleave(function(){
            $(".my-list").hide();
            $(".con-list>li:nth-child(6)>img").attr("src","img/header/jian1_04.png");
        });

        /*搜索*/
        $("#ser-btn").click(function(e){
            e.preventDefault();
            if($("#txt-search").val().trim()!==""){
                location.href= "product-list.html?kw="+$("#txt-search").val().trim();
            }
        });
        $("#txt-search").keyup(function(e){
            if(e.keyCode===13){
                $("#ser-btn").click();
            }
        });
        if(location.search.indexOf("kw=")!=-1){
            $("#txt-search").val(decodeURIComponent(location.search.split("=")[1]));
        }

        /*搜索帮助*/
        var $txtsearch=$("#txt-search"),
            $shelper=$("#shelper");

        $txtsearch.focus(function(){
            $(this).attr("placeholder","");
        });
        $txtsearch.blur(function(){
            $(this).attr("placeholder","Apple");
        });


        $shelper.on("keyup","li",function(e){
            if(e.keyCode===13){
                $txtsearch.val($(this).text());
            }
        });

        function rein(){
            var text=$shelper.children(".focus").attr("title");
            $txtsearch.val(text);
        }

        $txtsearch.keyup(function(e){
            if(e.keyCode!=13){
//---------------------------左37-上38-右39-下40--------------------------------------
                if(e.keyCode==40){             //下箭头
                    if(!$shelper.is(":has(.focus)")){
                        $shelper.children(":first").addClass("focus");
                        rein();
                    }else{
                        var $next=$shelper.children(".focus").removeClass("focus").next();
                        if($next.length>0){
                            $next.addClass("focus");
                            rein();
                        }else{
                            $shelper.children(":first").addClass("focus");
                        }
                    }
                }else if(e.keyCode==38){     //上箭头
                    if(!$shelper.is(":has(.focus)")){
                        $shelper.children(":first").addClass("focus");
                        rein();
                    }else{
                        var $prev=$shelper.children(".focus").removeClass("focus").prev();
                        if($prev.length>0){
                            $prev.addClass("focus");
                            rein();
                        }else{
                            $shelper.children(":last").addClass("focus");
                        }
                    }
                }else{
                    if($txtsearch.val().trim()!==""){
                        $shelper.show();
                        $.ajax({
                            type:"get",
                            url:"data/shelper.php",
                            data:{kw:$txtsearch.val()},
                            dataType:"json",
                            success:function(data){
                                if(data.length>0){
                                    var html="";
                                    for(var item of data){
                                        var {title}=item;
                                        html+=`<li title="${title}"><div>${title}</div></li>`;
                                    }
                                    $shelper.html(html);
                                }else{
                                    $shelper.html(`<li><div>没有相关的商品分类！</div></li>`);
                                }
                            }
                        })
                    }else{
                        $shelper.hide();
                    }
                }
            }
        }).blur(function(){
            $shelper.hide();
        }).focus(function(){
            $txtsearch.keyup();
        });





    });

});
