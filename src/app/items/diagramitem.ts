import {
	Mesh,
	Group,
	MeshPhongMaterial,
	Box3,
	Vector2,
	Vector3,
	Object3D,
	Camera
} from "three";
import { DiagramItemOptions } from "./diagramitemoptions";
import { GetModalTitleFont } from "../constants";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export class DiagramItem extends Group {
	private _labelText: string = "";
	private _labelTextMesh: Mesh | undefined;
	private _labelTextMeshDimensions: Vector3 | undefined;
	private _labelTextMargin: number = 0.5;
	private _objectContainingLabel: Object3D;

	constructor(objectContainingLabel: Object3D, options?: DiagramItemOptions) {

		super();

		this.add(objectContainingLabel);
		this._objectContainingLabel = objectContainingLabel;

		if (options) {
			if (options.labelText) {
				this._labelText = options.labelText;
			}

			if (options.labelTextMargin) {
				this._labelTextMargin = options.labelTextMargin;
			}
		}
	}

	get labelText() { return this._labelText; }

	set labelText(text: string | undefined) {
		if (text) {
			this._labelText = text;
		}
		else {
			this._labelText = "";
		}
	}

	public drawText() {
		const labelFont = GetModalTitleFont();

		if (labelFont
			&& this.labelText
			&& this.labelText.trim() != ""
			&& this._objectContainingLabel) {

			// get total size of item objects space used
			const objectContainingLabelBoundingBox = new Box3();

			objectContainingLabelBoundingBox.expandByObject(this._objectContainingLabel);

			const objectGroupBoxSize = objectContainingLabelBoundingBox.getSize(new Vector3())
			const allObjectsBoundingBoxCenter = objectContainingLabelBoundingBox.getCenter(new Vector3());

			// create text
			const labelTextMat = new MeshPhongMaterial({ color: 0xffffff, flatShading: true, transparent: false });
			const defaultFontSize: number = 40;
			let labelTextGeo = new TextGeometry(this.labelText.trim(), {
				font: labelFont,
				size: defaultFontSize,
				height: 0
			});

			// check text size
			labelTextGeo.computeBoundingBox();

			const labelTextMeshDimensions: Vector3 = new Vector3(
				(labelTextGeo.boundingBox!.max.x - labelTextGeo.boundingBox!.min.x),
				(labelTextGeo.boundingBox!.max.y - labelTextGeo.boundingBox!.min.y),
				(labelTextGeo.boundingBox!.max.z - labelTextGeo.boundingBox!.min.z));
			const labelReductionFactor = new Vector2();

			if (labelTextMeshDimensions.x > (objectGroupBoxSize.x - (this._labelTextMargin * 2))) {
				// label is too wide to fit in bounding box plus margin
				labelReductionFactor.x = ((objectGroupBoxSize.x - (this._labelTextMargin * 2)) / labelTextMeshDimensions.x);
			}

			if (labelTextMeshDimensions.y > (objectGroupBoxSize.y - this._labelTextMargin)) {
				// label is too tall to fit in bounding box plus margin
				labelReductionFactor.y = ((objectGroupBoxSize.y - (this._labelTextMargin * 2)) / labelTextMeshDimensions.y);
			}

			if (labelReductionFactor.x != 0 && labelReductionFactor.x != 0) {
				let useThisReductionFactor = labelReductionFactor.x;

				if (useThisReductionFactor == 0 || (labelReductionFactor.y != 0 && labelReductionFactor.y < labelReductionFactor.x)) {
					useThisReductionFactor = labelReductionFactor.y;
				}

				// resize text smaller to fit in bounding box
				labelTextGeo = new TextGeometry(this.labelText.trim(), {
					font: labelFont,
					size: (defaultFontSize * useThisReductionFactor),
					height: 0
				});

				labelTextGeo.computeBoundingBox();

				labelTextMeshDimensions.x = (labelTextGeo.boundingBox!.max.x - labelTextGeo.boundingBox!.min.x);
				labelTextMeshDimensions.y = (labelTextGeo.boundingBox!.max.y - labelTextGeo.boundingBox!.min.y);
				labelTextMeshDimensions.z = (labelTextGeo.boundingBox!.max.z - labelTextGeo.boundingBox!.min.z);
			}

			const labelTextMesh = new Mesh(labelTextGeo, labelTextMat);

			if (!this._labelTextMesh) {
				this.add(labelTextMesh);
			}

			this._labelTextMesh = labelTextMesh;

			this._labelTextMesh.position.x = (allObjectsBoundingBoxCenter.x - (labelTextMeshDimensions.x / 2));
			this._labelTextMesh.position.y = (allObjectsBoundingBoxCenter.y - (labelTextMeshDimensions.y / 2));
			this._labelTextMeshDimensions = labelTextMeshDimensions;
		}
	}

	public rotateLabelTextToFaceCamera(camera: Camera) {
		if (this._labelTextMesh && this._labelTextMeshDimensions) {
			this._labelTextMesh.rotation.copy(camera.rotation);
			this._labelTextMesh.updateMatrix();
		}
	}
}