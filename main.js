const imgField = document.getElementById('imgField');

// 入力された画像を表示
document.getElementById("imageInput").addEventListener('change', function(e){

  let file_reader = new FileReader();
  
  // ファイル内容をBase64にエンコードし、「data:〜」で始まるURL形式で取得
  file_reader.readAsDataURL(e.target.files[0]);

  file_reader.addEventListener('load', function(e) {
    // img要素をページに挿入
    let imgElement = document.getElementById('img');
    imgElement.src = e.target.result;
    // 位置情報を取得
    navigator.geolocation.getCurrentPosition(success, error);
  });
});

function success(pos) {
  const crd = pos.coords;
  const lat = crd.latitude;
  const lon = crd.longitude;

  console.log("Your current position is:");
  console.log(`Latitude : ${lat}`);
  console.log(`Longitude: ${lon}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  getCurrentTemperature(lat, lon);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}


async function getCurrentTemperature(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&past_days=1&forecast_days=1`
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`レスポンスステータス: ${response.status}`);
    }

    const json = await response.json();
    const currentTemperature = json.current.temperature_2m
    console.log(currentTemperature);
    const opacity = makeGhostImage(currentTemperature);
    changeOpacity(opacity);
  } catch (error) {
    console.error(error.message);
  }
}

function makeGhostImage(temperature) {
  temperature = 28;
  let opacity = null;
  if (temperature >= 26) {
    opacity = 0.4;
    overlapHakjaeImg('bottom-0', 'end-0');
  }
  if (temperature >= 28) {
    opacity = 0.5;
    overlapHakjaeImg('top-0', 'start-0');
  }
  if (temperature >= 30) {
    opacity = 0.6;
    overlapHakjaeImg('top-0', 'end-0');
  }
  if (temperature >= 32) {
    opacity = 0.7;
    overlapHakjaeImg('bottom-0', 'start-0');
  }
  if (temperature >= 34) {
    opacity = 0.8;
    overlapHakjaeImg('top-0', 'start-50');
    overlapHakjaeImg('bottom-0', 'start-50');
  }
  if (temperature >= 36) {
    opacity = 0.9;
    overlapHakjaeImg('top-50', 'end-0');
    overlapHakjaeImg('top-50', 'start-0');
  }
  if (temperature >= 38) {
    opacity = 1;
    overlapHakjaeImg('top-50', 'start-50');
  }
  return opacity;
}

function overlapHakjaeImg(xDirection, yDirection, opacity) {
  let ghostImgElement = document.createElement('img');
  ghostImgElement.src = 'images/hakjae.png';
  ghostImgElement.style.height = '100px';
  ghostImgElement.style.width = '100px';
  ghostImgElement.style.opacity = opacity;
  ghostImgElement.classList.add('position-absolute', xDirection, yDirection, 'ghostImage');
  imgField.appendChild(ghostImgElement);
  overlapBloodSplatter(xDirection, yDirection, opacity);
}

function overlapBloodSplatter(xDirection, yDirection, opacity) {
  let ghostImgElement = document.createElement('img');
  ghostImgElement.src = 'images/bloodSplatter.png';
  ghostImgElement.style.height = '100px';
  ghostImgElement.style.width = '100px';
  ghostImgElement.style.opacity = opacity;
  ghostImgElement.classList.add('position-absolute', xDirection, yDirection, 'ghostImage');
  imgField.appendChild(ghostImgElement);
}

function changeOpacity(opacity) {
  let ghostImages = document.querySelectorAll(".ghostImage");
  ghostImages.forEach((ghostImage) => {
    ghostImage.style.opacity = opacity;
  });
}
