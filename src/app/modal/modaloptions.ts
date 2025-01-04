export class ModalOptions {
	public Width: number;
	public Height: number;
	public TitleText: string;

	constructor(widthOrOptions: number | ModalOptions,
		height?: number,
		titleText?: string) {
		const fallbackTitleText = "Menu";

		if (typeof widthOrOptions === 'number') {
			this.Width = widthOrOptions;

			if (this.Width === 0) {
				this.Width = 10;
			}

			if (height) {
				this.Height = height;
			}
			else {
				this.Height = 10;
			}

			if (titleText) {
				this.TitleText = titleText;
			}
			else {
				this.TitleText = fallbackTitleText;
			}
		}
		else {
			this.Width = widthOrOptions.Width;
			this.Height = widthOrOptions.Height;

			if (widthOrOptions.TitleText) {
				this.TitleText = widthOrOptions.TitleText;
			}
			else {
				this.TitleText = fallbackTitleText;
			}
		}
	}
}