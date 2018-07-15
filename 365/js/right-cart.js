$(function(){
    $("#cart").load("right-cart.html",function(){
        $("#backtop").click(function(e){
            e.preventDefault();
            window.scrollTo(0,0);
        });

        $("#cart").click(function(e){
            e.preventDefault();
            $.ajax({
                type:"get",
                url:"data/islogin.php",
                dataType:"json",
                success:function(data){
                    if(data.ok==1){
                       location.href="cart.html";
                        //console.log(lid,count);

                    }else{
                        location.href="login.html?back="+location.href;
                    }
                }
            })
        });

    });

});

