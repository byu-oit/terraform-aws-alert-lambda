#! /bin/bash
echo "terraform DESTROY /examples/simple/simple.example"
echo " go to examples/simple..."
cd examples/simple
#echo "aws sso login..."
#aws sso login
echo "Destroying terraform project"
terraform destroy
echo "return to project root folder...."
cd ../..
echo "Done..."
