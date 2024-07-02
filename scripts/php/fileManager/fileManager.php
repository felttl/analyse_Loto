<?php

function csv2Json($filepath) {
    $csvFileContent= file_get_contents($filepath);
    $csvLineArray = explode("\n", $csvFileContent);
    //  suppression de map() a cause des erreur de lignes
    for ($i=0; $i<sizeof($csvLineArray) ; $i++) { 
        $csvLineArray[$i]=preg_split("/,|;/",$csvLineArray[$i]);
        Array_pop($csvLineArray[$i]);
    }
    Array_pop($csvLineArray);
    return "`".json_encode($csvLineArray)."`";
}

// end page    
