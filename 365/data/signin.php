<?php
require("../data/init.php");
session_start();
$code=$_SESSION["code"];
$yzm=$_REQUEST["yzm"];
if($code!=$yzm){
    die('{"code":-1,"msg":"验证码有误！"}');
}

@$uname=$_REQUEST["uname"];
@$upwd=$_REQUEST["upwd"];

$reg='/^[A-Za-z0-9]{3,12}$/';

$rs=preg_match($reg,$uname);
if(!$rs){
    die('{"code":-1,"msg":"用户格式不正确！"}');
}
$rs=preg_match($reg,$upwd);
if(!$rs){
    die('{"code":-1,"msg":"密码格式不正确！"}');
}

$sql="select uid from hzy_user where uname='$uname' and binary upwd='$upwd'";
$result=mysqli_query($conn,$sql);
if(mysqli_error($conn)){
    echo mysqli_error($conn);
}

$row=mysqli_fetch_row($result);

if($row===null){
    echo '{"code":-1,"msg":"用户名或密码有误，请重试！"}';
}else{
    $_SESSION["uid"]=$row[0];
    echo '{"code":1,"msg":"登录成功！"}';
}