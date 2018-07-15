<?php
require("../data/init.php");
@$cid=$_REQUEST["cid"];
@$is_checked=$_REQUEST["is_checked"];
if($cid!=null&&$is_checked!=null){
	$sql="update hzy_shoppingcart_item set is_checked=$is_checked where cid=$cid";
	mysqli_query($conn,$sql);
}