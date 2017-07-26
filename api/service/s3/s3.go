package s3

import (
	"fmt"
	"log"

	"github.com/minio/minio-go"
)

const (
	s3location = "eu-west"
	bucketName = "media"
)

var client *minio.Client

// Init is used to initialize the minio client.
// It will connect the app to the minio server or return an error.
func Init(endpoint, accessKeyID, secretAccessKey string, ssl bool) error {
	var err error
	var found bool

	// Create s3 client.
	client, err = minio.New(endpoint, accessKeyID, secretAccessKey, ssl)
	if err != nil {
		return err
	}

	// Create app bucket.
	if found, err = client.BucketExists(bucketName); !found && err == nil {
		if err = client.MakeBucket(bucketName, s3location); err != nil {
			log.Fatalln("S3 initialization: can't create bucket: ", err)
		}
	} else if err != nil {
		log.Fatalln("S3 initialization: can't find bucket: ", err)
	}
	return nil
}

// ListObjects return all objects in a folder.
func ListObjects(folder string) error {
	doneCh := make(chan struct{})
	defer close(doneCh)

	objectCh := client.ListObjectsV2(bucketName, folder, true, doneCh)
	for object := range objectCh {
		if object.Err != nil {
			fmt.Println(object.Err)
			return object.Err
		}
		fmt.Println(object)
	}
	return nil
}

// NOTE: For now GetObject return a minio object.
// A DTO custom type will be created to abstract the minio one.

// GetObject return an object described by its name.
func GetObject(name string) (*minio.Object, error) {
	object, err := client.GetObject(bucketName, name)
	if err != nil {
		log.Fatalln("S3 operation: can't get object [", name, "]: ", err)
		return nil, err
	}
	return object, nil
}

// NOTE: Need more insight on how the upload between front and API will work before doing this.

// Upload is used to upload a file.
func Upload(name, content string) {
	//
}
