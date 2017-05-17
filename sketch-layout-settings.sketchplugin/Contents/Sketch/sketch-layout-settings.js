const isArtboard = item => item.class() == 'MSArtboardGroup';

const writeFile = (filename, the_string) => {
  const path =[@"" stringByAppendingString: filename];
  const str = [@"" stringByAppendingString: the_string];
  str.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
}

const readFile = filePath => {
  const fileContents = NSString.stringWithContentsOfFile(filePath);
  return JSON.parse(fileContents.toString());
}

const TEMP_FILE_NAME = '.sketch-layout-settings.json';

// GLOBAL
function copyLayoutSettings (context) {
  const artboard = context.document.currentPage().currentArtboard();
  const artboardLayout = artboard.layout();

  const layout = {
    drawVertical: artboardLayout.drawVertical(),
    totalWidth: artboardLayout.totalWidth(),
    horizontalOffset: artboardLayout.horizontalOffset(),
    numberOfColumns: artboardLayout.numberOfColumns(),
    guttersOutside: artboardLayout.guttersOutside(),

    gutterWidth: artboardLayout.gutterWidth(),
    columnWidth: artboardLayout.columnWidth(),

    drawHorizontal: artboardLayout.drawHorizontal(),
    gutterHeight: artboardLayout.gutterHeight(),
    rowHeightMultiplication: artboardLayout.rowHeightMultiplication(),
    drawHorizontalLines: artboardLayout.drawHorizontalLines(),
  };

  writeFile(`${NSHomeDirectory()}/${TEMP_FILE_NAME}`, JSON.stringify(layout));
}

function pasteLayoutSettings (context) {
  const data = readFile(`${NSHomeDirectory()}/${TEMP_FILE_NAME}`);

  context.selection.slice()
    .filter(isArtboard)
    .map(function(artboard) {
      artboard.layout().drawVertical = data.drawVertical;
      artboard.layout().setTotalWidth(data.totalWidth);
      artboard.layout().horizontalOffset = (artboard.frame().width() - data.totalWidth) / 2;
      artboard.layout().setNumberOfColumns(data.numberOfColumns);
      artboard.layout().setGuttersOutside(data.guttersOutside);

      artboard.layout().setGutterWidth(data.gutterWidth);
      artboard.layout().setColumnWidth(data.columnWidth);

      artboard.layout().drawHorizontal = data.drawHorizontal;
      artboard.layout().gutterHeight = data.gutterHeight;
      artboard.layout().rowHeightMultiplication = data.rowHeightMultiplication;
      artboard.layout().drawHorizontalLines = data.drawHorizontalLines;
    });
}
