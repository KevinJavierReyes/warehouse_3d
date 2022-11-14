import * as THREE from "three";
import floor from "./../assets/floor.png";

export class WarehouseObject {


    static createFloor(width, height) {
        const geometry = new THREE.PlaneGeometry(width, height);
        geometry.rotateX(  Math.PI / 2);
        const texture = new THREE.TextureLoader().load(floor);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( parseInt(width/ 10), parseInt(height/ 10));
        const material = new THREE.MeshBasicMaterial({
            "side": THREE.DoubleSide,
            "color": new THREE.Color("#6A6A69"),
            "map": texture
        });
        const object = new THREE.Mesh(geometry, material);
        return object;
    }

    static createBox(width, height, depth, x, y, z, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({
            "color": new THREE.Color(color),
            "opacity": 0.5,
            "transparent": true
        });
        geometry.translate(x, y, z);
        const cubeObject = new THREE.Mesh(geometry, material);
        const geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry
        const mat = new THREE.LineBasicMaterial( { "color": new THREE.Color(color) } );
        const wireframe = new THREE.LineSegments( geo, mat );
        return {
            "object": cubeObject,
            "wireframe": wireframe
        };
    }

}