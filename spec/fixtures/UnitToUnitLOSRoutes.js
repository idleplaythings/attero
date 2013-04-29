var UnitToUnitLOSRoutes =
[
    {
        "description": "Route with last tile having concealment.",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 0}
        ]
    },

    {
        "description": "Route with corner. Notes: First tile should be ignored. Degradation 0",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 0},
            [
                {"position": {"x":2, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
                {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
            ],
            {"position": {"x":3, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Simple corner case with other corner having concealment of 50.",
        "expected": 10,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            [
                {"position": {"x":0, "y":1}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
                {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
            ],
            {"position": {"x":1, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Straight route with multiple tiles having concealment",
        "expected": 80,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 40, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 40, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 0}
        ]
    },

    {
        "description": "Straight route with tile that has concealment but element height of 0",
        "expected": 40,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 40, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 40, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 0}
        ]
    },

    {
        "description": "Straight route with multiple unique elements",
        "expected": 80,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 40, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 1},
            {"position": {"x":2, "y":0}, "concealment": 40, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 1},
            {"position": {"x":3, "y":0}, "concealment": 40, "element": 2, "elevation": 0, "elementHeight": 2, "unique": 1}
        ]
    },

    {
        "description": "Straight route with two unique elements, other being too low to count as being seen",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 1, "unique": 1},
            {"position": {"x":2, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 1},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 1}
        ]
    },

    {
        "description": "Route with corner. Corner has unique element",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            [
                {"position": {"x":2, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
                {"position": {"x":3, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 2, "unique": 1}
            ],
            {"position": {"x":3, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Straight route with elevation blocking line of sight",
        "expected": 100,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":4, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Straight route with elevation partly blocking line of sight",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":4, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":5, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Straight route with long hill. Target on top of hill unvisible",
        "expected": 100,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":4, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":5, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":6, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Route with corner, slope on one corner",
        "expected": 0,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            [
                {"position": {"x":2, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
                {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0}
            ],
            {"position": {"x":3, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Route with corner, hill on both corners",
        "expected": 100,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            [
                {"position": {"x":2, "y":1}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
                {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0}
            ],
            {"position": {"x":3, "y":1}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":4, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Route with corner, looking down from hill. Slope is on corner (one corner hill, other slope)",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            [
                {"position": {"x":2, "y":1}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
                {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0}
            ],
            {"position": {"x":3, "y":1}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Straight route with valley that has elements with concealment (but unit sees over them)",
        "expected": 0,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":4, "y":0}, "concealment": 50, "element": 0, "elevation": 0, "elementHeight": 2, "unique": 0},
            {"position": {"x":5, "y":0}, "concealment": 0, "element": 0, "elevation": 1, "elementHeight": 0, "unique": 0},
            {"position": {"x":6, "y":0}, "concealment": 0, "element": 0, "elevation": 2, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Route with height 1 concealment, that observer sees over",
        "expected": 0,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 1, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },

    {
        "description": "Route with height 1 concealment, that observer DOES NOT see over",
        "expected": 50,
        "unitheight": 1.5,
        "degradation": 0,
        "route": [
            {"position": {"x":-1, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":0, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":1, "y":0}, "concealment": 50, "element": 1, "elevation": 0, "elementHeight": 1, "unique": 0},
            {"position": {"x":2, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0},
            {"position": {"x":3, "y":0}, "concealment": 0, "element": 0, "elevation": 0, "elementHeight": 0, "unique": 0}
        ]
    },
]


