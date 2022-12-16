const express = require('express')

const app = express()
// dinlenecek portu belirliyoruz.
const port = 3000

// jsondan verileri çekiyoruz.
const fs = require('fs');
// json dosyasını okuyoruz.
let rawdata = fs.readFileSync('menu.json');
// json dosyasını parse ediyoruz.
let menu = JSON.parse(rawdata);


// ana sayfayı oluşturuyoruz.
app.get('/', (req, res) => {
    // ufak bi html oluşturuyoruz donuyoruz. Giren kullanıcı fareyi üzerine getirdiğinde menüyü girebilsin.
    res.send('<h1>Merhabalar!</h1>' +
        '<br>' +
        '<p>Menü için <a href="/menu">tıklayınız.</a></p>')
});

app.get('/menu', (req, res) => {
    // type casting ediyoruz. string to int
    let sayfa = parseInt(req.query.sayfa);
    let limit = parseInt(req.query.limit);
    // atlama değerini hesaplıyoruz. sayfa 1 ise 0, sayfa 2 ise 1*limit, sayfa 3 ise 2*limit olacak şekilde hesaplıyoruz.
    let atlama = (sayfa - 1) * limit;
    let s = req.query.s;

    // default değerler
    let responseModel = {
        sayfa: 1,
        limit: 4,
        atlama: 0,
        s: "",
        data: [],
    }

    // boş değiller ise değerleri değiştiriyoruz.
    if (sayfa) {
        responseModel.sayfa = sayfa;
    }
    // boş değiller ise değerleri değiştiriyoruz.
    if (limit) {
        responseModel.limit = limit;
    }
    // boş değiller ise değerleri değiştiriyoruz.
    if (atlama) {
        responseModel.atlama = atlama;
    }
    // Eğer s değeri boş değilse regex oluşturuyoruz.
    if (s) {
        // query string ile gelen s değerini regex oluşturmak için değişkene yazıyoruz.
        responseModel.s = s;
        let data = []
        // s değeri boş değilse filtreleme işlemi yapıyoruz.
        menu.forEach((item,index) => {
            const str = item.isim;
            const regex = createRegex(s);
            // eğer regex ile eşleşen bir değer varsa data dizisine ekliyoruz.
            if (regex.test(str)) {
                data.push(item);
            }
        })
        // limite göre ayırıyoruz.
        if (data.length != 0) {
            // eğer data boş değilse limit ve atlama değerlerine göre ayırıyoruz. Yani sayfalama işlemi yapıyoruz.
            for (let i = responseModel.atlama; i < responseModel.atlama + responseModel.limit; i++) {
                responseModel.data.push(data[i]);
            }
            // response modeli json olarak dönüyoruz. Return yapıyoruz ki fonksiyon sonlandırsın.
            return res.json(responseModel);
        }
    }

    // atlamayı menunun uzunluguna atıyalım ki hata almayalım.
    if (responseModel.atlama > menu.length) {
        responseModel.atlama = menu.length;
    }

    // limit ve atlamaya göre veriyi koyalım.
    for (let i = responseModel.atlama; i < responseModel.atlama + responseModel.limit; i++) {
        responseModel.data.push(menu[i]);
    }
    // response modeli döndürüyoruz.
    res.json(responseModel)
})



// serverı başlatıyoruz.
app.listen(
    port,
    () => console.log(`app listening at http://localhost:${port}`)
);

// regex oluşturuyoruz.
function createRegex(word) {
    // word değerini regex oluşturmak için değişkene yazıyoruz. i harfi büyük küçük harf duyarlılığını kaldırmak için koyuyoruz.
    return new RegExp(word, "i");
}
