package service

import (
	"io"

	"github.com/minio/minio-go"
	"github.com/pkg/errors"

	"etix-tv-manager/api/model"
)

const (
	s3location = "us-east-1"
	bucketName = "media"
)

// S3 represents the service responsible for managing S3 instance.
type S3 struct {
	client *minio.Client
}

// NewS3 creates a new S3 service for S3.
func NewS3(client *minio.Client) *S3 {
	return &S3{client: client}
}

// NewS3Client is used to initialize the minio client.
// It will connect the app to the minio server or return an error.
func NewS3Client(endpoint, accessKeyID, secretAccessKey string, ssl bool) (*minio.Client, error) {
	var client *minio.Client
	var found bool
	var err error

	// Create s3 client.
	client, err = minio.New(endpoint, accessKeyID, secretAccessKey, ssl)
	if err != nil {
		return nil, errors.Wrap(err, "S3 client creation: connection failed")
	}

	// Create app bucket.
	if found, err = client.BucketExists(bucketName); !found && err == nil {
		if err = client.MakeBucket(bucketName, s3location); err != nil {
			err = errors.Wrap(err, "S3 client creation: can't create bucket")
		}
	} else if err != nil {
		err = errors.Wrap(err, "S3 client creation: can't find bucket")
	}
	return client, err
}

// ListObjects return all objects in a folder.
func (s *S3) ListObjects(folder string) ([]model.Media, error) {
	doneCh := make(chan struct{})
	defer close(doneCh)

	mediaList := []model.Media{}

	objectCh := s.client.ListObjectsV2(bucketName, folder, true, doneCh)
	for object := range objectCh {
		if object.Err != nil {
			return nil, errors.Wrap(object.Err, "S3 List object failed")
		}
		mediaList = append(mediaList, model.Media{Name: object.Key, Size: object.Size, LastModified: object.LastModified})
	}
	return mediaList, nil
}

// NOTE: For now GetObject return a minio object.
// A DTO custom type will be created to abstract the minio one.

// GetObject return an object described by its name.
func (s *S3) GetObject(name string) (*minio.Object, error) {
	object, err := s.client.GetObject(bucketName, name)
	if err != nil {
		return nil, errors.Wrapf(err, "S3 Get object of [%s] failed", name)
	}
	return object, nil
}

// Upload is used to upload a file.
func (s *S3) Upload(name string, file io.Reader) error {
	_, err := s.client.PutObject(bucketName, name, file, "application/octet-stream")
	if err != nil {
		return errors.Wrapf(err, "S3 Upload of [%s] failed", name)
	}
	return nil
}

// Remove is used remove a file.
func (s *S3) Remove(name string) error {
	err := s.client.RemoveObject(bucketName, name)
	if err != nil {
		return errors.Wrapf(err, "S3 Remove of [%s] failed", name)
	}
	return nil
}

// Rename is used to rename a file.
func (s *S3) Rename(name, newName string) error {
	src := minio.NewSourceInfo(bucketName, name, nil)
	dst, err := minio.NewDestinationInfo(bucketName, newName, nil, nil)
	if err != nil {
		return errors.Wrapf(err, "S3 Rename of [%s] failed", name)
	}

	err = s.client.CopyObject(dst, src)
	if err != nil {
		return errors.Wrapf(err, "S3 Rename of [%s] failed", name)
	}
	return s.Remove(name)
}
