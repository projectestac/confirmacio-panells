<?php
/**
 * File: uploadFile.php
 * 
 * This script receives a PDF file and stores it in the documents space.
 * 
 * PHP Version 7
 * 
 * @category Service
 * @package  DB
 * @author   Francesc Busquets <francesc@gmail.com>
 * @license  https://www.tldrlegal.com/l/eupl-1.1 EUPL-1.1
 * @link     https://github.com/projectestac/zonaclic
 */

// NOTE: Package 'poppler-utils' must be installed!

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

    // Check if there is a single file uploaded
    if (!isset($_FILES['pdfFile']['error']) || is_array($_FILES['pdfFile']['error'])) {
        throw new RuntimeException('Paràmetres invàlids.');
    }

    // Initialize main variables
    $file = $_FILES['pdfFile'];
    $fileName = $schoolID.'_'.time().'.pdf';

    // Perform additional checks about the uploaded file. Only 'UPLOAD_ERR_OK' error type is acceptable.
    switch ($file['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_NO_FILE:
        throw new RuntimeException('No s\'ha enviat cap fitxer.');
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        throw new RuntimeException('S\'ha excedit la mida màxima del fitxer.');
    default:
        throw new RuntimeException('Error desconegut.');
    }

    // Check mime type and extension
    $tmpFilePath = $file['tmp_name'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);    
    if ($finfo->file($tmpFilePath)!=='application/pdf' || substr(strtolower($file['name']), -4)!=='.pdf') {
        throw new RuntimeException('Format de fitxer invàlid.');
    };

    // Check the digital signature of the pdf file
    $matches = [];
    $output = `pdfsig $tmpFilePath`;
    preg_match('/Signer Certificate Common Name: ([^\n]+)/', $output, $matches);
    if (count($matches) < 2) {
        throw new RuntimeException('Aquest fitxer no està signat digitalment, o la signatura no s\'ha pogut verificar.');
    }
    $signedBy = $matches[1];

    // Check the file metadata
    $matches = [];
    $output = `pdfinfo $tmpFilePath`;
    if($output)
        preg_match('/^Subject:\s*(.*)$/m', $output, $matches);
    
    if (count($matches) < 2) {
        throw new RuntimeException('Aquest fitxer no conté les metadades necessàries per a ser processat. Pot ser que no s\'hagi generat amb l\'assistent?');
    }
    $meta = $matches[1];
    $data = json_decode($meta);
    if(!$data || !isset($data->idCentre)) {
        throw new RuntimeException('Aquest fitxer no conté les metadades necessàries per a ser processat. Pot ser que no s\'hagi generat amb l\'assistent?');
    }
    if($data->idCentre!=$schoolID) {
        throw new RuntimeException('El fitxer que heu enviat correspon a un altre centre educatiu. Si us plau, envieu el document corresponent al centre: '.$schoolID);
    }

    // Move the file to the documents space
    if (!move_uploaded_file($tmpFilePath, FILES_PATH.'/'.$fileName)) {
        throw new RuntimeException('No s\'ha pogut desar el fitxer.');
    }

    // Update database
    $resposta->nomFitxer = $fileName;
    $resposta->dataFitxer = time();
    $resposta->signatPer = $signedBy;
    $resposta->metaFitxer = $meta;
    $resposta->estat = 'ENVIAT';
    updateResposta($dbConn, $schoolID, $resposta);

    logMsg('UPLOAD', 'school: '.$schoolID.' file: '.$fileName);

    $result->resposta = $resposta;
    $result->status = 'ok';

} catch (RuntimeException $e) {
    $result->status = 'error';
    $result->error = $e->getMessage();
    logMsg('ERR-UPLOAD', $e->getMessage().' school: '.$schoolID);
}

// Set response headers and content
header('Content-Type: application/json;charset=UTF-8');
allowOriginHeader();

print json_encode($result);          
