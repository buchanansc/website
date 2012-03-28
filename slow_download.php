<?php
$file = $_SERVER["QUERY_STRING"];
if(!is_file($file)) die();

$stat = stat($file);
$content_length = $stat[7];
$content = file_get_contents($file);

// header("Content-Type: text/html");
// header("Content-Length: $content_length");

$delay = 20000;
$chunks = str_split($content, 8);
foreach($chunks as $chunk) {
	echo $chunk;	
	usleep($delay);
}
