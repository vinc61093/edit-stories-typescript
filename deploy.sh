
#!/bin/bash
env="$1"

npm install -g typescript@^3.0.1
npm install
npm install --only=dev

npm run-script $env

node_modules/serverless/bin/serverless deploy --stage $env --region us-west-2
node_modules/serverless/bin/serverless syncToS3 --region us-west-2 --stage $env
node_modules/serverless/bin/serverless invalidateCloudFrontCache --region us-west-2 --stage $env
