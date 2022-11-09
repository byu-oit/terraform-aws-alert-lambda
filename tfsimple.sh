#! /bin/bash
echo "terraform apply /examples/simple/simpele.example"
echo " go to examples/simple..."
cd examples/simple
#echo "aws sso login..."
#aws sso login
echo "run terraform apply"
terraform apply
echo "return to project root folder...."
cd ../..
echo "Done..."
