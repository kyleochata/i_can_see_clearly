package main

import (
	"algorithm_visualizer/hello"
	"algorithm_visualizer/sorting_alg"
	"log"
	"net/http"
)

func main() {
	hello.Hello()
	http.HandleFunc("/api/sort", sorting_alg.SortHandler)
	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
