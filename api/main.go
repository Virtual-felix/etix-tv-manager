package main

import (
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"

	"etix-tv-manager/api/controller"
	"etix-tv-manager/api/model"
	"etix-tv-manager/api/repository"
	"etix-tv-manager/api/service"
)

// NOTE: To use when making env var config.
// dsn := fmt.Sprintf(
// 	"%s:%s@db:3306/%s?charset=utf8&parseTime=True&loc=Local",
// 	os.Getenv("DB_USER"),
// 	os.Getenv("DB_PASS"),
// 	os.Getenv("DB_NAME"),
// )

func main() {
	// Database client
	db, errDB := gorm.Open("mysql", "gotest:gotest@tcp(mysqldb:3306)/gotest?charset=utf8&parseTime=True&loc=Local")
	if errDB != nil {
		log.Println(errDB)
		return
	}
	defer db.Close()

	// S3 client
	s3Client, errS3 := service.NewS3Client("172.19.0.1:9001", "HS4SFCA35UZHNW3YBHOT", "k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH", false)
	if errS3 != nil {
		log.Println(errS3)
		return
	}

	ldapClient := service.NewLdap("cn=tv,dc=tvetix,dc=com", "etix")
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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://127.0.0.1:3000"},
		AllowCredentials: true,
	}))

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
	r.GET("/planifications/tv", planificationController.ListForTv)
	r.POST("/planification", planificationController.Create)
	r.PUT("/planification/:id", planificationController.Update)
	r.DELETE("/planification/:id", planificationController.Delete)

	e.POST("/login", authController.Login)

	// Run
	e.Logger.Fatal(e.Start(":" + PORT))
}
