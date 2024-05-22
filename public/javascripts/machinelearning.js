//behold, Muthuphei's glorious machine learning to process the tile images,

water = "water";
desert = "desert";
swamp = "swamp";
forest = "forest";
mountain = "mountain";
bear = "bear territory";
couger = "cougar territory";
tile1 = [
  [water, water, water, water, forest, forest],
  [swamp, swamp, water, desert, forest, forest],
  [
    swamp,
    swamp,
    desert,
    desert + ", " + bear,
    desert + ", " + bear,
    forest + ", " + bear,
  ],
];
tile2 = [
  [
    swamp + ", " + couger,
    forest + ", " + couger,
    forest + ", " + couger,
    forest,
    forest,
    forest,
  ],
  [swamp, swamp, forest, desert, desert, desert],
  [swamp, mountain, mountain, mountain, mountain, desert],
];
tile3 = [
  [swamp, swamp, forest, forest, forest, water],
  [
    swamp + ", " + couger,
    swamp + ", " + couger,
    forest,
    mountain,
    water,
    water,
  ],
  [mountain + ", " + couger, mountain, mountain, mountain, water, water],
];
tile4 = [
  [desert, desert, mountain, mountain, mountain, mountain],
  [desert, desert, mountain, water, water, water + ", " + couger],
  [desert, desert, desert, forest, forest, forest + ", " + couger],
];
tile5 = [
  [swamp, swamp, swamp, mountain, mountain, mountain],
  [swamp, desert, desert, water, mountain, mountain + ", " + bear],
  [desert, desert, water, water, water + ", " + bear, water + ", " + bear],
];
tile6 = [
  [desert + ", " + bear, desert, swamp, swamp, swamp, forest],
  [mountain + ", " + bear, mountain, swamp, swamp, forest, forest],
  [mountain, water, water, water, water, forest],
];
tile7 = [
  [
    forest + ", " + bear,
    desert + ", " + bear,
    desert + ", " + bear,
    desert,
    swamp,
    swamp,
  ],
  [forest, forest, desert, water, swamp, swamp],
  [forest, forest, water, water, water, water],
];
tile8 = [
  [desert, mountain, mountain, mountain, mountain, swamp],
  [desert, desert, desert, forest, swamp, swamp],
  [
    forest,
    forest,
    forest,
    forest + ", " + couger,
    forest + ", " + couger,
    swamp + ", " + couger,
  ],
];
tile9 = [
  [water, water, mountain, mountain, mountain, mountain + ", " + couger],
  [
    water,
    water,
    mountain,
    forest,
    swamp + ", " + couger,
    swamp + ", " + couger,
  ],
  [water, forest, forest, forest, swamp, swamp],
];
tile10 = [
  [forest + ", " + couger, forest, forest, desert, desert, desert],
  [water + ", " + couger, water, water, mountain, desert, desert],
  [mountain, mountain, mountain, mountain, desert, desert],
];
tile11 = [
  [water + ", " + bear, water + ", " + bear, water, water, desert, desert],
  [mountain + ", " + bear, mountain, water, desert, desert, swamp],
  [mountain, mountain, mountain, swamp, swamp, swamp],
];
tile12 = [
  [forest, water, water, water, water, mountain],
  [forest, forest, swamp, swamp, mountain, mountain + ", " + bear],
  [forest, swamp, swamp, swamp, desert, desert + ", " + bear],
];

listOfAllTiles = [
  tile1,
  tile2,
  tile3,
  tile4,
  tile5,
  tile6,
  tile7,
  tile8,
  tile9,
  tile10,
  tile11,
  tile12,
];

console.log(listOfAllTiles)