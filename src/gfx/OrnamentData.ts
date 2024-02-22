interface Coordinate {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
}

interface OrnamentInfo {
    images: {
        primary: string;
        secondary: string;
    };
    coordinatesSetIndex: number;
}

enum OrnDataDis {
    D3L, D3R, D3CL, D3CC, D3CR,
    D2L, D2R, D2CL, D2CC, D2CR,
    D1L, D1R, D1CC,
}

export class OrnamentData {
    private static coordinatesSets: Coordinate[][] = [
        [
            //grp1:D3 L / R / C / C / C
            {x1: 74,x2: 82,y1:41,y2:60,width: 8,height:20},
            {x1:141,x2:149,y1:41,y2:60,width: 8,height:20},
            {x1:  1,x2: 47,y1:37,y2:63,width:24,height:27},
            {x1: 88,x2:134,y1:37,y2:63,width:24,height:27},
            {x1:171,x2:217,y1:37,y2:63,width:24,height:27},
            // D2: L / R / C / C / C
            {x1: 61,x2: 76,y1:38,y2:67,width: 8,height:30},
            {x1:147,x2:162,y1:38,y2:67,width: 8,height:30},
            {x1:  0,x2: 43,y1:37,y2:73,width:32,height:37},
            {x1: 80,x2:143,y1:37,y2:73,width:32,height:37},
            {x1:180,x2:223,y1:37,y2:73,width:32,height:73},
            // D1: L / R / C
            {x1: 32,x2: 63,y1:36,y2:83,width:16,height:48}, 
            {x1:160,x2:191,y1:36,y2:83,width:16,height:48},
            {x1: 64,x2:159,y1:36,y2:91,width:48,height:56},
        ],
        // ... other coordinate sets if needed
    ];

    private static ornamentData: OrnamentInfo[] = [
        {
            images: {
                primary: 'obj0261',
                secondary: 'obj0262'
            },
            coordinatesSetIndex: 0
        },
        // ... other ornament data
    ];
    
    static getOrnament(ornamentIndex: number): OrnamentInfo | null {
        return this.ornamentData[ornamentIndex] || null;
    }

    static getCoordinatesForOrnament(ornamentIndex: number): Coordinate[] | null {
        const ornament = this.ornamentData[ornamentIndex];
        if (!ornament) return null;
        return this.coordinatesSets[ornament.coordinatesSetIndex];
    }

    static getImagePathsForOrnament(ornamentIndex: number): { primary: string, secondary: string } | null {
        const ornament = this.ornamentData[ornamentIndex];
        if (!ornament) return null;
        return ornament.images;
    }

}
