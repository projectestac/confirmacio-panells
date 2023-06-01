<?php
/**
 * File: getSchoolData.php
 *
 * This script authenticates the user against Google and returns the data
 * associated to the school where the user belongs to.
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


// *****************************************************************
// ** WARNING: 'allow_url_fopen' must be set to 'On' in 'php.ini' **
// *****************************************************************

require_once 'config.php';
require_once 'dbUtils.php';
require_once 'cors.php';
require_once 'log.php';

/**
 * Gets the value associated to $key in the $array if set,
 * returning $default otherwise
 * 
 * @param array  $array   The array where to search for
 * @param string $key     Key to be searched
 * @param any    $default Default value to return if key not found
 * 
 * @return any
 */
function getAttr($array, $key, $default)
{
    return isset($array->{$key}) ? $array->{$key} : $default;
}

/**
 * Gets the content of a remote file, performing a network call
 * 
 * @param string $url The remote file to retrieve
 * 
 * @return string
 */
function getRemoteFile($url)
{
    $result = '';
    try {
        if (!USE_PROXY) {
            $result = file_get_contents($url);
        } else {
            $proxy = PROXY_HOST.':'.PROXY_PORT;
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_PROXY, $proxy);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            //curl_setopt($ch, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
            $result = curl_exec($ch);
            curl_close($ch);
            if ($result === '' || $result === false) {
                throw new Exception('No s\'ha pogut verificar l\'usuari. Proxy error.');
            }
        }
    } catch (Exception $e) { 
        throw $e;
    }
    return $result;
}

/**
 * Main function
 */

allowOriginHeader();
if (isset($_POST[ID_TOKEN]) && $_POST[ID_TOKEN] !== '') {
    $errMsg = '';
    try {
        $result = (object)['status'=>'processing'];

        // Read settings file
        $settingsFileName = FILES_PATH.'/'.SETTINGS_FILE;
        $settings = json_decode(file_get_contents($settingsFileName), false);
    
        // Check token validity (Warning: external call to a Google API!)
        $GOOGLE_CHECK_ENDPOINT = isset($_POST[USE_NEW_API]) ? CHECK_GOOGLE_TOKEN_NEW_API : CHECK_GOOGLE_TOKEN;
        $raw = getRemoteFile($GOOGLE_CHECK_ENDPOINT.$_POST[ID_TOKEN]);
        $user = json_decode($raw, false);

        if (!isset($user->{'email'}) || $user->{'email'} === '') {
            // Invalid token!
            $result->error = 'Validació incorrecta';
            $result->status = 'error';
            $errMsg = ' No email in user data';
        } else {       
            // Check if user is valid and load email
            $email = $user->email;
            $validUser = false;
            $schoolID = null;
       
            $hd = getAttr($user, 'hd', null);
            if ($hd === HD && preg_match('/[abce]\d{7}/', $email) === 1) {
                $schoolID = chr(ord($email)-49).substr($email,1,7);
                $validUser = true;
            }
       
            if (isset($settings->users)) {
                foreach ($settings->users as $usr) {
                    if ($usr->id === $email) {
                        if(isset($_POST['codi']))
                            $schoolID = $_POST['codi'];
                        else
                            $schoolID = $usr->school;
                        $validUser = true;                        
                        break;
                    }
                }
            }

            if ($validUser !== true) {
                // Unathorized
                $result->status = 'error';
                $result->error = 'L\'identificador "'.$email.'" no correspon a cap centre educatiu. Heu d\'iniciar sessió amb l\'identificador XTEC de centre (lletra minúscula seguida de set dígits numèrics i "@xtec.cat")';
                $errMsg = 'User email: '.$email;
            }
            /* TODO: Check if token is expired (use new API from Google)
            else if (!isset($user->exp) || $user->exp < (new DateTime())->getTimestamp()) {
                $result->status = 'error';
                $result->error = 'Credencial no vàlida';
                $errMsg = 'Expired session';
            }
            */
            else {

                // Get current data from DB
                $dbConn = getDBConn();
                $actual = getActual($dbConn, $schoolID);

                if(!$actual) {
                    $result->status = 'error';
                    $result->error = 'El centre '.$schoolID.' no ha de presentar el document de proposta d\'equipaments #ecoDigEdu.';
                    $errMsg = 'Invalid school ID: '.$schoolID;
                } else {
                    $result->email = $email;
                    $result->avatar = getAttr($user, 'picture', '');
                    $result->actual = $actual;
                    $result->fullUserName = $user->name;
                    $result->status = 'ok';

                    // Fetch updated data
                    $resposta = getResposta($dbConn, $schoolID);
                    if(!$resposta){
                        $resposta = (object)[
                            'idCentre' => $schoolID,
                            'timestamp' => 0,
                            'user' => $email,
                            'estat' => 'OBERT',
                            'grups' => $actual->grups,
                            'pDepartament' => $actual->pDepartament,
                            'pAltres' => $actual->pAltres,
                            'mad' => $actual->mad,
                            'a75paret' => $actual->a75paret,
                            'a75rodes' => $actual->a75rodes,
                            'a65paret' => $actual->a65paret,
                            'a65rodes' => $actual->a65rodes,
                            'srFixes' => $actual->srFixes,
                            'srRodes' => $actual->srRodes,
                            'armGrans' => 0,
                            'armPetits' => 0,
                            'tablets' => 0,
                            'visDoc' => 0,
                            'altaveus' => 0,
                            'comentaris' => '',
                            'nomFitxer' => '',
                            'dataFitxer' => null,
                            'signatPer' => '',
                            'metaFitxer' => null,
                        ];
                        // Insert record in database
                        addResposta($dbConn, $resposta);
                    }
                    $result->resposta = $resposta;

                    // Set session data
                    startSession();
                    $_SESSION['schoolID'] = $schoolID;    
                    logMsg('LOGIN', '{"user": "' . $email . '","school":"' . $schoolID . '","status":"' . $result->status . '"}');
                }
            }
        }

        // Set response headers and content
        header('Content-Type: application/json;charset=UTF-8');
        echo json_encode($result);
    } catch (Exception $e) {
        // Internal error
	    http_response_code(500);
	    $result->status = 'error';
	    $result->error = 'Error del servidor: '.$e->getMessage();
	    echo json_encode($result);
        logMsg('ERR-LOGIN', $e->getMessage().' '.$errMsg);
    }
} else {
    // Bad request
    http_response_code(400);
}
