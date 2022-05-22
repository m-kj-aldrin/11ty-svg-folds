const illu = document.querySelector("main > svg");

function saveSvg(e) {
  e.preventDefault();

  const serializer = new XMLSerializer();
  const cleanString = serializer
    .serializeToString(illu)
    .replace(/>[\s]*</g, "><");
  const file = new Blob([cleanString], { type: "image/svg+xml;charset=utf-8" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(file);
  a.download = `illu-crystals${document.querySelector("#image-sufix").value}.svg`;
  a.click();
}
function savePng(e) {
  e.preventDefault();

  const dim = {
    w: document.querySelector("#image-width").value,
    h: document.querySelector("#image-height").value,
  };

  const debugFrame = document.querySelector("#debug-frame");

  debugFrame?.setAttribute("opacity", "0");

  const svgText = new XMLSerializer()
    .serializeToString(illu)
    .replace('width="100%"', `width="${dim.w}"`)
    .replace('height="100%"', `height="${dim.h}"`);

  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const canvas = document.createElement("canvas");
  canvas.width = dim.w;
  canvas.height = dim.h;

  const ctx = canvas.getContext("2d");
  let img = new Image();

  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const png = canvas.toDataURL("image/png");
    URL.revokeObjectURL(url);

    const a = document.createElement("a");
    a.href = png;
    a.download = `illu-crystals${dim.w}x${dim.h}${
      document.querySelector("#image-sufix").value
    }.png`;
    a.click();
    debugFrame?.setAttribute("opacity", "1");
  };

  img.src = url;
}
