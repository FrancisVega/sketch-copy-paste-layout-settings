const TEMP_FILE_NAME = '.sketch-layout-settings.json';

const isArtboard = item => item.class() == 'MSArtboardGroup';
const isSymbolMaster = item => item.class() == 'MSSymbolMaster';
const isArtboardOrIsSymbolMaster = item => isArtboard || isSymbolMaster;

const writeFile = (filename, the_string) => {
  const path =[@"" stringByAppendingString: filename];
  const str = [@"" stringByAppendingString: the_string];
  str.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
}

const readFile = filePath => {
  const fileContents = NSString.stringWithContentsOfFile(filePath);
  return JSON.parse(fileContents.toString());
}

const getLayoutSettings = artboard => {
  const abLayout = artboard.layout();
  console.log(abLayout);
  return {
    drawVertical: abLayout.drawVertical(),
    totalWidth: abLayout.totalWidth(),
    horizontalOffset: abLayout.horizontalOffset(),
    numberOfColumns: abLayout.numberOfColumns(),
    guttersOutside: abLayout.guttersOutside(),
    gutterWidth: abLayout.gutterWidth(),
    columnWidth: abLayout.columnWidth(),
    drawHorizontal: abLayout.drawHorizontal(),
    gutterHeight: abLayout.gutterHeight(),
    rowHeightMultiplication: abLayout.rowHeightMultiplication(),
    drawHorizontalLines: abLayout.drawHorizontalLines()
  }
}

const getGridSettings = artboard => {
  const abGrid = artboard.grid();
  return {
    gridSize: abGrid.gridSize(),
    thickGridTimes: abGrid.thickGridTimes()
  }
}

const setLayoutSettings = artboard => {  }
const setGridSettings = artboard => {  }

function copySettings (context) {
  const artboard = context.document.currentPage().currentArtboard();
  let layout = {}
  let grid = {}

  try {
    layout = getLayoutSettings(artboard);
  } catch(e) { log(e) }

  try {
    grid = getGridSettings(artboard);
  } catch(e) { log(e) }

  const data = {
    layout,
    grid
  }

  writeFile(`${NSHomeDirectory()}/${TEMP_FILE_NAME}`, JSON.stringify(data));
}

function pasteSettings (context) {
  const data = readFile(`${NSHomeDirectory()}/${TEMP_FILE_NAME}`);
  const layout = data.layout;
  const grid = data.grid;

  context.selection.slice()
    .filter(isArtboardOrIsSymbolMaster)
    .map(artboard => {
      const abLayout = artboard.layout();
      const abGrid = artboard.grid();

      abLayout.drawVertical = layout.drawVertical;
      abLayout.setTotalWidth(layout.totalWidth);
      abLayout.horizontalOffset = (artboard.frame().width() - layout.totalWidth) / 2;
      abLayout.setNumberOfColumns(layout.numberOfColumns);
      abLayout.setGuttersOutside(layout.guttersOutside);

      abLayout.setGutterWidth(layout.gutterWidth);
      abLayout.setColumnWidth(layout.columnWidth);

      abLayout.drawHorizontal = layout.drawHorizontal;
      abLayout.gutterHeight = layout.gutterHeight;
      abLayout.rowHeightMultiplication = layout.rowHeightMultiplication;
      abLayout.drawHorizontalLines = layout.drawHorizontalLines;

      abGrid.gridSize = grid.gridSize;
      abGrid.thickGridTimes = grid.thickGridTimes;
    });
}
