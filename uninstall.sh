#!/bin/sh
echo "uninstalling wxm-toolbox-ui..."
echo "deleting web files directory..."
rm -rf /var/www/toolbox/wxm
echo "web files deleted. You may need to remove the entry in your nginx config that pointed to this wxm folder."
echo "and there might be a cron job you should delete that kept this repo updated."
echo "successfully uninstalled wxm-toolbox-ui."
