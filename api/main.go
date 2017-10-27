package main

import (
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"etix-tv-manager/api/controller"
	"etix-tv-manager/api/model"
	"etix-tv-manager/api/repository"
	"etix-tv-manager/api/service"
)

func main() {
	// Database client
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local",
		os.Getenv("DATABASE_USER"),
		os.Getenv("DATABASE_PASSWORD"),
		os.Getenv("DATABASE_URL"),
		os.Getenv("DATABASE_PORT"),
		os.Getenv("DATABASE_NAME"),
	)
	db, errDB := gorm.Open("mysql", dsn)
	if errDB != nil {
		log.Println(errDB)
		return
	}
	defer db.Close()

	// S3 client
	s3sn := fmt.Sprintf("%s:%s", os.Getenv("S3_URL"), os.Getenv("S3_PORT"))
	s3Client, errS3 := service.NewS3Client(s3sn, os.Getenv("S3_ACCESS_KEY"), os.Getenv("S3_SECRET_KEY"), false)
	if errS3 != nil {
		log.Println(errS3)
		return
	}
	log.Println("LDAP connected")

	// DB migration
	db.AutoMigrate(&model.Timeline{})
	db.AutoMigrate(&model.TimelineItem{})
	db.AutoMigrate(&model.Television{})
	db.AutoMigrate(&model.GroupTelevision{})
	db.AutoMigrate(&model.Planification{})

	// initialize controllers
	timelineRepo := repository.NewORMTimelineRepository(db)
	timelineItemRepo := repository.NewORMTimelineItemRepository(db)
	televisionRepo := repository.NewORMTelevisionRepository(db)
	groupTelevisionRepo := repository.NewORMGroupTelevisionRepository(db)
	planificationRepo := repository.NewORMPlanificationRepository(db)

	s3Service := service.NewS3(s3Client)
	timelineService := service.NewTimeline(timelineRepo, timelineItemRepo)
	televisionService := service.NewTelevision(televisionRepo, groupTelevisionRepo)
	planificationService := service.NewPlanification(planificationRepo)

	mediaController := controller.NewMedias(s3Service)
	timelineController := controller.NewTimeline(timelineService)
	televisionController := controller.NewTelevision(televisionService)
	planificationController := controller.NewPlanification(planificationService, televisionService)

	e := echo.New()
	// API configuration
	e.Use(middleware.CORS())

	// Routes descriptions
	e.POST("/upload", mediaController.Upload)
	e.GET("/media/list/", mediaController.List)
	e.GET("/media/list/:folder", mediaController.List)
	e.PUT("/media", mediaController.Remove)
	e.PUT("/media/rename", mediaController.Rename)

	e.POST("/timeline", timelineController.Create)
	e.GET("/timeline/:id", timelineController.FindOne)
	e.PUT("/timeline/:id", timelineController.Update)
	e.DELETE("/timeline/:id", timelineController.Delete)
	e.GET("/timeline", timelineController.List)

	e.POST("/timeline/:tid/item", timelineController.CreateItems)
	e.GET("/timeline/:tid/items", timelineController.ListItems)
	e.PUT("/timeline/item/:id", timelineController.UpdateItem)
	e.DELETE("/timeline/item/:id", timelineController.DeleteItem)

	e.GET("/televisions", televisionController.List)
	e.POST("/television", televisionController.Create)
	e.PUT("/television/:id", televisionController.Update)
	e.DELETE("/television/:id", televisionController.Delete)

	e.GET("/television/groups", televisionController.ListGroup)
	e.POST("/television/group", televisionController.CreateGroup)

	e.GET("/planifications/:id", planificationController.List)
	e.GET("/planifications/tv", planificationController.ListForTv)
	e.POST("/planification", planificationController.Create)
	e.PUT("/planification/:id", planificationController.Update)
	e.DELETE("/planification/:id", planificationController.Delete)

	// Run
	e.Logger.Fatal(e.Start(":" + PORT))
}
