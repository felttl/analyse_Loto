<?php

function csv2Json($filepath) {
    $csvFileContent= file_get_contents($filepath);
    $csvLineArray = explode("\n", $csvFileContent);
    // peutêtre suppression du map a cause des erreur de lignes
    $result = array_map("str_getcsv", $csvLineArray);
    // correction des irregularites : (uniquement la première ligne a des ;)
    // for ($i=1; $i < sizeof($result); $i++) { 
    //     $tmp = $result[$i][sizeof($result)-1];
    //     echo $tmp;
    //     array_pop($result[$i][$result[$i]-1]);
    //     $result[$i]=array_merge($result[$i],preg_split("/,|;/",$tmp));
    // }
    return "'".json_encode($result)."'";
}
// preg_split("/,|;/",$a)

// end page    
