// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: microchip;
let baseUrl =
  "https://raw.githubusercontent.com/christianbemerson/MoonPhaseWidget/master";
let bgImage = await getImage(baseUrl + "/imgs/background.jpg");
let widget = await createWidget();

if (!config.runsInWidget) {
  await widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();

async function buildInterface() {
  var weatherData = await getWeather();
  bgImage = await getImage(baseUrl + "/imgs/clear.png");
  let bg = bgImage;
  let context = new DrawContext();

  context.respectScreenScale = false;

  let rec = new Rect(0, 0, 1024, 482);

  context.size = new Size(1024, 482);

  if (bg != null) {
    context.drawImageInRect(bg, rec);
  }
  context.setTextColor(Color.white());
  context.setTextAlignedLeft();
  context.setFontSize(50);
  let today = new Date();
  let date = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  var nextFull = getNextFullMoon(date.year, date.month, date.day);
  let moon = buildMoon(date.year, date.month, date.day);
  context.drawText("Current Moon Phase:", new Point(420, 150));
  context.drawText(moon.name, new Point(420, 200));
  if (nextFull != 0) {
    context.drawText(
      "Next Full Moon in: " + nextFull + " day(s)",
      new Point(420, 250)
    );
    context.drawText("Visibility is: " + weatherData, new Point(420, 300));
  } else {
    context.drawText("Today is the full moon!", new Point(420, 250));
    context.drawText("Visibility is: " + weatherData, new Point(420, 300));
  }
  let moonImg = await getImage(baseUrl + moon.image);
  if (moonImg != null) {
    context.drawImageInRect(moonImg, new Rect(150, 150, 200, 200));
  }
  let img = context.getImage();
  return img;
}

function buildMoon(year, month, day) {
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
      "/imgs/new-moon.png",
      "/imgs/waxing-crescent-moon.png",
      "/imgs/quarter-moon.png",
      "/imgs/waxing-gibbous-moon.png",
      "/imgs/full-moon.png",
      "/imgs/waning-gibbous-moon.png",
      "/imgs/last-quarter-moon.png",
      "/imgs/waning-crescent-moon.png",
    ],
  };
  var c = (e = jd = b = 0);
  if (month < 3) {
    year--;
    month += 12;
  }
  ++month;
  c = 365.25 * year;
  e = 30.6 * month;
  jd = c + e + day - 694039.09;
  jd /= 29.5305882;
  b = parseInt(jd);
  jd -= b;
  b = Math.round(jd * 8);
  if (b >= 8) b = 0;
  return { name: Moon.phases[b], image: Moon.phaseImgs[b] };
}

function getNextFullMoon(year, month, day) {
  var currentDate = new Date(year, month, day);
  var blueMoonDate = new Date(96, 1, 3, 16, 15, 0);
  var lunarPeriod =
    29 * (24 * 3600 * 1000) + 12 * (3600 * 1000) + 44.05 * (60 * 1000);
  var moonPhaseTime =
    (currentDate.getTime() - blueMoonDate.getTime()) % lunarPeriod;
  var nextMoonDate = Math.round(
    (lunarPeriod - moonPhaseTime) / (24 * 3600 * 1000)
  );
  return nextMoonDate;
}

async function getWeather() {
  var location = await Location.current();
  var lat = location.latitude;
  var lon = location.longitude;
  var API_KEY = "place your api key here";
  var weatherData = await new Request(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=imperial&lang=EN&appid=" +
      API_KEY
  ).loadJSON();
  return weatherData.weather[0].main;
}

async function getImage(url) {
  let req = new Request(url);
  return await req.loadImage();
}

async function createWidget() {
  let bg = await buildInterface();
  let w = new ListWidget();

  if (bg != null) {
    w.backgroundImage = bg;
  }
  return w;
}
