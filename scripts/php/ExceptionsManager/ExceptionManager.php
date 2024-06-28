<?php



/** attention a importer les packages:
 * classes spécifiques de gestion des erreurs
 * 
 * - include_once "./Specific.classes.php";
 */


/**
 * classe de gestion des exceptions (Singleton)
 * la classe ne renvoie pas d'erreur (et doit donc être totalement fiable) sauf
 * pour 2 méthodes : 
 * - formatMessage()
 * - setMode()
 * 
 * @author felix TTL
 */
abstract class ExceptionManager{

    // liste des codes (erreurs interne)
    protected static $codes = [
        0 => "succés ",
        1 => "erreur générale ", // Attention a éviter car difficile de trouver l'origine du problème

        4 => "argument(s) type(s) incorrect ",
        7 => "nombre d'argument(s) invalide: ",
    ]; 

    private static $mode = self::MOD_DEBUG_D; // choix des modes

    // simplifie l'utilisation des modes d'affichage(D pour Display)
    
    /** @var MOD_PROD_D [par défaut] affiche toutes les erreurs */
    const MOD_DEBUG_D = "interne + externe" ; // [défaut]    
    const MOD_PROD_D = "seulement externe"; 
    const MOD_INTERN_D =  "seulement interne"; 
    const MOD_REDIRECT_D = "redirige tout"; // utiliser les méthodes dédié pour récupérer les types d'erreurs voulus
    const MOD_SILENT_D = "pas d'affichage";

    // stock les informations de la dernière erreur du Manager (cette classe)
    protected static $code;
    protected static $message;
    protected static $exec;

    protected static $stackTraceIntern = []; // si mode redirigé
    protected static $stackTraceExtern = []; 
    protected static $stackTraceClass = []; // si la classe de gestion rencontre des erreurs


    /**
     * permet de formatter l'affichage des erreurs trouvées 
     * (soit avec du contenu informatif soit une exception)
     * - arg1 Exception|Error (object) element throwable a gérer
     * - arg2 [optionnel] string message
     * - arg3 [optionnel] int code
     * - arg4 [optionnel] bool valeur de renvoie de fonction (1 true,0 false)
     * @return bool true execution ok sinon false
     */
    public static function formatMessage(){
        $j = "<br>\n";
        $res=false;
        if(func_num_args() > 0 && func_num_args() < 5){
            $message="";
            $res=false;
            try {
                if(func_num_args() >= 1){
                    $content = func_get_arg(0);
                    // si c'est pas une exception
                    if(strtolower(gettype($content)) != "object")
                        throw new InternalException("->formatMessage()) argument 1 invalide (".gettype($content).")",1);
                    $content = self::formatThrowable($content);     
                }          
                if(func_num_args() >= 2){
                    $type=strtolower(gettype(func_get_arg(1)));
                    if($type == "string")
                        $message = func_get_arg(1);
                    else
                        throw new InternalException("le paramètre 2 n'est pas un string: ($type)");
                } 
                if(func_num_args() >= 3){
                    $type=strtolower(gettype(func_get_arg(2)));
                    if($type == "integer")
                        self::$code =  func_get_arg(2);
                    else
                        throw new InternalException("le paramètre 3 n'est pas un integer: ($type)");
                }
                if(func_num_args() >= 4){
                    $type=strtolower(gettype(func_get_arg(3)));
                    if($type == "boolean")
                        self::$exec =  func_get_arg(3);
                    else
                        throw new InternalException("le paramètre 4 n'est pas un integer: ($type)");
                }     
                self::afficheOnMode($content,$message,true); // attention réccursivité                         
                $res=true;      
            } catch (Throwable $th) {
                $res=false;
                self::afficheOnMode($th,null,true); // attention réccursivité
            } finally {
                return $res;
            }
        } else {
            $argsName = self::getArrayTypes(func_get_args(),true);
            echo "format d'entrée de gestion des erreurs (formatMessage()) invalide:".
            "$argsName, attendus: (object,integer?,bool?,string?) ";
        }
        return $res;
    }

    /**
     * transforme un throwable en message affichable
     * @param Throwable $th exception ou erreur
     */
    private static function formatThrowable($th){
        return " code: ".$th->getCode().
        " ligne: ".$th->getLine().
        " problème: ".$th->getMessage().
        " fichier".$th->getFile()."\n<br>"; 
    }

    /**
     * gère les les exceptions lorsu'elles sont récupérées
     * selon le mode d'affichage pour des message d'erreur (interne, externe, du Manager)
     * @param Throwable $th exception ou erreur a afficher
     * @param string $msg message sous forme de chaine provenant des exceptions et erreurs 
     * @param bool $classTh vrai si ce sont des erreurs de la classe false sinon c'est pas le cas
     * @return void
     */
    protected static function afficheOnMode($th,$msg=null, $classTh=false) {
        // mode redirection
        if(self::$mode == self::MOD_REDIRECT_D){
            // si erreur de la classe actuelle
            if($classTh){
                self::$stackTraceClass[] = $th;
            } else {
                // si intern intern sinon dans extern
                if(InternalException::haveSameClassFrom($th))
                    self::$stackTraceIntern[] = $th;
                else 
                    self::$stackTraceExtern[] = $th;                
            }   
        } else if(self::$mode == self::MOD_DEBUG_D){
            // on affiche que si l'objet provient de classe correspondante au mode d'affichage
            if($classTh)
                self::$stackTraceClass[] = $th;
            else
                echo $msg.self::formatThrowable($th);    
        } else if (self::$mode == self::MOD_INTERN_D && InternalException::haveSameClassFrom($th)){
            if($classTh)
                self::$stackTraceClass[] = $th;
            else
                echo $msg.self::formatThrowable($th);
        } else if(self::$mode == self::MOD_PROD_D && !InternalException::haveSameClassFrom($th)){
            if($classTh)
                self::$stackTraceClass[] = $th;
            else
                echo $msg.self::formatThrowable($th);             
        }
   
        

    }

    // cette fonction devrais être dans les outils car c'est pas spécifique a la classe
    /**
     * récupère la liste sous forme de chaine des types d'éléments d'un array
     * - mets les informations dans la listes des erreurs du Manager (classe)
     * @param array $array liste d'élement
     * @param bool $precision affiche (par exemple le type d'objet)
     * un type plus complexe si détecté ([default] false)
     * @return bool|string string si ok sinon false (erreur)
     */
    protected static function getArrayTypes($array, $precision=false){
        $res=[];
        if(sizeof($array) == 0){
            $res='()';
        } else {
            try {
                for ($i=0; $i < sizeof($array); $i++) { 
                    if(strtolower(gettype($array[$i])) == "object" && $precision)
                        $res[] = get_class($array[$i]);
                    else 
                        $res[] = gettype($array[$i]);
                }
                $res=implode(', ',$res);                  
            } catch (Throwable $th) {
                $res=false;
                self::$stackTraceClass[] = $th;
            }
        }
        return $res;
    }

    /**
     * renvoie les erreurs interness
     * - si mode ExceptionManager::MOD_REDIRECT_D sinon c'est vide: []
     * @return array liste de toutes les erreurs trouvées
     */
    public static function getInternExceptions(){
        return self::$stackTraceIntern;
    }
    /**
     * renvoie les erreurs externes
     * - si mode ExceptionManager::MOD_REDIRECT_D sinon c'est vide: []
     * @return array liste de toutes les erreurs trouvées
     */
    public static function getExternExceptions(){
        return self::$stackTraceExtern;
    }
    /**
     * renvoie les exception et erreur de la classe ExceptionManager 
     * - si mode ExceptionManager::MOD_REDIRECT_D sinon c'est vide: []
     * @return array liste de toutes les erreurs trouvées
     */
    public static function getManagerExceptions(){
        return self::$stackTraceClass;
    }    
    

    // sets

    /**
     * change le mode d'affichage
     * - MOD_PROD_D
     * - MOD_DEBUG_D
     * - MOD_INTERN_D
     * - MOD_REDIRECT_D
     * - MOD_SILENT_D
     * @param MOD $MOD de la classe a utiliser (MOD_PROD_D, MOD_DEBUG_D, MOD_INTERN_D, MOD_REDIRECT_D, MOD_SILENT_D)
     * @throws InternalException si le mode est incorrect
     * @return void
     */
    public static function setMode($MOD) {
        $isCorrect = [
            self::MOD_PROD_D => true,
            self::MOD_DEBUG_D => true,
            self::MOD_INTERN_D => true,
            self::MOD_REDIRECT_D => true,
            self::MOD_SILENT_D => true
        ][$MOD] ?? false;
        if($isCorrect)
            self::$mode = $MOD;
        else {
            // on utilise le mod par défaut car pas le choix (si pas déja défini)
            self::formatMessage(
                new InternalException("mode incorrect")
            );
        }
    }

    // gets
    
    public static function getCode(){return self::$code;}
    public static function getMessage(){return self::$message;}
    public static function getExec(){return self::$exec;}
    public static function getMode() {return self::$mode;}

}



// end page