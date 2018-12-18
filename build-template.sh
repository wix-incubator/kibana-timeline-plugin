#!/usr/bin/env bash

# ----------------------- EDIT THESE FIELDS ------------------
export KIBANA_ROOT="{YOUR_KIBANA_ROOT}"
export PLUGIN_ROOT="{YOUR_PLUGIN_ROOT}"
# ----------------------- EDIT THESE FIELDS ------------------

export PLUGIN_NAME="timeline"

if [ -d "/tmp/kibana" ]; then rm -rf /tmp/kibana/*; fi;

mkdir -p "/tmp/kibana/${PLUGIN_NAME}";

cd /tmp/kibana/;

cp -r $PLUGIN_ROOT/. /tmp/kibana/$PLUGIN_NAME/;

if [ -f "/tmp/${PLUGIN_NAME}.zip" ]; then "rm /tmp/${PLUGIN_NAME}.zip"; fi;

cd /tmp; zip -r ${PLUGIN_NAME}.zip ./kibana/${PLUGIN_NAME}/* ; cd ..;

$KIBANA_ROOT/bin/kibana-plugin remove $PLUGIN_NAME
$KIBANA_ROOT/bin/kibana-plugin install file:///tmp/$PLUGIN_NAME.zip;