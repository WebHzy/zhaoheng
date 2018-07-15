<?php
require_once("../data/init.php");
@$cid=$_REQUEST["cid"];
@$count=$_REQUEST["count"];
if($cid!=null&&$count!=null){
	if($count>0){
		$sql="update hzy_shoppingcart_item set count=$count where cid=$cid";
	}else{
		$sql="delete from hzy_shoppingcart_item where cid=$cid";
	}
	$result=mysqli_query($conn,$sql);
}