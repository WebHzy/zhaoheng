<?php
require("../data/init.php");
@$lid=$_REQUEST["lid"];
$output=[
	"product"=>[],
	"pics"=>[]
];
if($lid!=null){
	$sql="SELECT * FROM `hzy_laptop_phone` where lid=$lid";
	$result=mysqli_query($conn,$sql);
	$output["product"]=mysqli_fetch_all($result,1)[0];
	$sql="SELECT * FROM hzy_laptop_pic where iid=$lid";
	$result=mysqli_query($conn,$sql);
	$output["pics"]=mysqli_fetch_all($result,1);
}
echo json_encode($output);