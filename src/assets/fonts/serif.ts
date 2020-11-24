import { Font } from './index'

export const serifFonts: string [] = [
	"Antic Slab",
	"Bitter",
	"Castro",
	"Crimson Text",
	"Lora",
	"Marriweather",
	"Noto Serif",
	"PT Serif",
	"Roboto Slab",
	"Zilla Slab",
] 

export default serifFonts.sort().map<Font>((f) => {return { family: f, fallback: "serif" }})