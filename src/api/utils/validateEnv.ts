import { cleanEnv, str, port } from 'envalid';

function validateEnv() : void {
    cleanEnv(process.env, {
        AWS_BUCKET_REGION: str(),
        AWS_BUCKET_NAME: str(),
        AWS_ACCESS_KEY: str(),
        AWS_SECRET_KEY: str(),
        AWS_CLOUDFRONT_CDN: str(),
        AWS_CLOUDFRONT_PRIVATE_KEY: str(),
        MONGOOSE_CONNECTIONSTRING: str(),
        AWS_CLOUDFRONT_KEYPAIR_ID: str(),
        SERVER_PORT: port( {default: 5000} )
    })
}

export default validateEnv