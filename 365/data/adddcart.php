<?php
require("../data/init.php");
session_start();
@$uid=$_SESSION["uid"];
@$lid=$_REQUEST["lid"];
@$count=$_REQUEST["count"];
$out=0;
if($uid!=null&&$lid!=null&&$count!=null){
	$sql="select cid from hzy_shoppingcart_item where uiid=$uid and liid=$lid";

	$result=mysqli_query($conn,$sql);

	$row=mysqli_fetch_row($result);
	//echo json_encode($row)//;
	$iid=$row[0];
	if($row==null){
		$sql="insert into hzy_shoppingcart_item values (null,$uid,$lid,$count,0)";
        $out=1;
	}else{
		$sql="update hzy_shoppingcart_item set count=count+$count where cid=$iid";
	}
	$result=mysqli_query($conn,$sql);
	echo $out;
}