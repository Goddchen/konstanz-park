FROM node:alpine
RUN mkdir -p /code
WORKDIR /code

COPY package.json /code
RUN npm install

COPY public/ /code/public/
COPY src/ /code/src/

EXPOSE 3000
CMD npm start
