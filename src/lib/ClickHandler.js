import * as THREE from "three";

export class ClickHandler {
    
    objects = {};
    
    constructor(container, camera, renderer) {
        this.container = container;
        this.renderer = renderer;
        this.camera = camera;
        this.container.onclick = (event) => {
            this.click(event);
        }; 
    }

    onClick(callback) {
        this.callback = callback;
    }

    click(event) {
        event.preventDefault();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, this.camera );

        const intersects = raycaster.intersectObjects( Object.values(this.objects) ); 

        if ( intersects.length > 0 ) {
            const objectClicked = intersects[0].object;
            if (objectClicked.hasOwnProperty("callback")) {
                objectClicked.callback();
            } else if (this.callback) {
                this.callback(objectClicked);
            }
        }
    }

    addObject(object) {
        this.objects[`${object.id}`] = object;
    }

    removeObject(object) {
        delete this.objects[`${object.id}`];
    }

}