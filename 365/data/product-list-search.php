<?php
header("Content-Type:application/json;charset=utf-8");
require("../data/init.php");
@$key=$_REQUEST["key"];
@$pno=$_REQUEST["pno"];
@$pageSize=$_REQUEST["pageSize"];
if(!$key){
    $key="";
}
if(!$pno){
    $pno=1;
}
if(!$pageSize){
    $pageSize=16;
}
$sql="SELECT count(lid) as c FROM hzy_laptop_phone where title LIKE '%$key%'";
$rs=mysqli_query($conn,$sql);
if(mysqli_error($conn)){
   echo mysqli_error($conn);
}
$row=mysqli_fetch_row($rs);
$pageCount=ceil($row[0]/$pageSize);

$offset=($pno-1)*$pageSize;
$sql="SELECT title,lid,price,(select sm from hzy_laptop_pic where iid=lid limit 1) as sm FROM hzy_laptop_phone WHERE title LIKE '%$key%' LIMIT $offset,$pageSize";
$rs=mysqli_query($conn,$sql);
if(mysqli_error($conn)){
   echo mysqli_error($conn);
}
$rows=mysqli_fetch_all($rs,1);

$output=["pno"=>$pno,"pageSize"=>$pageSize,"pageCount"=>$pageCount,"data"=>$rows];
echo json_encode($output);


