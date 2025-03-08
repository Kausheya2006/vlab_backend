# VLAB-BACKEND

**Note**:  The steps mentioned as **Only Once Setup** has to be done only once for your project.

###  Create a GCP Project  (Only once Setup)
1. Go to Google Cloud Console [https://console.cloud.google.com/welcome](https://console.cloud.google.com/welcome)
2. Create a project with the name: 
3. See the Project ID)

### Set the Environment 
```
export GCP_PROJECT_ID="your project id"
export SERVICE_AC_DISPLAYNAME="service account id"
export BUCKET_NAME="bucket name"
export GAR_REPOSITORY_ID="vlab-backend"
export GAR_LOCATION="us-central1"
```

### Login To GCloud and Other Setup 
```
gcloud components update
gcloud auth login
gcloud config set project $GCP_PROJECT_ID
```

### Create an Service A/c ( Only once Setup )
```
gcloud iam service-accounts create $SERVICE_AC_DISPLAYNAME --display-name $SERVICE_AC_DISPLAYNAME
```

### Enable the APis ( Only once Setup )
```
gcloud services enable cloudresourcemanager.googleapis.com \
    artifactregistry.googleapis.com \
    iam.googleapis.com \
    run.googleapis.com \
    storage.googleapis.com \
    --project=$GCP_PROJECT_ID
```

### Set the IAM roles ((Service includes CloudRun, GCS, Artifact Registry)) ( Only once Setup )
```
for role in resourcemanager.projectIamAdmin \
            iam.serviceAccountUser \
            run.admin \
            artifactregistry.writer \
            artifactregistry.reader \
            artifactregistry.admin \
            storage.admin \
            storage.objectAdmin \
            storage.objectViewer \
            storage.objectCreator \
            secretmanager.secretAccessor; do
    gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
        --member=serviceAccount:$SERVICE_AC_DISPLAYNAME@$GCP_PROJECT_ID.iam.gserviceaccount.com \
        --role=roles/$role
done
```

### Create Bucket ( Only once Setup )
```
gcloud storage buckets create gs://$BUCKET_NAME --location=US --uniform-bucket-level-access
```

### Create GAR Registry 
```
gcloud artifacts repositories create $GAR_REPOSITORY_ID \
    --project=$GCP_PROJECT_ID \
    --location=$GAR_LOCATION \
    --repository-format=docker \
    --description="Docker repository for React server"
```

### Creating key.json for Service Account 
```
gcloud iam service-accounts keys create key.json \
    --iam-account=$SERVICE_AC_DISPLAYNAME@$GCP_PROJECT_ID.iam.gserviceaccount.com
```
Copy the content of key.json into GitHub Secrets in your repository. The GitHub secret key should be `GCP_SA_KEY`.

## CICD specific Files
 1. Go to `.github/workflows/pipeline-main.yml`. Just change the parameters `GCP_PROJECT_ID`, `CLOUD_RUN_SERVICE` etc as per your need.


## Commit The Codes
Run this everytime you make a commit  and it will be deployed at your google cloud.
```
sh git-push.sh main 'sample commit message'
```
Verify the deployment at Actions tab of your repository.

Add the environment variables at Secrets tab of your google cloud project. Verify the changes in Cloud Run

