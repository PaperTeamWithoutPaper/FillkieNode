REPOSITORY=/home/ubuntu/node-app
cd $REPOSITORY/build
sudo npx --yes yarn
cp /home/ubuntu/.env ./.env
pm2 start ../ecosystem.config.js
