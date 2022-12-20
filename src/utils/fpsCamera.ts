import { Quaternion, Vector3 } from 'three';

const PLAYER_HEIGHT = 2;

interface IcurrentInputController {
    leftButton: boolean;
    rightButton: boolean;
    mouseX: number;
    mouseY: number;
    mouseXDelta: number;
    mouseYDelta: number;
}

function clamp(x: any, a: any, b: any) {
    return Math.min(Math.max(x, a), b);
}

let pX: any = null;
let pY: any = null;

const SPEED = 5;
const HEAD_BANG_LEVEL = 0.2;

export class InputController {
    public current_: IcurrentInputController | undefined;
    public previous_: any;
    public keys_: any;
    public previousKeys_: any; //TODO: not used
    public domElement: any;
    public diffCursor: any;

    constructor() {
        this.initialize_();
    }
    initialize_() {
        this.current_ = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0,
        };
        this.previous_ = null;
        this.keys_ = {};
        this.previousKeys_ = {};
        this.domElement = document;
        this.diffCursor = [0, 0];

        this.domElement.addEventListener('mousedown', (event: MouseEvent) =>
            this.onMouseDown_(event)
        );
        this.domElement.addEventListener('mouseup', (event: MouseEvent) => this.onMouseUp_(event));
        this.domElement.addEventListener('mousemove', (event: MouseEvent) =>
            this.onMouseMove_(event)
        );
        this.domElement.addEventListener('keydown', (event: KeyboardEvent) =>
            this.onKeyDown_(event)
        );
        this.domElement.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyUp_(event));
    }

    onMouseDown_(event: MouseEvent) {
        const { button } = event;
        switch (button) {
            case 0:
                this.current_!.leftButton = true;
                break;
            case 1:
                this.current_!.rightButton = true;
                break;
        }
    }
    onMouseUp_(event: MouseEvent) {
        const { button } = event;
        switch (button) {
            case 0:
                this.current_!.leftButton = false;
                break;
            case 1:
                this.current_!.rightButton = false;
                break;
        }
    }
    onMouseMove_(event: MouseEvent) {
        const { movementX, movementY } = event;

        const middleX = window.innerWidth / 2;
        const middleY = window.innerHeight / 2;

        if (pX === null && pY === null) {
            pX = middleX; // event.pageX - offsetX;
            pY = middleY; // event.pageY - offsetY;
        }

        pX += movementX * 0.5;
        pY += movementY * 0.5;

        this.current_!.mouseX = pX; //- window.innerWidth / 2;
        this.current_!.mouseY = pY; //- window.innerHeight / 2;

        if (this.previous_ === null) {
            this.previous_ = { ...this.current_ };
        }
        this.current_!.mouseXDelta = this.current_!.mouseX - this.previous_.mouseX;
        this.current_!.mouseYDelta = this.current_!.mouseY - this.previous_.mouseY;
    }

    onKeyDown_(event: KeyboardEvent) {
        const { code } = event;
        this.keys_[code] = true;
    }
    onKeyUp_(event: KeyboardEvent) {
        const { code } = event;
        this.keys_[code] = false;
    }
    update() {
        this.previous_ = { ...this.current_ };
    }
}

export class FirstPersonCamera {
    public camera_: any;
    public input_: InputController;
    public rotation_: Quaternion;
    public phi_: number;
    public theta_: number;
    public headBobActive_: boolean;
    public headBobTimer_: number;
    public position: any;
    public playerApi_: any;
    public soundEffect: any;
    public soundPlaying: boolean;
    // public diffCursor: any

    constructor(camera?: any, playerApi_?: any) {
        this.camera_ = camera;
        this.input_ = new InputController();
        this.rotation_ = new Quaternion();
        this.phi_ = 0;
        this.theta_ = 0;
        this.headBobActive_ = false;
        this.headBobTimer_ = 0;
        this.playerApi_ = playerApi_;
        this.soundEffect = {
            walk: null,
        };
        this.soundPlaying = false;
    }
    update(diff: Array<number> | boolean) {
        if (!document.pointerLockElement) return;
        this.input_.diffCursor = diff;
        this.updateRotation_();
        this.updateCamera_();
        this.updateVelocity_();
        this.updateHeadBob_();
    }

    updateVelocity_() {
        const { KeyS, KeyW, KeyA, KeyD } = this.input_.keys_;
        const UP = KeyW;
        const DOWN = KeyS;
        const RIGHT = KeyD;
        const LEFT = KeyA;

        const direction = new Vector3();
        const frontVector = new Vector3(0, 0, (DOWN ? 1 : 0) - (UP ? 1 : 0));
        const sideVector = new Vector3((LEFT ? 1 : 0) - (RIGHT ? 1 : 0), 0, 0);

        this.headBobActive_ = DOWN || UP || LEFT || RIGHT;

        // if (this.headBobActive_ && !this.soundPlaying) {
        // this.soundEffect.walk.play();
        // this.soundPlaying = true;
        // }
        // if (!this.headBobActive_) {
        // this.soundEffect.walk.pause();
        // this.soundEffect.walk._progress = 0;
        // this.soundPlaying = false;
        // }

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(this.camera_.rotation);

        this.playerApi_.velocity.set(direction.x, 0, direction.z);
    }
    updateHeadBob_() {
        if (this.headBobActive_) {
            const wavelength = Math.PI;
            const nextStep = 1 + Math.floor(((this.headBobTimer_ + 0.00001) * 10) / wavelength);
            const nextStepTime = (nextStep * wavelength) / 10;
            this.headBobTimer_ = Math.min(this.headBobTimer_ + 0.03, nextStepTime);

            if (this.headBobTimer_ === nextStepTime) {
                this.headBobActive_ = false;
            }
        }
    }
    updateRotation_() {
        if (this.input_.previous_?.mouseX !== this.input_.current_?.mouseX) {
            const xh = this.input_.current_!.mouseXDelta / window.innerWidth;
            const yh = this.input_.current_!.mouseYDelta / window.innerHeight;

            this.phi_ += -xh * 5;
            this.theta_ = clamp(this.theta_ + -yh * 5, -Math.PI / 3, Math.PI / 3);

            const qx = new Quaternion();
            qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi_);
            const qz = new Quaternion();
            qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta_);

            const q = new Quaternion();
            q.multiply(qx);
            q.multiply(qz);

            this.rotation_.copy(q);
            this.input_.update();
        }
    }

    updateCamera_() {
        this.camera_.position.set(
            this.camera_.position[0],
            PLAYER_HEIGHT + HEAD_BANG_LEVEL * Math.sin(this.headBobTimer_ * 10) * 0.5,
            this.camera_.position[2]
        );
        this.camera_.quaternion.copy(this.rotation_);
    }
}
