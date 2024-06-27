<?php

function csv2Json($filepath) {
    $csvFileContent= file_get_contents($filepath);
    $csvLineArray = explode("\n", $csvFileContent);
    $result = array_map("str_getcsv", $csvLineArray);
    return "'".json_encode($result)."'";
}
// preg_split("/,|;/",$a)

// end page