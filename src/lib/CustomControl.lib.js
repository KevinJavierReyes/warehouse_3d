import * as THREE from "three";
import {PointerLockControls} from "./../../node_modules/three/examples/jsm/controls/PointerLockControls";


function isClickRight(e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
    return isRightMB;
}

export class CustomControl {
    
    constructor (element, camera, renderer) {
        //
        this.element = element;
        this.camera = camera;
        this.renderer = renderer;
        
        // Move
        this.startTime = Date.now();
        this.moveSpeed = 50;
        this.xdir = 0;
        this.zdir = 0;
        this.ydir = 0;
        this.maxY = 1000;
        this.minY = 10;

        // Control
        this.control = new PointerLockControls( camera, renderer.domElement);

        // Events
        this.element.addEventListener("mousedown", (event) => {
            if (isClickRight(event)) {
                this.control.lock();
            }
        });
        this.element.addEventListener("mouseup", (event) => {
            if (isClickRight(event)) {
                this.control.unlock();
            }
        });
        this.element.addEventListener("wheel", (event) => this.zoom(event), false);
        document.addEventListener("keydown", (event) => {
            // event.preventDefault();
            switch(event.key) {
                case " ":
                    this.ydir = 1;
                    break;
                case "Alt":
                    this.ydir = -1;
                    break;
                case "ArrowDown":
                case "s":
                    this.zdir = -1;
                    break;
                case "ArrowUp":
                case "w":
                    this.zdir = 1;
                    break;
                case "ArrowLeft":
                case "a":
                    this.xdir = -1;
                    break;
                case "ArrowRight":
                case "d":
                    this.xdir = 1;
                    break;
            }
        });
        document.addEventListener("keyup", (event) => {
            // event.preventDefault();
            // this.xdir = 0;
            // this.ydir = 0;
            // this.zdir = 0;
            switch(event.key) {
                case " ":
                    this.ydir = 0;
                    break;
                case "Alt":
                    this.ydir = 0;
                    break;
                case "ArrowDown":
                case "s":
                    this.zdir = 0;
                    break;
                case "ArrowUp":
                case "w":
                    this.zdir = 0;
                    break;
                case "ArrowLeft":
                case "a":
                    this.xdir = 0;
                    break;
                case "ArrowRight":
                case "d":
                    this.xdir = 0;
                    break;
            }
        });
    }

    zoom(event) {
        const fovMAX = 160;
        const fovMIN = 5;
        let fov = this.camera.fov - (event.wheelDeltaY * 0.05);
        fov = Math.max( Math.min( fov, fovMAX ), fovMIN );
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }

    animateMovements() {
        const endTime = Date.now();
        if (this.xdir != 0 ||
            this.zdir != 0 ||
            this.ydir != 0) {
            const delta = (endTime - this.startTime) / 1000;
            const xdis = this.xdir * this.moveSpeed * delta;
            const zdis = this.zdir * this.moveSpeed * delta;
            const ydis = this.ydir * this.moveSpeed * delta;
            this.control.moveRight(xdis);
            this.control.moveForward(zdis);
            const newYPosition = this.camera.position.y + ydis;
            this.camera.position.y = newYPosition < this.minY ? this.minY : newYPosition > this.maxY ? this.maxY : newYPosition;
        } 
        this.startTime = endTime;
    }

    animate() {
        this.animateMovements();
    }
}
