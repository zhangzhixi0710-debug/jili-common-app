package happy_taxi_config

import (
	frame_enum "jlht/frame/enum"
	frame_type "jlht/frame/type"
)

// 卡片配置
var CardConfig = &frame_type.Config_CardGroup{
	// 达到一定数量就可以消除
	WinType: frame_enum.GameTypes.NumGame,
	// 普通符号赢钱除数
	WinLineDes: 9,
	// 符号赔付表
	Cards: map[int]frame_type.Config_CardItem{
		0: {
			Score:       map[int]float64{3: 3, 4: 18, 5: 45},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "车钥匙",
		},
		1: {
			Score:       map[int]float64{3: 3, 4: 18, 5: 45},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "轮胎",
		},
		2: {
			Score:       map[int]float64{3: 6, 4: 54, 5: 180},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "色子",
		},
		3: {
			Score:       map[int]float64{3: 6, 4: 54, 5: 180},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "TAXI",
		},
		4: {
			Score:       map[int]float64{3: 12, 4: 90, 5: 270},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "汽油桶",
		},
		5: {
			Score:       map[int]float64{3: 12, 4: 90, 5: 270},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "加油器",
		},
		6: {
			Score:       map[int]float64{3: 21, 4: 180, 5: 900},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "三轮车",
		},
		7: {
			Score:       map[int]float64{2: 6, 3: 21, 4: 180, 5: 900},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "蓝车",
		},
		8: {
			Score:       map[int]float64{2: 6, 3: 27, 4: 270, 5: 4500},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "绿车",
		},
		9: {
			Score:       map[int]float64{2: 9, 3: 45, 4: 450, 5: 9000},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "司机",
		},
		10: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.WildCard,
			Description: "wild",
		},
		12: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.ScatterCard,
			Description: "scatter",
		},
		13: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.KeepCard,
			Description: "劳斯莱斯",
		},
		14: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.KeepCard,
			Description: "加分司机",
		},
	},
	// 赢钱线
	WinLine: []*frame_type.WinLineItem{
		// 1~9
		{ID: 1, Nums: []int{1, 1, 1, 1, 1}},
		{ID: 2, Nums: []int{0, 0, 0, 0, 0}},
		{ID: 3, Nums: []int{2, 2, 2, 2, 2}},
		{ID: 4, Nums: []int{0, 1, 2, 1, 0}},
		{ID: 5, Nums: []int{2, 1, 0, 1, 2}},
		{ID: 6, Nums: []int{0, 0, 1, 0, 0}},
		{ID: 7, Nums: []int{2, 2, 1, 2, 2}},
		{ID: 8, Nums: []int{1, 0, 0, 0, 1}},
		{ID: 9, Nums: []int{1, 2, 2, 2, 1}},
	},
}
