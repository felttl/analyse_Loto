<?php

function csv2Json($filepath) {
    $csvFileContent= file_get_contents($filepath);
    $csvLineArray = explode("\n", $csvFileContent);
    $result = array_map("str_getcsv", $csvLineArray);
    return "'".json_encode($result)."'";
}
function csv2Json2($filepath) {
    $csvFileContent= file_get_contents($filepath);
    $result = explode("\n", $csvFileContent);
    return "'".json_encode($result)."'";
}

// end page