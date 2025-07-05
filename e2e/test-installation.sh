# name: Create clean temp directory
rm -rf ./temp
npx sv create --template minimal --types ts --no-add-ons --install npm ./temp

# name: Install bookemoji in temp
cd temp
npm install
npm create bookemoji@latest --cli
npm run build