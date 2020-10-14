FROM nginx
COPY ./dist /var/www/html
COPY ./custom.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]