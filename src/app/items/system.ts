import {
	Mesh,
	BoxGeometry,
	MeshLambertMaterial,
	Object3D,
	EdgesGeometry,
	LineBasicMaterial,
	LineSegments
} from "three";
import { DiagramItem } from "./diagramitem";
import { DiagramItemOptions } from "./diagramitemoptions";

export class System extends DiagramItem {
	constructor(options?: DiagramItemOptions) {
		const diagramObjects: Array<Object3D> = [];

		const cubeGeo = new BoxGeometry(20, 20, 20, 1, 1, 1);
		const cubeMat = new MeshLambertMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
		const cubeMesh = new Mesh(cubeGeo, cubeMat);

		diagramObjects.push(cubeMesh);

		const edgeGeo = new EdgesGeometry(cubeGeo);
		const edgeMat = new LineBasicMaterial({ color: 0x0000ee, linewidth: 3 });
		const edges = new LineSegments(edgeGeo, edgeMat);

		diagramObjects.push(edges);

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

		super(cubeMesh, options, diagramObjects);
	}
}