

export class WarehouseProcessor {

    constructor() {
        this.maxItemInGroup = 10;
        this.widthDepth = 5;
        this.heightDepth = 5;
        this.depthDepth = 5;
        this.spaceBeetweenRacks = 30;
        this.thicknessSeparations = 0.1
    }

    resume(data) {
        // Calcular metadatos racks
        data.racks = data.racks.map((rack) => {
            const metadataRank = {
                "width": 0,
                "height": 0,
                "depth": 0
            }
            // Calcular volumen de rack
            rack.positions = rack.positions.map((position)=> {
                const metadataPosition = {
                    "width": 0,
                    "height": 0,
                    "depth": 0
                };
                const positionLevel = {
                    "z": 0,
                    "x": 0,
                    "y": 0
                };
                // calcular volumen de position 
                position.levels = position.levels.map((level) => {
                    const metadataLevel = {
                        "width": 0,
                        "height": 0,
                        "depth": 0
                    }
                    // Calcular volumen de nivel
                    level.depths = level.depths.map((depth, di) => {
                        // Calcular volumen nivel
                        if (metadataLevel.height < this.heightDepth) {
                            metadataLevel.height = this.heightDepth;
                        }
                        if (metadataLevel.depth < this.depthDepth) {
                            metadataLevel.depth = this.depthDepth;
                        }
                        metadataLevel.width += this.widthDepth;
                        // positionDepth.y = this.heightDepth / 2;
                        // positionDepth.x = (this.widthDepth * di)- (this.widthDepth / 2);
                        // positionDepth.z = this.depthDepth / 2;
                        return {
                            ...depth,
                            "metadata": {
                                "width": this.widthDepth,
                                "height": this.heightDepth,
                                "depth": this.depthDepth
                            }
                        }
                    });
                    // Calcular puntos de depths
                    let depthsx = 0;
                    level.depths = level.depths.map((depth, di) => {
                        depthsx += depth.metadata.width;
                        depth.metadata = {
                            ...depth.metadata,
                            "z": depth.metadata.depth / 2,
                            "x": depthsx - (depth.metadata.width / 2),
                            "y": depth.metadata.height / 2,
                        }
                        return depth;
                    })
                    // Calcular volumen de posicion
                    if (metadataPosition.depth < metadataLevel.depth) {
                        metadataPosition.depth = metadataLevel.depth;
                    }
                    if (metadataPosition.width < metadataLevel.width) {
                        metadataPosition.width = metadataLevel.width;
                    }
                    metadataPosition.height += metadataLevel.height;
                    return {
                        ...level,
                        "metadata": {
                            ...metadataLevel,
                            ...positionLevel
                        }
                    }
                });
                // Calcular puntos de levels
                let levelsy = 0;
                position.levels = position.levels.map((level, li) => {
                    levelsy += level.metadata.height;
                    level.metadata = {
                        ...level.metadata,
                        "x": level.metadata.width / 2,
                        "y": levelsy - (level.metadata.height / 2),
                        "z": level.metadata.depth / 2,
                    }
                    return level;
                });
                //  Calcular volumen rank
                if (metadataRank.height < metadataPosition.height) {
                    metadataRank.height = metadataPosition.height;
                }
                if (metadataRank.width < metadataPosition.width) {
                    metadataRank.width = metadataPosition.width;
                }
                metadataRank.depth += metadataPosition.depth;
                return {
                    ...position,
                    "metadata": metadataPosition
                }
            });
            // Calcular puntos de position
            let positionsz = 0;
            rack.positions = rack.positions.map((position, pi) => {
                positionsz += position.metadata.depth;
                position.metadata = {
                    ...position.metadata,
                    "x": position.metadata.width / 2,
                    "z": positionsz - (position.metadata.depth / 2),
                    "y": position.metadata.height / 2,
                }
                return position;
            });
            return {
                ...rack,
                "metadata": metadataRank,
            };
        });
        // Agrupar
        let groups = Array(Math.ceil(data.racks.length / this.maxItemInGroup)).fill().map((_, index)=> {
            return {
                "racks": data.racks.slice(index * this.maxItemInGroup, this.maxItemInGroup * (index + 1))
            }
        });
        // Calcular metadatos group
        groups = groups.map((group)=> {
            let height = 0;
            let depth = 0;
            const witdh = group.racks.reduce((_, rack)=> {
                if (height <= rack.metadata.height) {
                    height = rack.metadata.height;
                }
                if (depth <= rack.metadata.depth) {
                    depth = rack.metadata.depth;
                }
                return _ + rack.metadata.width;
            }, 0) + ((group.racks.length - 1) * this.spaceBeetweenRacks);
            // Calcular puntos de position
            let racksx = 0;
            group.racks = group.racks.map((rack, ri) => {
                racksx += rack.metadata.width;
                rack.metadata = {
                    ...rack.metadata,
                    "z": rack.metadata.depth / 2,
                    "x": racksx - (rack.metadata.width / 2),
                    "y": rack.metadata.height / 2,
                }
                if (ri <  group.racks.length - 1) {
                    racksx += this.spaceBeetweenRacks;
                }
                return rack;
            });
            return {
                ...group,
                "metadata": {
                    "width": witdh,
                    "height": height,
                    "depth": depth
                }
            }
        });
        // Calcular espacio 3d total del alamacen 
        const width = groups.reduce((_, group)=> {
            return _ < group.metadata.width ? group.metadata.width : _ ;
        }, 0);//+ ( 2 *  this.spaceBeetweenRacks);
        const height = groups.reduce((_, group)=> {
            return _ < group.metadata.height ? group.metadata.height : _ ;
        }, 0);
        const depth = groups.reduce((_, group)=> {
            return _ + group.metadata.height;
        }, 0) + ( (groups.length - 1) *  this.spaceBeetweenRacks);
        
        // Calcular puntos de groups
        let groupsz = 0;
        groups = groups.map((group, gi)=> {
            groupsz += group.metadata.depth;
            group.metadata = {
                ...group.metadata,
                "x": group.metadata.width / 2,
                "z": groupsz - (group.metadata.depth / 2),
                "y": group.metadata.height / 2,
            }
            if (gi <  groups.length - 1) {
                groupsz += this.spaceBeetweenRacks
            }
            return group;
        });
        return {
            ...data,
            "metadata": {
                "groups": groups,
                "width": width,
                "height": height,
                "depth": depth
            }
        };
    }

}