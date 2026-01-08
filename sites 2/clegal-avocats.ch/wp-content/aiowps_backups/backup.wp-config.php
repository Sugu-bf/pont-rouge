<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'lqrw_WP996854');

/** MySQL database username */
define('DB_USER', 'lqrw_WP996854');

/** MySQL database password */
define('DB_PASSWORD', 'jsd0bIrHD2');

/** MySQL hostname */
define('DB_HOST', 'lqrw.myd.infomaniak.com');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '^fH!bXV`.ZDt<NxBns3pZk:l)(R+Ocnr|novFWgXx~&?CiY/4mStNPFMdeE!G9Ka');
define('SECURE_AUTH_KEY',  'Ru|+XMU7tu1Yt7A6XK.EtXeHbN}9X0@2.EsVB2CJ1vzYpit3%E:-ZzS)Z,T%6Wa|');
define('LOGGED_IN_KEY',    'RX{TfN9*i7L}dGnX6aYV=.i8bOW/rslsyABBXt?WWRNrCA)#2uK)&j@ZF:F.KPej');
define('NONCE_KEY',        '<-#A7r9~X)VNh.rmk0=i^s*I+-Y6Y:JukRr8}G`Zl6?F?&t!_.uf<zbF{PH8-*Pz');
define('AUTH_SALT',        '%jg6OV1xCeG_!PY>^*qadQ0JD^w|tx5d%pjaPp8I4EjL!KJ~89v_7,kz>0pZN%iw');
define('SECURE_AUTH_SALT', 'NMJMI^YMM?HLs2*R61//Ne}&!r=tZ>_=RN?R9ao:/N<_PP%mvz99+VY_pp)I3#6r');
define('LOGGED_IN_SALT',   'M?f+%4w|.^%#f>U_k36bckJJ?L`h9stbm1ihK0e52~0kgk5LcxyL*Veg|w3/+AnS');
define('NONCE_SALT',       'yJCN=DV2^`4hDr(U|@YEx:y&;Rs52rO#hu0uY3QSt~XI_l7&~|/k6V-YXLo#DeU<');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_996854_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
//define('WPLANG', 'fr_FR');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG',          false);
define('WP_DEBUG_LOG',      false);
define('WP_DEBUG_DISPLAY',  false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
