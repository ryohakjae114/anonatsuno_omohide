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
  const currentTemperature = getCurrentTemperature(lat, lon);
  makeGhostImage(currentTemperature);
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
  } catch (error) {
    console.error(error.message);
  }
}

function makeGhostImage(temperature) {
  temperature = 30;
  switch (true) {
    case temperature >= 38:
      overlapHakjaeImg(400);
      break;
    case temperature >= 36:
      overlapHakjaeImg(300);
      break;
    case temperature >= 34:
      overlapHakjaeImg(200);
      break;
    case temperature >= 32:
      overlapHakjaeImg(100);
      break;
    case temperature >= 30:
      overlapHakjaeImg(70);
      break;
    default:
      overlapHakjaeImg(50);
      break;
  }
}

function overlapHakjaeImg(size) {
  let ghostImgElement = document.createElement('img');
  ghostImgElement.src = 'images/hakjae.png';
  ghostImgElement.style.height = `${size}px`;
  ghostImgElement.style.height = `${size}px`;
  ghostImgElement.style.filter =  'grayscale(80%)';
  ghostImgElement.classList.add('position-absolute', 'bottom-0', 'end-0', 'opacity-75', 'ghostImage');
  imgField.appendChild(ghostImgElement);
}
