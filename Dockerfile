FROM debian:buster-slim

RUN apt update && apt install curl nodejs npm build-essential libnuma-dev -y && rm -rf /var/lib/apt/lists/*

RUN curl https://git.kernel.org/pub/scm/utils/rt-tests/rt-tests.git/snapshot/rt-tests-1.10.tar.gz --output rt-tests.tar.gz && \
tar xzf rt-tests.tar.gz && \
cd rt-tests-1.10 && \
make all && \
make install

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]