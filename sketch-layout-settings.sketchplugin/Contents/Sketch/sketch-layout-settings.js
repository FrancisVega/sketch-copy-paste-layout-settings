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
    drawHorizontalLines: abLayout.drawHorizontalLines(),
    isEnabled: abLayout.isEnabled()
  }
}

const getGridSettings = artboard => {
  const abGrid = artboard.grid();
  return {
    gridSize: abGrid.gridSize(),
    thickGridTimes: abGrid.thickGridTimes(),
    isEnabled: abGrid.isEnabled()
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
  const layoutSetting = data.layout;
  const gridSetting = data.grid;

  context.selection.slice()
    .filter(isArtboardOrIsSymbolMaster)
    .map(artboard => {

      const layout = MSLayoutGrid.alloc().init();
      const grid = MSSimpleGrid.alloc().init();

      layout.setDrawVertical(layoutSetting.drawVertical);
      layout.setTotalWidth(layoutSetting.totalWidth);
      layout.setHorizontalOffset(layoutSetting.horizontalOffset);
      layout.setNumberOfColumns(layoutSetting.numberOfColumns);
      layout.setGuttersOutside(layoutSetting.guttersOutside);

      layout.setGutterWidth(layoutSetting.gutterWidth);
      layout.setColumnWidth(layoutSetting.columnWidth);

      layout.setDrawHorizontal(layoutSetting.drawHorizontal);
      layout.setGutterHeight(layoutSetting.gutterHeight);
      layout.setRowHeightMultiplication(layoutSetting.rowHeightMultiplication);
      layout.setDrawHorizontalLines(layoutSetting.drawHorizontalLines);

      layout.setIsEnabled(layoutSetting.isEnabled);
      artboard.setLayout(layout);

      grid.setGridSize(gridSetting.gridSize);
      grid.setThickGridTimes(gridSetting.thickGridTimes);

      grid.setIsEnabled(gridSetting.isEnabled);
      artboard.setGrid(grid);

    });
}
