package sorting_alg

import "fmt"

type BubbleSort struct{}

// func (BubbleSort) Sort(data []int) ([][]int, int, []string, [][]int) {
// 	var states [][]int
// 	var comments []string
// 	var compareIndices [][]int
// 	n := len(data)
// 	dataCopy := make([]int, len(data))
// 	copy(dataCopy, data)

// 	for i := 0; i < n; i++ {
// 		for j := 0; j < n-1-i; j++ {
// 			compareIndexPair := []int{j, j + 1} // Indices being compared
// 			if dataCopy[j] > dataCopy[j+1] {
// 				dataCopy[j], dataCopy[j+1] = dataCopy[j+1], dataCopy[j]
// 				comments = append(comments, fmt.Sprintf("Comparing %d and %d: Move %d to index %d", dataCopy[j+1], dataCopy[j], dataCopy[j], j))
// 			} else {
// 				comments = append(comments, fmt.Sprintf("Comparing %d and %d: No move needed", dataCopy[j], dataCopy[j+1]))
// 			}
// 			stateCopy := make([]int, len(dataCopy))
// 			copy(stateCopy, dataCopy)
// 			states = append(states, stateCopy)
// 			compareIndices = append(compareIndices, compareIndexPair)
// 		}
// 	}
// 	return states, len(states), comments, compareIndices
// }

func (BubbleSort) Sort(data []int) ([][]int, int, []string, [][]int, [][]int) {
	var states [][]int
	var comments []string
	var compareIndices [][]int
	var lineNumbers [][]int // Track line numbers to highlight
	n := len(data)
	dataCopy := make([]int, len(data))
	copy(dataCopy, data)

	for i := 0; i < n; i++ {
		for j := 0; j < n-1-i; j++ {
			compareIndexPair := []int{j, j + 1} // Indices being compared
			if dataCopy[j] > dataCopy[j+1] {
				dataCopy[j], dataCopy[j+1] = dataCopy[j+1], dataCopy[j]
				comments = append(comments, fmt.Sprintf("Comparing %d and %d: Move %d to index %d", dataCopy[j+1], dataCopy[j], dataCopy[j], j))
				lineNumbers = append(lineNumbers, []int{6, 7}) // Highlight swap line
			} else {
				comments = append(comments, fmt.Sprintf("Comparing %d and %d: No move needed", dataCopy[j], dataCopy[j+1]))
				lineNumbers = append(lineNumbers, []int{6}) // Highlight comparison line
			}
			stateCopy := make([]int, len(dataCopy))
			copy(stateCopy, dataCopy)
			states = append(states, stateCopy)
			compareIndices = append(compareIndices, compareIndexPair)
		}
	}
	lineNumbers = append(lineNumbers, []int{})
	return states, len(states), comments, compareIndices, lineNumbers
}
