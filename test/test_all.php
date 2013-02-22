#!/usr/bin/env php
<?php

/* Autoload all Composer-managed libraries. */
require_once dirname(__FILE__) . '/../vendor/autoload.php';
/* Autorun the test case. */
require_once dirname(__FILE__) . '/../vendor/vierbergenlars/simpletest/autorun.php';

/* Test Suite: Test EVERYTHING...
 * ...named in *test.php in this directory...
 */

class TestAllSuite extends TestSuite {
   function __construct() {
       parent::__construct();
       $this->collect(dirname(__FILE__),
         new SimplePatternCollector('/test.php$/'));
   }
}
