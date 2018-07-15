<?php
require("../data/init.php");
session_start();
@$uid=$_SESSION["uid"];
$cart=[];
if($uid!=null){
	$sql="select *, (select xs from hzy_laptop_pic where iid=lid limit 1) as xs from hzy_shoppingcart_item inner join hzy_laptop_phone on liid=lid where uiid=$uid";
	$result=mysqli_query($conn,$sql);
	$cart=mysqli_fetch_all($result,1);
}
echo json_encode($cart);