<?php
require_once("../data/init.php");
session_start();
@$uid=$_SESSION["uid"];
if($uid!=null){
	$sql="delete from hzy_shoppingcart_item where uiid=$uid";
	mysqli_query($conn,$sql);
}