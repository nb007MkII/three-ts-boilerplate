import { Font } from "three/examples/jsm/loaders/FontLoader";

export const FontNameHelvetikerBold = "fonts/helvetiker_bold.typeface.json";

let _modalTitleFont: Font | undefined;

export function SetModalTitleFont(font: Font) {
	_modalTitleFont = font;
}

export function GetModalTitleFont(): Font | undefined {
	return _modalTitleFont;
}