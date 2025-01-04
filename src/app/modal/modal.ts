import {
	Group,
	Shape,
	ShapeGeometry,
	MeshBasicMaterial,
	Mesh,
	MeshPhongMaterial
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { ModalOptions } from "./modaloptions";
import { GetModalTitleFont } from "../constants";

export class Modal extends Group {
	private _modalOptions: ModalOptions;

	constructor(modalOptions: ModalOptions) {

		super();

		this._modalOptions = modalOptions;

		const menuRectShape = new Shape();
		menuRectShape.moveTo(0, 0);
		menuRectShape.lineTo(this._modalOptions.Width, 0);
		menuRectShape.lineTo(this._modalOptions.Width, this._modalOptions.Height);
		menuRectShape.lineTo(0, this._modalOptions.Height);
		menuRectShape.lineTo(0, 0);

		const menuRectGeo = new ShapeGeometry(menuRectShape);
		const menuRectMat = new MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: .5 })
		const menuRectMesh = new Mesh(menuRectGeo, menuRectMat);

		this.add(menuRectMesh);

		const modalTitleFont = GetModalTitleFont();

		if (modalTitleFont) {
			let titleText = "Menu";

			if (this._modalOptions?.TitleText) {
				titleText = this._modalOptions.TitleText;
			}

			const modalTitleTextGeo = new TextGeometry(titleText, {
				font: modalTitleFont,
				size: 0.4,
				height: 0,
				// curveSegments: 12,
				// bevelEnabled: true,
				// bevelThickness: 10,
				// bevelSize: 8,
				// bevelOffset: 0,
				// bevelSegments: 5
			});

			modalTitleTextGeo.computeBoundingBox();

			if (modalTitleTextGeo?.boundingBox) {
				const modalTitleTextWidth = (modalTitleTextGeo.boundingBox.max.x - modalTitleTextGeo.boundingBox.min.x);
				const modalTitleTextHeight = (modalTitleTextGeo.boundingBox.max.y - modalTitleTextGeo.boundingBox.min.y);
				const modalTitleTextMat = new MeshPhongMaterial({ color: 0xffffff, flatShading: true });
				const modalTitleTextMesh = new Mesh(modalTitleTextGeo, modalTitleTextMat);

				modalTitleTextMesh.position.x = ((this._modalOptions.Width / 2) - (modalTitleTextWidth / 2));
				modalTitleTextMesh.position.y = (this._modalOptions.Height - modalTitleTextHeight);
				modalTitleTextMesh.position.z = 0.01;

				this.add(modalTitleTextMesh);
			}
		}
	}

	get ModalWidth(): number { return this._modalOptions.Width; }

	get ModalHeight(): number { return this._modalOptions.Height; }

}