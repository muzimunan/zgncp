FROM 192.168.8.87:5000/nginx

COPY ./dist /data 

RUN rm /etc/nginx/conf.d/default.conf

ADD pigx-ui.conf /etc/nginx/conf.d/default.conf 

RUN /bin/bash -c 'echo init ok'