import { useEffect } from "react";
import * as THREE from "three";


import { CustomControl } from "./lib/CustomControl.lib";
import { ClickHandler } from "./lib/ClickHandler";
import { WarehouseObject } from "./lib/WarehouseObject";
import { WarehouseBuilder } from "./util/WarehouseBuilder.util";

function WarehouseHeatmap({data}) {
  // Config
  const areaPadding = 50;
  const warehousePointCenterArea = new THREE.Vector3(0,0,0);
  // Warehouse Buider
  const warehouseBuilder = new WarehouseBuilder(data, warehousePointCenterArea);
  // Calcular area de trabajo
  const areaWidth = warehouseBuilder.warehouse.metadata.width + ( areaPadding * 2);
  const areaHeight = warehouseBuilder.warehouse.metadata.depth + ( areaPadding * 2);


  // Scene
  const scene = new THREE.Scene({});
  scene.fog = new THREE.Fog(new THREE.Color("#6A6A69"), 1, 2000);
  // Camera
  const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0,5, areaHeight / 2);
  camera.lookAt(new THREE.Vector3(0,5,0));
  // Floor
  scene.add(WarehouseObject.createFloor(areaWidth, areaHeight))
  // Render
  const renderer = new THREE.WebGLRenderer({
    "antialias": true,
  });

  // Helpers - Show Axis
  const axesHelper = new THREE.AxesHelper(100);
  scene.add( axesHelper );

  useEffect(()=> {
    // Get container
    const heatmap = document.getElementById("heatmap");
    // Resize Render
    renderer.setSize(heatmap.clientWidth, heatmap.clientHeight);
    // Add canvas to HTML
    heatmap.appendChild(renderer.domElement);
    // Create control
    const customControl = new CustomControl(heatmap, camera, renderer);
    // Click Handler
    const clickHandler = new ClickHandler(heatmap, camera, renderer);
    // Build Warehouse
    warehouseBuilder.onBuildObject((type, data, volumen, centerPoint) => {
      // 1 == > warehouse
      // 1 == > group
      let color = "#6A6A69";
      switch (type) {
        case 1:
          color = "#A71C1C";
          break;
        case 2:
          color = "#4F9EEE";
          // let groupObject = WarehouseObject.createBox(volumen.width, volumen.height, volumen.depth, centerPoint.x, centerPoint.y, centerPoint.z, color);
          // scene.add( groupObject.object );
          // scene.add( groupObject.wireframe );
          break;
        case 3:
          color = "#FFCA28";
          // let rackObject = WarehouseObject.createBox(volumen.width, volumen.height, volumen.depth, centerPoint.x, centerPoint.y, centerPoint.z, color);
          // scene.add( rackObject.object );
          // scene.add( rackObject.wireframe );
          break;
        case 4:
          color = "#0A8194";
          // let positionObject = WarehouseObject.createBox(volumen.width, volumen.height, volumen.depth, centerPoint.x, centerPoint.y, centerPoint.z, color);
          // scene.add( positionObject.object );
          // scene.add( positionObject.wireframe );
          break;
        case 5:
          color = "#0B5192";
          // let levelObject = WarehouseObject.createBox(volumen.width, volumen.height, volumen.depth, centerPoint.x, centerPoint.y, centerPoint.z, color);
          // scene.add( levelObject.object );
          // scene.add( levelObject.wireframe );
          break;
        case 6:
          color = "#6A6A69";
          let positionObject = WarehouseObject.createBox(volumen.width, volumen.height, volumen.depth, centerPoint.x, centerPoint.y, centerPoint.z, color);
          scene.add( positionObject.object );
          scene.add( positionObject.wireframe );
          break;
      }
      
      // console.log(data);
    });
    warehouseBuilder.build();
    // Animate
    function animate() {
      requestAnimationFrame(animate);
      customControl.animate();
      renderer.render(scene, camera);
    }
    animate();
  }, []);
  return (
      <div id="heatmap"></div>
  );
}

export default WarehouseHeatmap
