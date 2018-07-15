<?php
 require_once("../data/init.php");
 @$cid=$_REQUEST["cid"];
 if($cid!=null){
 	$sql="delete from hzy_shoppingcart_item where cid=$cid";
 	mysqli_query($conn,$sql);
 }