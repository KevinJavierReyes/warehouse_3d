import { WarehouseProcessor } from "./../util/WarehouseProcessor.util";

export class WarehouseBuilder {


    constructor(data, areaCenter) {
        // Process data
        const warehouseProcessor = new WarehouseProcessor();
        const warehouse = warehouseProcessor.resume(data);
        this.warehouse = warehouse;
        this.areaCenter = areaCenter;
        //
        this.areaCenter.y = this.areaCenter.y  + (this.warehouse.metadata.height / 2);
    }

    build() {
        this.callback(1, this.warehouse, {
            "width": this.warehouse.metadata.width,
            "height": this.warehouse.metadata.height,
            "depth": this.warehouse.metadata.depth
        }, {
            "x": this.areaCenter.x,
            "y": this.areaCenter.y,
            "z": this.areaCenter.z
        });  
        const guidePointGroup = {
            "x": this.areaCenter.x - (this.warehouse.metadata.width / 2),
            "y": this.areaCenter.y - (this.warehouse.metadata.height / 2),
            "z": this.areaCenter.z + (this.warehouse.metadata.depth / 2),
        }
        this.warehouse.metadata.groups.forEach((group) => {
            const centerPointGroup = {
                "x": guidePointGroup.x + group.metadata.x,
                "y": guidePointGroup.y + group.metadata.y,
                "z": guidePointGroup.z - group.metadata.z
            };
            this.callback(2, group, {
                    "width": group.metadata.width,
                    "height": group.metadata.height,
                    "depth": group.metadata.depth
                }, centerPointGroup);  
            const guidePointRacks = {
                "x":centerPointGroup.x - (group.metadata.width / 2),
                "y":centerPointGroup.y - (group.metadata.height / 2),
                "z":centerPointGroup.z + (group.metadata.depth / 2),
            }
            group.racks.forEach((rack)=> {
                const centerPointRack = {
                    "x": guidePointRacks.x + rack.metadata.x,
                    "y": guidePointRacks.y + rack.metadata.y,
                    "z": guidePointRacks.z - rack.metadata.z
                };
                this.callback(3, rack, {
                        "width": rack.metadata.width,
                        "height": rack.metadata.height,
                        "depth": rack.metadata.depth
                    }, centerPointRack);  
                const guidePointPosition = {
                    "x":centerPointRack.x - (rack.metadata.width / 2),
                    "y":centerPointRack.y - (rack.metadata.height / 2),
                    "z":centerPointRack.z + (rack.metadata.depth / 2),
                }
                rack.positions.forEach((position) => {
                    const centerPointPosition = {
                        "x": guidePointPosition.x + position.metadata.x,
                        "y": guidePointPosition.y + position.metadata.y,
                        "z": guidePointPosition.z - position.metadata.z
                    };
                    this.callback(4, position, {
                            "width": position.metadata.width,
                            "height": position.metadata.height,
                            "depth": position.metadata.depth
                        }, centerPointPosition);  
                    const guidePointLevel = {
                        "x":centerPointPosition.x - (position.metadata.width / 2),
                        "y":centerPointPosition.y - (position.metadata.height / 2),
                        "z":centerPointPosition.z + (position.metadata.depth / 2),
                    }
                    position.levels.forEach((level) => {
                        const centerPointLevel = {
                            "x": guidePointLevel.x + level.metadata.x,
                            "y": guidePointLevel.y + level.metadata.y,
                            "z": guidePointLevel.z - level.metadata.z
                        };
                        this.callback(5, level, {
                                "width": level.metadata.width,
                                "height": level.metadata.height,
                                "depth": level.metadata.depth
                            }, centerPointLevel);  
                        const guidePointDepth = {
                            "x":centerPointLevel.x - (level.metadata.width / 2),
                            "y":centerPointLevel.y - (level.metadata.height / 2),
                            "z":centerPointLevel.z + (level.metadata.depth / 2),
                        }
                        level.depths.map((depth) => {
                            const centerPointDepth = {
                                "x": guidePointDepth.x + depth.metadata.x,
                                "y": guidePointDepth.y + depth.metadata.y,
                                "z": guidePointDepth.z - depth.metadata.z
                            };
                            this.callback(6, depth, {
                                "width": depth.metadata.width,
                                "height": depth.metadata.height,
                                "depth": depth.metadata.depth
                            }, centerPointDepth);  
                        });
                    });
                });
            });
        });
    }

    onBuildObject(callback) {
        this.callback = callback;
    }

}