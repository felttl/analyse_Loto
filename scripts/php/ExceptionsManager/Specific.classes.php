<?php

// nom d'exemple de gestion d'erreurs spécifique a une action
// créer uen nouvelle classe ici avec un tout autre nom
// pour les exceptions spzcifiques à la classe

// code a remplacer : (l'idée c'est que dans les try-catch on utilise un des classes en dessous pour
// avoir plus de précision de l'erreur )

interface ManagableException {
    public static function haveSameClassStrict($obj); // renvoie si c'est exactement la même classe
    public static function haveSameClassFrom($obj); // même groupe de classe héritées
}

/**
 * adapte les exceptions spécifique pour l'ExceptionManager
 */
class InternalExceptionAdapter extends Exception implements ManagableException{
    /**
     * attention ne prend pas en compte l'heritage 
     * (ça comptera comme des classes différentes)
     * @param Exception|Error $obj Erreur ou exception a comparer a la classe
     * @return bool true sont strictement pareil false sinon
     */
    public static function haveSameClassStrict($obj){
        return (new ReflectionClass($obj))->getName() === static::class;
    }
    /**
     * attention prend en compte l'heritage 
     * - (cette classe & héritées seront considérées comme identiques à la classe actuelle)
     * @param Exception|Error $obj Erreur ou exception a comparer a la classe
     * @return bool true sont pareil false sinon
     */
    public static function haveSameClassFrom($obj){
        return is_a($obj, get_class());
    }
    
}

// pour savoir si une erreur est interne ou externe (exemple PDO est externe)
class InternalException extends InternalExceptionAdapter{} 
// + autres classes de gestion spécifique d'erreurs



// end page