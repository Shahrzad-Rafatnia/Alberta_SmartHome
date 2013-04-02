<?php

///
/// Handles a request for a calculation
///

ini_set('display_errors', 0); // Allows PHP to return response 500 on errors

require_once __DIR__ . '/../vendor/autoload.php';

use \UASmartHome\Auth\Firewall;
Firewall::instance()->restrictAccess(Firewall::ROLE_ENGINEER);

use \UASmartHome\Database\Engineer2;

// Check that the request is valid
if (!(isset($_POST['calculation'])
    && isset($_POST['energy'])
    && isset($_POST['startdate'])
    && isset($_POST['enddate'])
    && isset($_POST['starthour'])
    && isset($_POST['endhour'])))
{
    http_response_code(400);
    die;
}

static $FORMULA =  array(
    "eq1" => 1,
    "eq2" => 2,
    "eq3" => 3,
    "eq4" => 4,
    "eq5" => 5
);

$calculation = $_POST['calculation'];

/* Stupid PHP and its stupid butts. */
date_default_timezone_set('America/Edmonton');
$startDate = \DateTime::createFromFormat('Y-m-d H:i', $_POST['startdate'] .
    ' ' . $_POST['starthour']);
$endDate = \DateTime::createFromFormat('Y-m-d H:i', $_POST['enddate'] .
    ' ' . $_POST['endhour']);

/* Die because we couldn't parse the date format. */
if ($startDate === false || $endDate === false) {
    http_response_code(400);
    die;
}


$result = Engineer2::EQ(
    $startDate->format('Y-m-d H:i'),
    $endDate->format('Y-m-d H:i'),
    $FORMULA[$calculation],
    $_POST['energy']
);

$cols = array(
    'COP1' => array("COP of Solar+DWHR+Geo Field+Heat Pumps", ""),
    'COP2' => array("COP of Entire Heating System", ""),
    'COP3' => array("COP of Heat Pumps", ""),
    'NUM1' => array("Heat Energy COP1", ""),
    'NUM2' => array("Heat Energy COP2", ""),
    'NUM3' => array("Heat Energy COP3", ""),
    'P11-P110' => array("Geo P1 1", "KWH"),
    'P12-P120' => array("Geo P1 2", "KWH"),
    'HPx1-HPx10' => array("Heat Pump HP1", "KWH"),
    'HPx2-HPx20' => array("Heat Pump HP2", "KWH"),
    'HPx3-HPx30' => array("Heat Pump HP3", "KWH"),
    'HPx4-HPx40' => array("Heat Pump HP4", "KWH"),
    'Hours' => array("Hours In Period", "hours"),
    'SHTS' => array("Solar SHTS", "KWH"),
    'P7_1' => array("Elect Usage DWHR P7 1", "KWH"),
    'P8' => array("Elect Usage DWHR P8", "KWH"),
    'P2_1' => array("Elect Usage HP P2 1", "KWH"),
    'P2_2' => array("Elect Usage HP P2 2", "KWH"),
    'P2_3' => array("Elect Usage HP P2 3", "KWH"),
    'P2_4' => array("Elect Usage HP P2 4", "KWH"),
    'P4_1' => array("Elect Usage Boilers P4 1", "KWH"),
    'P4_2' => array("Elect Usage Boilers P4 2", "KWH"),
    'BLR_1' => array("Elect Usage Boilers BLR 1", "KWH"),
    'BLR_2' => array("Elect Usage Boilers BLR 2", "KWH"),
    'P3_1' => array("Elect Usage Heat Loop P3 1", "KWH"),
    'P3_2' => array("Elect Usage Heat Loop P3 2", "KWH"),
    'DOM1' => array("Total Elect COP1", ""),
    'DOM2' => array("Total Elect COP2", ""),
    'DOM3' => array("Total Elect COP3", "")
);

function getColumnName($uglyName) {
    global $cols;

    return isset($cols[$uglyName])
        ? $cols[$uglyName]
        : $uglyName;
}

foreach ($result as $calc => $val) {

    if (is_null($val)) {
        $val = "null (no data)";
    }

    if ($calculation === "eq1") {
        echo "<br>" . $_POST['energyname'] . " Energy" . " = $val GJ <br>\n";
    } else if ($calculation === "eq2" || $calculation === "eq3") {
        echo "<br><strong> " . $_POST['name'] . " </strong> = $val KWH <br>\n";
    } else if ($calculation === "eq4" || $calculation === "eq5") {
        $col = getColumnName($calc);
        echo "<br><strong>" . $col[0] . "</strong> = $val " . $col[1] . " <br>\n";
    } else {
        echo "<br><strong> " . $_POST['name'] . " </strong> = $val <br>\n";
    }

}

