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
  bgImage = await getImage(baseUrl + "/imgs/" + weatherData + ".png");
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
  let moon = buildMoon(date.year, date.month, date.day);
  context.drawText("Current Moon Phase:", new Point(500, 43));
  context.drawText(moon.name, new Point(500, 90));
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
      "/imgs/new-moon.jpg",
      "/imgs/waxing-crescent-moon.jpg",
      "/imgs/quarter-moon.jpg",
      "/imgs/waxing-gibbous-moon.jpg",
      "/imgs/full-moon.jpg",
      "/imgs/waning-gibbous-moon.jpg",
      "/imgs/last-quarter-moon.jpg",
      "/imgs/waning-crescent-moon.png",
    ],
  };
  var c = (e = jd = b = 0);
  console.log(Moon.phases[0]);
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
  return { phase: b, name: Moon.phases[b], image: Moon.phaseImgs[b] };
}

async function getWeather() {
  var location = await Location.current();
  var lat = location.latitude;
  var lon = location.longitude;
  var API_KEY = "place api key here";
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
