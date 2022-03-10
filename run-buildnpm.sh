#clear

cat ./banner.txt

if [ ! -d "node_modules" ]; then
  echo "Error: no node_modules folder found, please execute 'run-prep.sh first"
  exit
fi

#export NODE_OPTIONS=--openssl-legacy-provider

npm run buildnpm