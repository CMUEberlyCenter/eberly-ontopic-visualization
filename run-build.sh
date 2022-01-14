clear

cat ./banner.txt

if [ ! -d "node_modules" ]; then
  echo "Error: no node_modules folder found, please execute 'run-install.sh first"
  exit
fi

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac
echo Building for: ${machine}

#if [ ${machine} == "Linux" ]; then
# export NODE_OPTIONS=--openssl-legacy-provider
#fi

npm run build