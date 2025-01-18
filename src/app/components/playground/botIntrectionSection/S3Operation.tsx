import { decryptFromBase64 } from '@/utils/Base64EncryptionDecription';
import AWS from 'aws-sdk';
import { toast } from 'sonner';
export const initializeAWS = () => {
  const accessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
  const secretKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  if (!accessKey || !secretKey || !region) {
    toast.error('Missing AWS credentials in environment variables');
    console.error('Missing AWS credentials in environment variables');
    return false;
  }

  const accessKeyDecrypted = decryptFromBase64(accessKey);
  const secretKeyDecrypted = decryptFromBase64(secretKey);
  const regionDecrypted = decryptFromBase64(region);

  if (
    !accessKeyDecrypted.success ||
    !secretKeyDecrypted.success ||
    !regionDecrypted.success
  ) {
    console.error('Failed to decrypt AWS credentials');
    toast.error('Wrong AWS credentials');

    return false;
  }

  try {
    AWS.config.update({
      accessKeyId: accessKeyDecrypted.result,
      secretAccessKey: secretKeyDecrypted.result,
      region: regionDecrypted.result,
    });
    return true;
  } catch (error) {
    console.error('Error updating AWS configuration:', error);
    return false;
  }
};
