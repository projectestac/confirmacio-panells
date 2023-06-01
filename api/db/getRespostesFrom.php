<?php
/**
 * File: getRespostesFrom.php
 *
 * This script gets all responses from a specific date
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

allowOriginHeader();

if (isset($_GET[ID_ACCESS_CODE]) && $_GET[ID_ACCESS_CODE] == ACCESS_CODE && isset($_GET['from'])) {
    try {
        $from = $_GET['from'];

        $dbConn = getDBConn();
        $result = getRespostes($dbConn, $from);
  
        header('Content-Type: application/json;charset=UTF-8');
        echo json_encode($result);

    } catch (Exception $e) {
          // Internal error
        http_response_code(500);
        echo 'Error del servidor: '.$e->getMessage();
        logMsg('ERR-GETRESP', $e->getMessage());
    }
}
else {
    // Bad request
    http_response_code(400);
}


