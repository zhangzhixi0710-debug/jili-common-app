package buffalo_slot_2_config

import (
	frame_enum "jlbs2/frame/enum"
	frame_type "jlbs2/frame/type"
)

// 卡片配置
var CardConfig = &frame_type.Config_CardGroup{
	WinType: frame_enum.GameTypes.WayGame,
	// 普通符号赢钱除数
	WinLineDes: 1,
	// 符号赔付表
	Cards: map[int]frame_type.Config_CardItem{
		0: {
			Score:       map[int]float64{3: 0.2, 4: 0.4, 5: 1},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "9",
		},
		1: {
			Score:       map[int]float64{3: 0.2, 4: 0.4, 5: 1},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "10",
		},
		2: {
			Score:       map[int]float64{3: 0.3, 4: 0.6, 5: 1.5},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "J",
		},
		3: {
			Score:       map[int]float64{3: 0.3, 4: 0.6, 5: 1.5},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "Q",
		},
		4: {
			Score:       map[int]float64{3: 0.4, 4: 1, 5: 2},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "K",
		},
		5: {
			Score:       map[int]float64{3: 0.4, 4: 1, 5: 2},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "A",
		},
		6: {
			Score:       map[int]float64{3: 1, 4: 2, 5: 3},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "鹿",
		},
		7: {
			Score:       map[int]float64{3: 1, 4: 2, 5: 3},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "狼",
		},
		8: {
			Score:       map[int]float64{3: 1.5, 4: 2.5, 5: 4},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "熊",
		},
		9: {
			Score:       map[int]float64{3: 1.5, 4: 2.5, 5: 4},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "鹰",
		},
		10: {
			Score:       map[int]float64{2: 1, 3: 2, 4: 4, 5: 7.5},
			Type:        frame_enum.CardTypes.NormalCard,
			Description: "野牛-普通",
		},
		13: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.WildCard,
			Description: "wild",
		},
		14: {
			Score:       map[int]float64{3: 1, 4: 5, 5: 10},
			Type:        frame_enum.CardTypes.ScatterCard,
			Description: "scatter",
		},
		15: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.ArrowCard,
			Description: "紫色箭头",
		},
		16: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.ArrowCard,
			Description: "金色箭头",
		},
		17: {
			Score:       map[int]float64{},
			Type:        frame_enum.CardTypes.FreeAddCard,
			Description: "顶部符号-进入免费",
		},
	},
}
