#!/bin/sh
echo "running yarn"
yarn
if [ $? -eq 0 ]; then
  echo "running yarn build..."
  yarn build
  while [ $? != 0 ]
  do
    echo "failed to build wxm-toolbox-ui website files. trying again..."
    yarn build
  done
  echo "yarn build successful. copying dist files to www folder..."
  mkdir -p /var/www/toolbox/wxm
  cp -rf dist/* /var/www/toolbox/wxm/
  if [ $? -eq 0 ]; then
    echo "successfully installed wxm-toolbox-ui website files"
  else
    echo "failed to install wxm-toolbox-ui website files"
  fi
else
  echo "yarn failed"
fi
