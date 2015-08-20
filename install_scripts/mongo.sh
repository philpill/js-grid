#!/bin/bash

#conflictingreports

APP_PATH="/var/www/creports/"
LOCAL_PATH="./"

function init {
    clear
    echo "------------------------------"
    echo "installing conflicting reports"
    echo "------------------------------"
    cd $APP_PATH
    updateSource
    initDatabase
    runGulp
}

function updateSource {
    echo "- update source"
    git pull
}

function runGulp {
    echo "- gulp sass/browserify"
    ./node_modules/gulp/bin/gulp.js sass
    ./node_modules/gulp/bin/gulp.js browserify
}

function initDatabase {
    echo "- executing mongo script"
    mongo < ./install_scripts/mongo.js
}

init
