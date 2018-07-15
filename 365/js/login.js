$(function(){

    $(".form-r-top").on("click","a",function(e){
        e.preventDefault();
        if(!$(this).parent().is(".bgc")){
            $(this).parent().addClass("bgc").children("a").addClass("col").siblings(".line").show()
                .parent().siblings("li").removeClass("bgc").children("a").removeClass("col").siblings(".line").hide();
        }
        if($(this).attr("href")=="shangjia"){
            $(".form-radio>li").css("opacity","0");
            $(".form-r-bot>li").css("opacity","0");
        }else{
            $(".form-radio>li").css("opacity","1");
            $(".form-r-bot>li").css("opacity","1");
        }
    });

    $(".form-tab1").hide();
    $(".form-radio").on("click","a",function(e){
        e.preventDefault();
        if(!$(this).siblings("span").is(".ched")){
            $(this).siblings("span").addClass("ched").parent().siblings().children("span").removeClass("ched");
        }
        if($(this).attr("href")=="form-tab"){
            $(".form-tab").show();
            $(".form-tab1").hide();
        }else{
            $(".form-tab").hide();
            $(".form-tab1").show();
        }
    });

    $("#setYzm").click(function(){
        $(this).attr("src","data/00_code.php");
    });
    $("#setYzm1").click(function(){
        $(this).attr("src","data/00_code.php");
    });

    $("#btn").click(function(){
        var uname=$("#uname").val();
        var upwd=$("#upwd").val();
        var yzm=$("#yzm").val().toLowerCase();
        var yzmreg=/^[a-z]{4}$/i;
        var reg=/^[a-zA-Z0-9]{3,12}$/;
        if(!yzmreg.test(yzm)){
            alert("验证码格式不正确");
            return;
        }
        if(!reg.test(uname)){
            alert("用户名格式不正确");
            return;
        }
        if(!reg.test(upwd)){
            alert("密码格式不正确");
            return;
        }
        $.ajax({
            type:"get",
            cache:false,
            url:"data/signin.php",
            data:{uname:uname,upwd:upwd,yzm:yzm},
            dataType:"json",
            success:function(data){
                if(data.code>0){
                    alert("登录成功!");
                    var i=location.search.indexOf("=");
                    location.href=location.search.slice(i+1);
                }else{
                    alert(data.msg);
                }
            },
            error:function(){
                alert("网络故障请检查！");
            }
        })
    });

});

