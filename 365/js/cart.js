$(function(){
    function loadpage(){
        $.ajax({
            type:"get",
            url:"data/islogin.php",
            dataType:"json",
            success:function(data){
                if(data.ok==0){
                    location.href="login.html?back="+location.href;
                }else{
                    $.ajax({
                        type:"get",
                        url:"data/getcart.php",
                        dataType:"json",
                        success:function(items) {
                            var html = "";
                            var sum = 0;
                            var total = 0;
                            for (var item of items) {
                                var {is_checked, lid, xs, title, price, count,cid} = item;
                                if (is_checked==1) {
                                    total += price * count;
                                    sum += parseInt(count);
                                }
                                html += `<div class="con-bot" data-cid="${cid}">
                <div>
                    <input type="checkbox" class="selitem" data-check="${is_checked}">
                </div>
                <div>
                    <a href=""><img src="${xs}" height="60" width="60"/></a>
                </div>
                <div>
                    <a href="" class="title">${title}</a>
                </div>
                <div class="pri">￥${price}</div>
                <div>
                    <span class="reduce">-</span>
                    <input type="text" value="${count}" class="inp">
                    <span class="add">+</span>
                </div>
                <div>
                    <a href="" class="del">删除</a>
                </div>
            </div>`;

                            }
                            $("#con-box").html(html);
                            $("#totalPrice").html("￥" + (total).toFixed(2));
                            $("#shul").html(sum);

                            $("#selAll").prop("checked",true);
                            $(".selitem").prop("checked",true);


                        }
                    });
                }
            }
        });
    }
    loadpage();

    $("#con-box").on("click","span",function(){
        var cid=$(this).parent().parent().attr("data-cid");
        var count=parseInt($(this).siblings("input").val());
        console.log(cid,count)
        if($(this).is(".add")){

            count++;
        }else{

            count--;
        }
        console.log(count);

        $(this).siblings("input").val(count);
        $.ajax({
            type:"get",
            url:"data/updatecart.php",
            data:{cid,count},
            success:function(){
                loadpage();
            }
        })
    }).on("click","a.del",function(e){
        e.preventDefault();
        var $a=$(this);
        var title=$a.parent().siblings().children(".title").html();
        if(confirm("是否删除"+title+"?")){
            var cid=$a.parent().parent().attr("data-cid");
            $.ajax({
                type:"get",
                url:"data/deletecart.php",
                data:{cid},
                success:function(){
                    loadpage();
                }
            })
        }
    }).on("click",".selitem",function(){
        var $input=$(this);
        var cid=$input.parent().parent().attr("data-cid"),
            is_checked=$input.attr("data-check");
        $.ajax({
            type:"get",
            url:"data/checkone.php",
            data:{cid,is_checked},
            success:function(){
                //loadpage();
            }
        })
    });

    $("#selAll").click(function(){
        var is_checked=1;
        var rs=$(this).prop("checked");
        $(".selitem").prop("checked",rs);
        $.ajax({
            type:"get",
            url:"data/checkall.php",
            data:{is_checked},
            success:function(){
                //loadpage();

            }
        })
    });

$("#delSel").click(function(e){
    e.preventDefault();
    $("#selAll").prop("checked",false);
    $(".selitem").prop("checked",false);
});

$("#delete").click(function(e){
    e.preventDefault();
    $("#con-box").remove();
    $.ajax({
        type:"get",
        url:"data/delete.php",
        success:function(){
            loadpage();
        }
    });
});

});