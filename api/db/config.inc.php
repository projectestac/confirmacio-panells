<?php

// ** Proxy settings ** //
define('USE_PROXY', false); // 'true' in FMO
define('PROXY_HOST', 'squid');
define('PROXY_PORT', 3128);

// ** MySQL settings ** //
define('DB_HOST', 'mysql');
define('DB_NAME', 'enquesta');
define('DB_USER', 'enquesta');
define('DB_PASSWORD', 'enquesta');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

// ** Path to repository projects ** //
define('FILES_PATH', '/path/to/uploaded/files');
define('FILES_LOG', 'files.log');
define('SETTINGS_FILE', 'config.json');

// ** Parameter name for Google OAuth token ** //
define('ID_TOKEN', 'id_token');

// ** Endpoint used to validate OAuth tokens sent by Google ** //
// define('CHECK_GOOGLE_TOKEN', 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=');
define('CHECK_GOOGLE_TOKEN', 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=');
define('CHECK_GOOGLE_TOKEN_NEW_API', 'https://oauth2.googleapis.com/tokeninfo?id_token=');
define('USE_NEW_API', 'NEW_API');

// ** Users belonging to this Google Suite organisation are accepted ** //
define('HD', 'xtec.cat');

// Current process UID
define('UID', posix_geteuid());

// Valid origins for userlib clients
define('VALID_ORIGINS', [
  'https://projectes.xtec.cat',
  'https://met.xtec.cat',
  'http://localhost:8000'
]);

// Secret code used for retrieving data
define('ID_ACCESS_CODE', 'key');
define('ACCESS_CODE', 'abc123');
