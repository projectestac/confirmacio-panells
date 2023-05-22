<?php
/**
 * File: updateResposta.php
 *
 * This script updates the data associated to a response.
 * 
 * Linted with PHP_CodeSniffer (http://pear.php.net/package/PHP_CodeSniffer/)
 * against PEAR standards (https://pear.php.net/manual/en/standards.sample.php)
 * with phpcbf
 * 
 * PHP Version 7
 * 
 * @category Service
 * @package  DB
 * @author   Francesc Busquets <francesc@gmail.com>
 * @license  https://www.tldrlegal.com/l/eupl-1.2 EUPL-1.2
 * @link     https://github.com/projectestac/zonaclic
 */

require_once 'config.php';
require_once 'cors.php';
require_once 'log.php';
require_once 'dbUtils.php';

$result = (object)['status'=>'processing'];
$schoolID = 'unknown';

startSession();
allowOriginHeader();

/**
 * Main function
 */

try {
    // Check that there is a valid user
    if (!isset($_SESSION['schoolID'])) {
        throw new RuntimeException('Usuari no autoritzat, o heu excedit el temps màxim de la sessió. Recarregueu la pàgina.');
    }
    $schoolID = $_SESSION['schoolID'];

    // Check if data is set
    if (!isset($_POST['resposta']) || strlen(trim($_POST['resposta']))<1) {
        throw new RuntimeException('Paràmetres invàlids.');
    }
    $resposta = json_decode($_POST['resposta']);

    if($resposta->idCentre != $schoolID) {
        throw new RuntimeException('Paràmetres invàlids.');
    }

    // Update database
    updateResposta(getDBConn(), $schoolID, $resposta);
    $result->status = 'ok';

} catch (RuntimeException $e) {
    $result->status = 'error';
    $result->error = $e->getMessage();
    logMsg('ERR-UPDATE', $e->getMessage().' school: '.$schoolID);
}

// Set response header and content
header('Content-Type: application/json;charset=UTF-8');
print json_encode($result);
