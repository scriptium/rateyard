FROM ubuntu:20.04

RUN apt-get update && apt-get -y upgrade
RUN apt-get -y install nginx php-fpm=2:7.4+75
RUN unlink /etc/nginx/sites-enabled/default
COPY nginx_conf /etc/nginx/sites-available/rateyard
RUN ln -s /etc/nginx/sites-available/rateyard /etc/nginx/sites-enabled/

COPY front /usr/share/rateyard
