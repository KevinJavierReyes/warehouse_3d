

const profundidad = {
    "code": "L1-001-001-001-01",
    "color": "rgb(100, 100, 100)",
    "payload": {}
};

const nivel = {
    "code": "L1-001-001-001",
    "produndidades": [
        profundidad,
        profundidad,
        profundidad
    ]
}

const posicion = {
    "code": "L1-001-001",
    "niveles": [
        nivel,
        nivel,
        nivel
    ]
}

const rack = {
    "code": "L1-001",
    "posiciones": [
        posicion,
        posicion,
        posicion
    ]
}

const almacen = {
    "code": "L1",
    "racks": [
        rack,
        rack,
        rack
    ] 
}
