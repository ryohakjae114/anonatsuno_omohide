// ファイルが選択されたら実行
document.getElementById("imageInput").addEventListener('change', function(e){

  let file_reader = new FileReader();
  
  // ファイル内容をBase64にエンコードし、「data:〜」で始まるURL形式で取得
  file_reader.readAsDataURL(e.target.files[0]);

  file_reader.addEventListener('load', function(e) {
    // img要素をページに挿入
    let imgElement = document.getElementById('img');
    imgElement.src = e.target.result;
  });
});
