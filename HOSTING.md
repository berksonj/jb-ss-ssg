# Hosting and Deployment Guides

## AWS S3 & CloudFront; GitHub Actions

**Summary:**

- On push to `master` or `main` branch, automatically build and deploy, using GitHub Actions.
  - Website is built from source.
  - Files are synced to AWS S3 bucket.
  - CloudFront edge cache is invalidated, and primed with new files.

---

### AWS Configuration

#### Use a website endpoint as the origin, and allow public access

*Source: https://repost.aws/knowledge-center/cloudfront-serve-static-website*

This configuration allows public read access on your website's bucket. For more information, see [Setting permissions for website access](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html).

**Note:** When you use the Amazon S3 static website endpoint, connections between CloudFront and Amazon S3 are available only over HTTP. To use HTTPS for connections between CloudFront and Amazon S3, configure an S3 REST API endpoint for your origin.

1. Use the [Amazon S3 console](https://s3.console.aws.amazon.com/s3/) to [create a bucket and turn on static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/HostingWebsiteOnS3Setup.html#step1-create-bucket-config-as-website) on the bucket.
2. From the **Static website hosting** dialog box, copy the **Endpoint** of your bucket without the leading **http://**. The format is similar to **DOC-EXAMPLE-BUCKET.s3-website-region.amazonaws.com**. You need the endpoint in this format for a later step.
3. [Add a bucket policy that allows public read access](https://docs.aws.amazon.com/AmazonS3/latest/dev/HostingWebsiteOnS3Setup.html#step3-add-bucket-policy-make-content-public) to the bucket that you created.
   **Note:** For this configuration, you must turn off the S3 bucket's [block public access settings](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html). If your use case requires you to turn on the block public access  settings, use the REST API endpoint as the origin. Then, restrict access by an origin access control (OAC) or origin access identity (OAI).
4. [Create a CloudFront web distribution](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-creating-console.html). In addition to your use case distribution settings, complete the following steps:
   For **Origin domain**, enter the endpoint that you copied in the previous step.
   **Note:** Don't select the bucket from the dropdown list.  The dropdown list includes only the S3 Bucket REST API endpoints that  you don't use in this configuration.
5. When you create your distribution, it's a best practice to use SSL  (HTTPS) for your website. To use a custom domain with HTTPS, select **Custom SSL certificate.** Choose **Request certificate** to request a new certificate. If you don't use a custom domain, then  you can still use HTTPS with the cloudfront.net domain name for your  distribution.
   **Important:** If you enter [Alternate domain names (CNAMEs)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesCNAME) for your distribution, then the CNAMEs must match the SSL certificate  that you select. To troubleshoot issues with your SSL certificate, see [How can I troubleshoot issues with using a custom SSL certificate for my CloudFront distribution?](https://repost.aws/knowledge-center/custom-ssl-certificate-cloudfront)
6. [Update the DNS records for your domain to point your website's domain to CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html). Find your distribution's domain name in the [CloudFront console](https://console.aws.amazon.com/cloudfront/). The domain name format is similar to the following example: **d1234abcd.cloudfront.net**.
7. Wait for your DNS changes to propagate and for the previous DNS entries to expire.
   **Note:** The length of time for the previous DNS values to expire [depends on the TTL value that's set at your hosted zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/troubleshooting-new-dns-settings-not-in-effect.html#troubleshooting-new-dns-settings-not-in-effect-cached-resource-record-set). It also depends on whether your local resolver uses those TTL values.
8. Create a new IAM user with access to "list", "read" & "write" that specific S3 bucket, and "CreateInvalidation" for that specific CloudFront distribution.

### GitHub Actions Configuration

1. Add the following [Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) to your GitHub repo:

   - **AWS_S3_BUCKET** – name of the S3 bucket

   - **AWS_ACCESS_KEY_ID** – IAM access key

   - **AWS_SECRET_ACCESS_KEY** – IAM secret access key

   - **AWS_REGION** – region the S3 bucket is in (e.g. "us-west-1", "us-east-2"...)

   - **CF_DISTRIBUTION** – CloudFront distribution ID
