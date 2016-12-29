##### running

```
yarn
yarn run pg-start
yarn run migrate
yarn run start
```


##### env variables
these can be put into a `.env` file at the root

```
BNET_ID=xxx
BNET_SECRET=xxx

PORT=8080

# used as callback url for bnet
API_URL=https://busybot2.ngrok.io

# has to be on guildsy.com or guildsy.io for cors
UI_URL=http://local.guildsy.com:3000
```