import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    Vector3,
    Vector2,
    Raycaster,
    Mesh,
    Shape,
    MeshBasicMaterial,
    ShapeGeometry,
    BoxGeometry,
    DoubleSide,
    MeshNormalMaterial
} from "three";
import { Modal } from "./modal/modal";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader";
import { ModalOptions } from "./modal/modaloptions";
import { SetModalTitleFont, FontNameHelvetikerBold, } from "./constants";

export class App {

    private readonly _renderer: WebGLRenderer;
    private readonly _scene: Scene;
    private readonly _camera: PerspectiveCamera;
    private readonly _controls: OrbitControls;
    private _activeModal: Modal | undefined;
    private readonly _raycaster: Raycaster;
    private _mouseDownMoveStartPosition: Vector2 | undefined;
    private readonly _defaultCameraPosition: Vector3;

    public readonly DefaultModalOptions: ModalOptions = new ModalOptions(0, 0);

    constructor(canvasElem: HTMLCanvasElement, width: number, height: number) {
        // set up misc stuff
        this._raycaster = new Raycaster();

        const fontLoader = new FontLoader();
        fontLoader.load(FontNameHelvetikerBold, (font: Font) => {
            SetModalTitleFont(font);
        });

        // set up up scene/camera/controls/etc
        this._scene = new Scene();
        //this._scene.background = new TextureLoader().load("./assets/textures/background.png");

        this._defaultCameraPosition = new Vector3(0, 30, 30);

        this._camera = new PerspectiveCamera(50, width / height, 1, 1000);
        this._camera.position.copy(this._defaultCameraPosition);
        this._camera.lookAt(0, 0, 0);

        this._renderer = new WebGLRenderer({
            antialias: true,
            canvas: canvasElem
        });

        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableDamping = true;
        this._controls.target.set(0, 0, 0);
        this._controls.update();

        // add cube
        const cubeGeo = new BoxGeometry(2, 2, 2, 1, 1, 1);
        const cubeMat = new MeshNormalMaterial({ side: DoubleSide });
        const cubeMesh = new Mesh(cubeGeo, cubeMat);

        cubeMesh.position.set(0, 0, 0);
        this._scene.add(cubeMesh);


        // get going
        this.resize(width, height);
        this.render();

        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    get Scene(): Scene { return this._scene; }

    private render() {
        this._renderer.render(this._scene, this._camera);

        requestAnimationFrame(() => this.render());
    };

    public resize(width: number, height: number) {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onMouseDown(event: MouseEvent) {
        this._mouseDownMoveStartPosition = this.getMouseCurrentPosition(event);
    }

    private onMouseMove(event: MouseEvent) {
        //
    }

    private onMouseUp(event: MouseEvent) {
        if (this._mouseDownMoveStartPosition) {
            const mouseDownMoveEndPosition = this.getMouseCurrentPosition(event);
            const dx = mouseDownMoveEndPosition.x - this._mouseDownMoveStartPosition.x;
            const dy = mouseDownMoveEndPosition.y - this._mouseDownMoveStartPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= .005) {
                // no drag
            }
        }
    }

    public ShowModal(modal: Modal) {
        if (this._activeModal) {
            // destroy existing modal
            this._scene.remove(this._activeModal);
        }

        this._activeModal = modal;

        // move the modal directly in front of the camera
        const modalPlaceholderShape = new Shape();
        modalPlaceholderShape.moveTo(0, 0);
        modalPlaceholderShape.lineTo(modal.ModalWidth, 0);
        modalPlaceholderShape.lineTo(modal.ModalWidth, modal.ModalHeight);
        modalPlaceholderShape.lineTo(0, modal.ModalHeight);
        modalPlaceholderShape.lineTo(0, 0);

        const modalPlaceholderGeo = new ShapeGeometry(modalPlaceholderShape);
        const modalPlaceholderMat = new MeshBasicMaterial();
        const modalPlaceholderMesh = new Mesh(modalPlaceholderGeo, modalPlaceholderMat);

        modalPlaceholderMesh.position.copy(this._camera.position);
        modalPlaceholderMesh.rotation.copy(this._camera.rotation);
        modalPlaceholderMesh.updateMatrix();
        modalPlaceholderMesh.translateX(-(modal.ModalWidth / 2));
        modalPlaceholderMesh.translateY(-(modal.ModalHeight / 2));
        modalPlaceholderMesh.translateZ(-(Math.sqrt(Math.pow(modal.ModalWidth, 2) + Math.pow(modal.ModalHeight, 2))));

        modal.position.copy(modalPlaceholderMesh.position);
        modal.rotation.copy(modalPlaceholderMesh.rotation);
        modalPlaceholderMesh.translateZ(1);
        modal.updateMatrix();

        // add modal to scene
        this._scene.add(modal);

        // disable camera movement (simulating a 2d page)
        // this._controls.enableRotate = false;
        // this._controls.enablePan = false;
        // this._controls.enableZoom = false;
    }

    private getMouseCurrentPosition(event: MouseEvent): Vector2 {
        return new Vector2((
            (event.clientX / this._renderer.domElement.clientWidth) * 2 - 1),
            -((event.clientY / this._renderer.domElement.clientHeight) * 2 - 1)
        );
    }

    private onKeyUp(event: KeyboardEvent) {
        //
    }
}