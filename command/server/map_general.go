package server

func getMap() mAp {

	data := mAp{
		Info: "map",
		Cols: 12,
		Rows: 12,
		Layout: []int{
			3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
			3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 1, 2, 2, 1, 2, 1, 3,
			3, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 3,
			3, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 3,
			3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
			3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
			3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3},
	}

	return data

}

func getRover() rover {
	data := rover{
		Index:    65,
		Rotation: 0,
	}
	return data
}
