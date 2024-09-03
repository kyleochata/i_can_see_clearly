package sorting_alg

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type SortRequest struct {
	Algorithm string `json:"algorithm"`
	Data      []int  `json:"data"`
}

type SortingAlgorithm interface {
	Sort(data []int) ([][]int, int, []string, [][]int, [][]int) // Added lineNumbers return value
}

func SortHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req SortRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	algo, err := GetSortingAlgorithmByName(req.Algorithm)
	if err != nil {
		http.Error(w, "Error selecting algorithm", http.StatusBadRequest)
		return
	}

	var states [][]int
	var iterationCount int
	var comments []string
	var comparedIndexArr [][]int
	var lineNumbers [][]int
	switch a := algo.(type) {
	case BubbleSort:
		states, iterationCount, comments, comparedIndexArr, lineNumbers = a.Sort(req.Data)
	//case QuickSort:
	//Cstates = a.Sort(req.Data)
	default:
		http.Error(w, "Unknown sorting algorithm", http.StatusBadRequest)
		return
	}

	response := map[string]interface{}{
		"states":         states,
		"iterationCount": iterationCount,
		"comments":       comments,
		"comparedIndex":  comparedIndexArr,
		"lineNumbers":    lineNumbers, // Include lineNumbers in the response
	}

	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func GetSortingAlgorithmByName(name string) (SortingAlgorithm, error) {
	switch name {
	case "bubble":
		return BubbleSort{}, nil
	//case "quick":
	//return QuickSort{}, nil
	default:
		return nil, fmt.Errorf("unknown algorithm: %s", name)
	}
}
