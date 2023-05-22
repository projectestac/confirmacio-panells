<?php
/**
 * File: downloadFile.php
 * 
 * This script retrieves the last PDF file sent by the current school
 * 
 * PHP Version 7
 * 
 * @category Service
 * @package  DB
 * @author   Francesc Busquets <francesc@gmail.com>
 * @license  https://www.tldrlegal.com/l/eupl-1.1 EUPL-1.1
 * @link     https://github.com/projectestac/zonaclic
 */

require_once 'config.php';
require_once 'dbUtils.php';
require_once 'cors.php';
require_once 'log.php';

$result = (object)['status'=>'processing'];
$schoolID = 'unknown';

startSession();
allowOriginHeader();

try {
    // Check that there is a valid user
    if (!isset($_SESSION['schoolID'])) {
        throw new RuntimeException('Usuari no autoritzat, o heu excedit el temps màxim de la sessió. Recarregueu la pàgina.');
    }
    $schoolID = $_SESSION['schoolID'];

    $dbConn = getDBConn();
    $resposta = getResposta($dbConn, $schoolID);
    if(!$resposta) {
        throw new RuntimeException('El centre '.$schoolID.' no ha iniciat encara el procés de generació del formulari.');        
    }
    if(!$resposta->nomFitxer) {      
      throw new RuntimeException('El centre '.$schoolID.' no ha encara no ha enviat el document PDF signat.');
    }

    $filePath = FILES_PATH.'/'.$resposta->nomFitxer;

    if(!file_exists($filePath)) {
      throw new RuntimeException('En aquests moments el fitxer no està disponible. Intenteu-ho més endavant.');
    }

    header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK');
    allowOriginHeader();
    header('Cache-Control: no-store');
    header('Content-Type: application/pdf');
    header('Content-Transfer-Encoding: Binary');
    header('Content-Length:'.filesize($filePath));
    header('Content-Disposition: attachment; filename='.$schoolID.'.pdf');
    readfile($filePath);
    die();

} catch (RuntimeException $e) {
    logMsg('ERR-DOWNLOAD', $e->getMessage().' school: '.$schoolID);
    header('HTTP/1.1 401 Unauthorized', true, 401);
    allowOriginHeader();
    exit('ERROR: '.$e->getMessage());
}
