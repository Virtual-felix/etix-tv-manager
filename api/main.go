package main

import (
	"fmt"
	"log"
	"os"
	"strings"

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

	// LDAP client
	domainName := strings.Split(os.Getenv("LDAP_DOMAIN"), ".")
	binddn := fmt.Sprintf("dc=%s,dc=%s", strings.Join(domainName[:len(domainName)-1], "."), domainName[len(domainName)-1])
	lbinddn := fmt.Sprintf("cn=%s,%s", os.Getenv("LDAP_READONLY_USER_USERNAME"), binddn)
	ldapClient := service.NewLdap(os.Getenv("LDAP_URL"), os.Getenv("LDAP_PORT"), binddn, lbinddn, os.Getenv("LDAP_READONLY_USER_PASSWORD"))
	errLdap := ldapClient.BindReadOnlyAccount()
	if errLdap != nil {
		log.Println(errLdap)
		return
	}

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
	authController := controller.NewAuth(ldapClient)

	e := echo.New()

	// API configuration
	e.Use(middleware.CORS())

	r := e.Group("/restricted")
	r.Use(middleware.JWT([]byte("secret")))

	// Routes descriptions
	r.POST("/upload", mediaController.Upload)
	r.GET("/media/list/", mediaController.List)
	r.GET("/media/list/:folder", mediaController.List)
	r.PUT("/media", mediaController.Remove)
	r.PUT("/media/rename", mediaController.Rename)

	r.POST("/timeline", timelineController.Create)
	r.PUT("/timeline/:id", timelineController.Update)
	r.DELETE("/timeline/:id", timelineController.Delete)
	r.GET("/timeline", timelineController.List)

	r.POST("/timeline/:tid/item", timelineController.CreateItems)
	r.GET("/timeline/:tid/items", timelineController.ListItems)
	r.PUT("/timeline/item/:id", timelineController.UpdateItem)
	r.DELETE("/timeline/item/:id", timelineController.DeleteItem)

	r.GET("/televisions", televisionController.List)
	r.POST("/television", televisionController.Create)
	r.PUT("/television/:id", televisionController.Update)
	r.DELETE("/television/:id", televisionController.Delete)

	r.GET("/television/groups", televisionController.ListGroup)
	r.POST("/television/group", televisionController.CreateGroup)

	r.GET("/planifications/:id", planificationController.List)
	r.POST("/planification", planificationController.Create)
	r.PUT("/planification/:id", planificationController.Update)
	r.DELETE("/planification/:id", planificationController.Delete)

	e.POST("/login", authController.Login)

	// Routes descriptions for Viewer
	e.GET("/planifications/tv", planificationController.ListForTv)
	e.GET("/timeline/:id", timelineController.FindOne)
	e.GET("/timeline/:tid/items", timelineController.ListItems)

	// Run
	e.Logger.Fatal(e.Start(":" + PORT))
}
