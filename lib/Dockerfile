FROM quay.io/sampandey001/secktor
FROM node:18.17.0
RUN git clone https://github.com/crazy237/Crazy-MD /root/crazy
WORKDIR /root/crazy/
RUN npm install -g npm@10.2.3
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
