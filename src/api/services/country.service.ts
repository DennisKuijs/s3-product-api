import S3 from 'aws-sdk/clients/s3'

class CountryService {

    private s3instance : S3;

    constructor() {
        this.s3instance = new S3({
            region: process.env.AWS_BUCKET_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        })
    }

    public async getCountries() {
        try {
            const downloadParams : any = {
                Bucket: process.env.AWS_BUCKET_NAME_APP,
                Key: process.env.COUNTRY_FILE_NAME
            }
    
            const countries = await this.s3instance.getObject(downloadParams).promise();
            const jsonCountries = JSON.parse(countries.Body?.toString('utf-8') as any)

            return jsonCountries;
        }        
        catch (error : any) {
            throw new Error('Something went wrong fetching the countries');
        }
    }

}

export default CountryService;
