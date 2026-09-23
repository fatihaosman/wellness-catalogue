# Women's Wellness Product Catalogue

## Overview

A full-stack women's wellness product catalogue and customer inquiry website built with **React and AWS serverless services**.

Customers can view products, see prices and benefits, select a product, and submit an inquiry.

## Technologies

* React + Vite
* Python
* AWS Lambda
* API Gateway
* DynamoDB
* IAM
* S3
* CloudFront


## Architecture

```text
React
  ↓
API Gateway
  ↓
Lambda
  ↓
DynamoDB
```

Website deployment:

```text
User
 ↓
CloudFront
 ↓
Private S3 Bucket
 ↓
React Website
```

The frontend does **not** connect directly to DynamoDB. API Gateway and Lambda handle communication with the database.

## DynamoDB

Two tables were created:

### `products`

Stores the product catalogue.

**Partition key:** `productId`

### `inquiries`

Stores customer inquiries.

**Partition key:** `inquiryId`

Each inquiry contains:

* Name
* Phone
* Delivery area
* Product
* Quantity
* Message
* Date/time

## Lambda Functions

### `project7-get-products`

Reads products from the `products` table using DynamoDB `Scan` and returns them to the frontend.

### `project7-submit-inquiry`

Receives customer inquiries and saves them to the `inquiries` table using `PutItem`.

IAM permissions were restricted so each Lambda only has access to the DynamoDB operation it requires.

## API Gateway

API:

```text
project7-api
```

Invoke URL:

```text
https://r1qhdf5vr8.execute-api.af-south-1.amazonaws.com
```

Routes:

```text
GET  /products
POST /inquiries
```

CORS was configured to allow the React frontend to communicate with the API.

## Frontend

The React application:

* Loads products from the API
* Displays product information and prices
* Allows users to select a product
* Submits inquiry forms through the API
* Displays success and error messages

The production version was created with:

```bash
npm run build
```

This generated the `dist` folder containing the production-ready website files.

## S3 Deployment

The production `dist` files were uploaded to a **private S3 bucket**.

The bucket was kept private rather than publicly accessible.

CloudFront was configured to access the bucket and deliver the website to users.

## CloudFront

CloudFront was used to distribute the website from the private S3 bucket.

**CloudFront domain:**

```text
https://d13oaz9filebnt.cloudfront.net
```

The default root object was set to:

```text
index.html
```

Initially, CloudFront returned a `403 AccessDenied` error. Setting `index.html` as the default root object fixed the problem.

### DNS

This project did not use Route 53 or a custom domain.

The automatically generated CloudFront domain was used as the website address.

A custom domain could be connected later using DNS and CloudFront.

## Problems & Solutions

### Wrong API URL

The frontend initially used an incorrect API Gateway URL. The correct Invoke URL was obtained from API Gateway and added to the React application.

### CORS Error

The browser blocked API requests because CORS was not configured. API Gateway CORS was configured to allow the frontend origin and required methods.

### CloudFront 403 Error

CloudFront initially returned `AccessDenied`. Setting the default root object to `index.html` resolved the issue.

## What I Learned

This project gave me practical experience with:

* Building a React application connected to AWS
* Creating and using DynamoDB tables
* Writing serverless Lambda functions
* Creating API endpoints with API Gateway
* Managing IAM permissions
* Configuring CORS
* Building a React application for production
* Deploying files to S3
* Using CloudFront with a private S3 bucket
* Understanding CloudFront domains and DNS
* Testing and troubleshooting AWS services
* Connecting multiple AWS services into one application

## Final Website

```text
https://d13oaz9filebnt.cloudfront.net
```
