#!/bin/sh
echo "removing wxm-toolbox-ui website files..."
rm -rf /var/www/toolbox/wxm/*
if [ $? -eq 0 ]; then
  echo "successfully removed wxm-toolbox-ui website files."
else
  echo "failed to remove wxm-toolbox-ui website files."
fi
