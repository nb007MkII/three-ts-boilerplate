import {
	Mesh,
	BoxGeometry,
	MeshLambertMaterial,
	Object3D
} from "three";
import { DiagramItem } from "./diagramitem";
import { DiagramItemOptions } from "./diagramitemoptions";

export class Software extends DiagramItem {
	constructor(options?: DiagramItemOptions) {
		const cubeGeo = new BoxGeometry(20, 20, 20, 1, 1, 1);
		const cubeMat = new MeshLambertMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
		const cubeMesh = new Mesh(cubeGeo, cubeMat);
		const preferredLabelTextMargin = 2;

		if (options) {
			if (!options.labelTextMargin) {
				options.labelTextMargin = preferredLabelTextMargin;
			}
		}
		else {
			options = new DiagramItemOptions();
			options.labelTextMargin = preferredLabelTextMargin;
		}

		super(cubeMesh, options);
	}
}