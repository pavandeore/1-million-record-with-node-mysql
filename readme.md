# RabbitMQ use to make update request with node and mysql CRUD app

to run this 

## Start the rabbitmq server 
- sudo systemctl start rabbitmq-server

## Start the worker
- node worker.js

## Start the Web Server
- npm run start 

## To test 1000 update request at 1 time
- bash ./send_request.sh




if you are not on ubuntu follow this guide - https://www.rabbitmq.com/docs/platforms


# RabbitMQ installation and commands for ubuntu

# sync package metadata
sudo apt-get update
# install dependencies manually
sudo apt-get -y install socat logrotate init-system-helpers adduser

# download the package
sudo apt-get -y install wget
wget https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.13.7/rabbitmq-server_3.13.7-1_all.deb

# install the package with dpkg
sudo dpkg -i rabbitmq-server_3.13.7-1_all.deb

rm rabbitmq-server_3.13.7-1_all.deb



# stop the local node
sudo systemctl stop rabbitmq-server

# start it back
sudo systemctl start rabbitmq-server

# check on service status as observed by service manager
sudo systemctl status rabbitmq-server