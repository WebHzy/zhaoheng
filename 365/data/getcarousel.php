<?php
require("../data/init.php");
$sql="select * from hzy_index_carousel";
$result=mysqli_query($conn,$sql);
echo json_encode(mysqli_fetch_all($result,1));