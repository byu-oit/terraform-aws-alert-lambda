#! /bin/bash
echo "updating the zip file with the current index.js"
echo "cd ./lambda..."
cd lambda
echo "deleting the old zipfile..."
rm function.zip
echo "zipping new index.js"
zip function.zip *
cd ..
echo "done..."
