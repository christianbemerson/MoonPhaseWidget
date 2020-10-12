// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: microchip;

let bgImage = await getImage(
  "https://p.kindpng.com/picc/s/52-526434_rectangle-border-png-ionic-blank-transparent-png.png"
);
let widget = await createWidget();

// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentMedium();
}

// Tell the system to show the widget.
Script.setWidget(widget);
Script.complete();

function buildInterface() {
  // Original Snippet: https://gist.github.com/endel/dfe6bb2fbe679781948c

  var Moon = {
    phases: [
      "new-moon",
      "waxing-crescent-moon",
      "quarter-moon",
      "waxing-gibbous-moon",
      "full-moon",
      "waning-gibbous-moon",
      "last-quarter-moon",
      "waning-crescent-moon",
    ],
    phaseImgs: [
      "new-moon.jpg",
      "waxing-crescent-moon.jpg",
      "quarter-moon.jpg",
      "waxing-gibbous-moon.jpg",
      "full-moon.jpg",
      "waning-gibbous-moon.jpg",
      "last-quarter-moon.jpg",
      "waning-crescent-moon.jpg",
    ],
    phase: function (year, month, day) {
      let c = (e = jd = b = 0);

      if (month < 3) {
        year--;
        month += 12;
      }

      ++month;
      c = 365.25 * year;
      e = 30.6 * month;
      jd = c + e + day - 694039.09; // jd is total days elapsed
      jd /= 29.5305882; // divide by the moon cycle
      b = parseInt(jd); // int(jd) -> b, take integer part of jd
      jd -= b; // subtract integer part to leave fractional part of original jd
      b = Math.round(jd * 8); // scale fraction from 0-8 and round

      if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0
      return { phase: b, name: Moon.phases[b], image: phaseImgs[b] };
    },
  };
  let bg = bgImage;
  let context = new DrawContext();

  context.respectScreenScale = false;

  let rec = new Rect(0, 0, 1024, 482);

  context.size = new Size(1024, 482);

  if (bg != null) {
    context.drawImageInRect(bg, rec);
  }

  let charcoal = new Font("Charcoal", 32);
  context.setFont(charcoal);
  context.setTextColor(Color.black());
  context.setTextAlignedLeft();
  let today = new Date();
  let date = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  let moon = Moon.phase(date.year, date.month, date.day);
  context.drawText(moon.phase, new Point(692, 43));
  context.drawText(moon.name, new Point(692, 91));

  let img = context.getImage();
  return img;
}

async function getImage(url) {
  let req = new Request(url);
  return await req.loadImage();
}

async function createWidget() {
  let bg = buildInterface();
  let w = new ListWidget();

  if (bg != null) {
    w.backgroundImage = bg;
  }
  return w;
}
