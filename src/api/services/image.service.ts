import S3 from 'aws-sdk/clients/s3'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { v4 as uuid } from 'uuid'

class ImageService {

    private s3Instance : S3;

    constructor() {
        this.s3Instance = new S3({
            region: process.env.AWS_BUCKET_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        })
    }

    public async uploadImage(image : string) {
        try {
            const base64Image = Uint8Array.from(Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64'))

            const uploadParams : any = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: base64Image,
                Key: uuid()
            }
    
            return this.s3Instance.upload(uploadParams).promise()
        }
        catch (error) {
            throw new Error('Er is een probleem opgetreden met het uploaden van de afbeelding')
        }
    }
    
    public async deleteImage(image: string) {
        try {
            const downloadParams : any = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image
            }
    
            return this.s3Instance.deleteObject(downloadParams).promise();
        }
        catch (error) {
            throw new Error('Er is een probleem opgetreden met het verwijderen van de afbeelding')
        }
    }

    public async getImage(image: string) {
        try {
            const signedImageUrl : any = await getSignedUrl({
                url: `${process.env.AWS_CLOUDFRONT_CDN}/${image}`,
                dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24) as any,
                privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY as any,
                keyPairId: process.env.AWS_CLOUDFRONT_KEYPAIR_ID as any,
            }) 
    
            return signedImageUrl;
        }
        catch (error : any) {
            throw new Error(error.message)
        }
    }
}

export default ImageService;