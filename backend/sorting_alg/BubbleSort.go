package sorting_alg

import "fmt"

type BubbleSort struct{}

func (BubbleSort) Sort(data []int) ([][]int, int, []string) {
	var states [][]int
	var comments []string
	n := len(data)
	dataCopy := make([]int, len(data))
	copy(dataCopy, data)

	for i := 0; i < n; i++ {
		for j := 0; j < n-1-i; j++ {
			if dataCopy[j] > dataCopy[j+1] {
				dataCopy[j], dataCopy[j+1] = dataCopy[j+1], dataCopy[j]
				stateCopy := make([]int, len(dataCopy))
				copy(stateCopy, dataCopy)
				states = append(states, stateCopy)
				comments = append(comments, fmt.Sprintf("Comparing %d and %d: Move %d to index %d", dataCopy[j+1], dataCopy[j], dataCopy[j], j))
			} else {
				stateCopy := make([]int, len(dataCopy))
				copy(stateCopy, dataCopy)
				states = append(states, stateCopy)
				comments = append(comments, fmt.Sprintf("Comparing %d and %d: No move needed", dataCopy[j], dataCopy[j+1]))
			}
		}
	}
	return states, len(states), comments
}

// func (BubbleSort) Sort(data []int) ([][]int, int) {
// 	var states [][]int
// 	n := len(data)
// 	// Add initial state
// 	states = append(states, append([]int{}, data...))

// 	iterationCount := 0
// 	for i := 0; i < n; i++ {
// 		for j := 0; j < n-i-1; j++ {
// 			if data[j] > data[j+1] {
// 				data[j], data[j+1] = data[j+1], data[j]
// 			}
// 			// Capture state after each swap
// 			states = append(states, append([]int{}, data...))
// 			iterationCount++
// 		}
// 	}
// 	return states, iterationCount
// }
