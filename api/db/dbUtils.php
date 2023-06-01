<?php
/**
 * File: dbUtils.php
 *
 * Miscellaneous database utilities
 * 
 * PHP Version 7
 * 
 * @category Service
 * @package  DB
 * @author   Francesc Busquets <francesc@gmail.com>
 * @license  https://www.tldrlegal.com/l/eupl-1.2 EUPL-1.2
 */


require_once 'config.php';

function getDBConn() {
    return new PDO(
        'mysql:dbname='.DB_NAME.
        ';host='.DB_HOST.
        ';charset=utf8',
        DB_USER, DB_PASSWORD
    );
}

function getActual($dbConn, $schoolID) {
    $stmt = $dbConn->prepare('SELECT * FROM `actual` WHERE id=:schoolID');    
    $stmt->bindParam(':schoolID', $schoolID, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetchObject();
    // Numerize values
    if($result) {
        $result = json_decode(json_encode($result, JSON_NUMERIC_CHECK));
        $result->id = $schoolID;  
    }
    return $result;
}

$CAMPS_RESPOSTA = [
    'idCentre',
    'user','estat',
    'grups','pDepartament','pAltres','mad',
    'a75paret','a75rodes','a65paret','a65rodes',
    'srFixes','srRodes',
    'armGrans','armPetits','tablets','visDoc','altaveus',
    'comentaris',
    'nomFitxer', 'dataFitxer', 'signatPer', 'metaFitxer'
];

function ff($carry, $item) {
  return $carry.($carry == '' ? '' : ',').$item.'=:'.$item;
}

function getResposta($dbConn, $schoolID) {
    $stmt = $dbConn->prepare('SELECT * FROM `respostes` WHERE idCentre=:schoolID');
    $stmt->bindValue(':schoolID', $schoolID, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetchObject();
    if($result) {
        // Numerize values
        $result = json_decode(json_encode($result, JSON_NUMERIC_CHECK));
        $result->idCentre = $schoolID;
    }
    return $result;
}

function getRespostes($dbConn, $from) {
    $result = [];
    $stmt = $dbConn->prepare('SELECT * FROM `respostes` WHERE timestamp > :from');
    $stmt->bindValue(':from', $from, PDO::PARAM_STR);
    $stmt->execute();
    $respostes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if($respostes) {
        foreach($respostes as $r) {

            // Si ja ha s'ha enviat, llegeix valors de 'metaFitxer'
            if($r['estat'] === 'ENVIAT')
                $v = json_decode($r['metaFitxer']);
            else
                $v = json_decode(json_encode($r, JSON_NUMERIC_CHECK));

            $row=[];
            // Push school initial data
            array_push($row,
                $r['idCentre'],
                $r['timestamp'],
                $r['user'],
                $r['estat'],
                $r['grups'],
                $r['pDepartament'],
                $r['pAltres'],
                $r['mad']
            );
            // Push meta values        
            array_push($row,
                $v->a75paret,
                $v->a75rodes,
                $v->a65paret,
                $v->a65rodes,
                $v->srFixes,
                $v->srRodes,
                $v->armGrans,
                $v->armPetits,
                $v->tablets,
                $v->visDoc,
                $v->altaveus,
                $v->comentaris
            );
            // Push remaining fields
            array_push($row,
                $r['nomFitxer'],
                $r['dataFitxer'],
                $r['signatPer']
            );

            array_push($result, $row);
        }
    }
    return $result;
}

function addResposta($dbConn, $data) {
    
    global $CAMPS_RESPOSTA;

    $stmt = $dbConn->prepare('INSERT INTO `respostes` ('.implode(',', $CAMPS_RESPOSTA).') VALUES (:'.implode(',:', $CAMPS_RESPOSTA).')');
    foreach($CAMPS_RESPOSTA as $key) {
        $stmt->bindValue(':'.$key, $data->$key);
    }
    return $stmt->execute();
}

function updateResposta($dbConn, $schoolID, $data) {
    
    global $CAMPS_RESPOSTA;
    
    $k = array_slice($CAMPS_RESPOSTA, 1);
    $stmt = $dbConn->prepare('UPDATE `respostes` SET '.array_reduce($k, 'ff', '').' WHERE idCentre=:schoolID');
    $stmt->bindValue(':schoolID', $schoolID);
    foreach($k as $key) {
        $stmt->bindValue(':'.$key, $data->$key);
    }
    return $stmt->execute();
}
