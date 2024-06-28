<?php

/**
 * ATTENTION on gère les erreurs au dessus du niveau des exceptions 
 * - permet la gestion des flux d'erreurs affichés en dehors des try-catch
 * 
 * 
 * @see https://www.youtube.com/watch?v=rQntgj7yink EN
 * 
 */
class ErrorHandlerManager{

    /** @var mixed $reportMod [par défaut] affiche toute les erreurs */
    public static $reportMod = self::REPORT_ALL;

    // erreurs systèmes adapté récupéré pour notre classe 
    // (les 16 niveaux, dont 5 pour les try-cath)
    // voir : https://www.php.net/manual/fr/errorfunc.constants.php
    const REPORT_ERROR = E_ERROR; // notre bon vieux fatal    
    const REPORT_WARNING = E_WARNING;    
    const REPORT_PARSE = E_PARSE;
    const REPORT_NOTICE = E_NOTICE;
    const REPORT_CORE_ERROR = E_CORE_ERROR;
    const REPORT_CORE_WARNING = E_CORE_WARNING;
    const REPORT_COMPILE_ERROR = E_COMPILE_ERROR;
    const REPORT_COMPILE_WARNING = E_COMPILE_WARNING;
    const REPORT_USER_ERROR = E_USER_ERROR;
    const REPORT_USER_WARNING = E_USER_WARNING;
    const REPORT_USER_NOTICE = E_USER_NOTICE;
    const REPORT_STRICT = E_STRICT;
    const REPORT_RECOVERABLE_ERROR = E_RECOVERABLE_ERROR;
    const REPORT_DEPRECATED = E_DEPRECATED;
    const REPORT_USER_DEPRECATED = E_USER_DEPRECATED;
    const REPORT_ALL = E_ALL;    

    protected static $instance = null;

    protected static $th;
    protected static $msg;
    protected static $code;
    protected static $exec;

    // gestion des erreurs interne, externe et celle de la classe
    protected static $ErrStackIn = [];
    protected static $ErrStackOut = [];
    protected static $errStackSelf = [];
    
    protected function __construct($type, $msg, $file=null, $mine=null) {
        $this->msg = $msg;
        error_reporting($type & ~self::REPORT_WARNING);
        set_error_handler("self::errorHandler", $type);
    }


    public static function getInstance(){
        if(!isset(self::$instance))
            self::$instance = new ErrorHandlerManager(
                self::$code,
                self::$msg,
                null,null
            );
        return self::$instance;
    }


    /**
     * permet de récupérer les erreurs (pour les afficher ou non)
     * @param int $type type d'erreur (utilise une constante système)
     * @param string $msg message associé
     * @param ?string $file [default null] fichié associé
     * @param ?int $line [default null] ligne associé
     * @see https://www.php.net/manual/fr/errorfunc.constants.php#115636
     */
    public static function errorHandler($type, $msg, $a ,$file=null, $line=null){
        $strErrorType = "";
        $bit = 1;
        $tmpErrNo = $type;
        while ($tmpErrNo) {
            if ($tmpErrNo & $bit) {
                if ($strErrorType != "")
                    $strErrorType .= " | ";
                switch ($bit) {
                case self::REPORT_USER_WARNING:
                    $strErrorType .= "E_USER_WARNING"; break;
                case self::REPORT_USER_NOTICE:
                    $strErrorType .= "E_USER_NOTICE"; break;
                case self::REPORT_WARNING:
                    $strErrorType .= "E_WARNING"; break;
                case self::REPORT_CORE_WARNING:
                    $strErrorType .= "E_CORE_WARNING"; break;
                case self::REPORT_COMPILE_WARNING:
                    $strErrorType .= "E_COMPILE_WARNING"; break;
                case self::REPORT_NOTICE:
                    $strErrorType .= "E_NOTICE"; break;
                case self::REPORT_ERROR:
                    $strErrorType .= "E_ERROR"; break;
                case self::REPORT_PARSE:
                    $strErrorType .= "E_PARSE"; break;
                case self::REPORT_CORE_ERROR:
                    $strErrorType .= "E_CORE_ERROR"; break;
                case self::REPORT_COMPILE_ERROR:
                    $strErrorType .= "E_COMPILE_ERROR"; break;
                case self::REPORT_USER_ERROR:
                    $strErrorType .= "E_USER_ERROR"; break;   
                default:
                    $strErrorType .= "(unknown error bit $bit)"; break;
                }
            }
            $tmpErrNo &= ~$bit;
            $bit <<= 1;
        }
    }

    /**
     * renvoie l'erreur
     * @param bool $html_ renvoie le code html dirrectement
     */
    public static function ReportMod($html_){
        if($html_){
            ?> 
            <font size='1'>
                <table class='xdebug-error xe-notice' dir='ltr' border='1' cellspacing='0' cellpadding='1'>
                    <tr>
                        <th align='left' bgcolor='#f57900' colspan="5">
                            <span style='background-color: #cc0000; color: #fce94f; font-size: x-large;'>
                            ( ! )
                            </span> 
                            <?php echo self::$msg." ".self::$exec."in :".self::$code->getFile(); ?> <i><?php echo self::$code ; ?></i>
                        </th>
                        </tr>
                <tr><th align='left' bgcolor='#e9b96e' colspan='5'>Call Stack</th></tr>
                <tr>
                    <th align='center' bgcolor='#eeeeec'>#</th>
                    <th align='left' bgcolor='#eeeeec'>Time</th>
                    <th align='left' bgcolor='#eeeeec'>Memory</th>
                    <th align='left' bgcolor='#eeeeec'>Function</th>
                    <th align='left' bgcolor='#eeeeec'>Location</th>
                </tr>
                <tr>
                    <td bgcolor='#eeeeec' align='center'>1</td>
                    <td bgcolor='#eeeeec' align='center'>0.0003</td>
                    <td bgcolor='#eeeeec' align='right'>367496</td>
                    <td bgcolor='#eeeeec'>{main}(  )</td>
                    <td title='C:\UwAmp\www\projet-Aqua-FabLab-L2-NEC\site\Accueil.php' bgcolor='#eeeeec'>...\Accueil.php<b>:</b>0</td>
                </tr>
                <tr>
                    <td bgcolor='#eeeeec' align='center'>___</td>
                    <td bgcolor='#eeeeec' align='center'>_____</td>
                    <td bgcolor='#eeeeec' align='right'>_____</td>
                    <td bgcolor='#eeeeec'>include( <font color='#00bb00'>'<?php echo self::$code->getFile() ; ?>'</font> )</td> 
                    <td title='<?php echo self::$code->getFile() ; ?>' bgcolor='#eeeeec'>fileDest<b>:</b><?php echo self::$code ;?></td>
                </tr>
                </table>
            </font>
            <?php
        } else {
            trigger_error(self::$msg, self::$code);
        }
    }

    /**
     * récupère les erreurs avec leurs types système
     */
    public static function formatMessage(){

    }


    /**
     * change le mode d'affichage en utilisant les constantes de classes :
     * - ErrorHandlerManager::REPORT_etc...
     * @param MOD $MOD de la classe a utiliser 
     * @throws InternalException si le mode est incorrect
     * @return void
     */
    public static function setMode($MOD) {
        $isCorrect = [
            self::REPORT_ERROR,
            self::REPORT_WARNING,
            self::REPORT_PARSE,
            self::REPORT_NOTICE,
            self::REPORT_CORE_ERROR,
            self::REPORT_CORE_WARNING,
            self::REPORT_COMPILE_ERROR,
            self::REPORT_COMPILE_WARNING,
            self::REPORT_USER_ERROR,
            self::REPORT_USER_WARNING,
            self::REPORT_USER_NOTICE,
            self::REPORT_STRICT,
            self::REPORT_RECOVERABLE_ERROR,
            self::REPORT_DEPRECATED,
            self::REPORT_USER_DEPRECATED,
            self::REPORT_ALL
        ][$MOD] ?? false;
        if($isCorrect)
            self::$reportMod = $MOD;
        else { // mode par defaut
            // on renvoi l'exception dans la classe dédié
            $tmpMod = ExceptionManager::getMode();
            ExceptionManager::setMode(ExceptionManager::MOD_REDIRECT_D);
            ExceptionManager::formatMessage(
                new InternalException(get_class()."::setMode($MOD) mode inconnu",1)
            );
            ExceptionManager::setMode($tmpMod);
        }
    }

    /**
     * renvoie une liste d'erreur en fonction du mode d'affichage de classe
     */
    public static function getErrorsOnReport(){
        $all = self::$ErrStackIn+self::$ErrStackOut+self::$errStackSelf;
        $out = [];
        for ($i=0; $i < sizeof($all); $i++) { 
            // si ça correspond alors on ajoute a la sortie
            if($all[$i]->getCode() == self::$reportMod)
                $out[] = $all[$i];
        }
        return $out;
    }

    public function getMessage(){return self::$msg;}
    public function getCode(){return self::$code;}
    public function getExec(){return self::$exec;}
}



// 