package sorting_alg

type QuickSort struct{}

func (QuickSort) Sort(data []int) [][]int {
	var states [][]int
	quickSort(data, 0, len(data)-1, &states)
	return states
}

func quickSort(data []int, low, high int, states *[][]int) {
	if low < high {
		p := partition(data, low, high)
		quickSort(data, low, p-1, states)
		quickSort(data, p+1, high, states)
	}
}

func partition(data []int, low, high int) int {
	pivot := data[high]
	i := low - 1
	for j := low; j < high; j++ {
		if data[j] < pivot {
			i++
			data[i], data[j] = data[j], data[i]
		}
	}
	data[i+1], data[high] = data[high], data[i+1]
	return i + 1
}
