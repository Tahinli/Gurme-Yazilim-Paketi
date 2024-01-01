import User from "./user-api.js";
import Urun from "./urun-api.js";
import Kategori from "./kategori-api.js";
import Gunluk from "./gunluk-api.js";

// await Gunluk.addGunluk("manti", {
//     personel_sayisi: 5,
//     hedeflenen: 100,
//     ulasilan: 50,
//     atilan: 50,
//     tarih: Date.now()
// })

// await Gunluk.addGunluk("kurabiye", {
//     personel_sayisi: 5,
//     hedeflenen: 100,
//     ulasilan: 50,
//     atilan: 50,
//     tarih: "25-6-2002"
// })

const gunlukler = await Gunluk.getGunlukler()
console.log(gunlukler)

await Gunluk.updateGunluk("kurabiye", "25-6-2002", {
    personel_sayisi: 5,
    hedeflenen: 657676,
    ulasilan: 50,
    atilan: 50
})

//await Gunluk.deleteGunluk("manti", Date.now())



// const kategoriler = await Kategori.getKategoriler()
// console.log(kategoriler)

// const kategoriByName = await Kategori.getKategoriByName("mantisssssssssss")
// console.log(kategoriByName)

// const kategori = await Kategori.addKategori({
//     isim: "mantiskoko",
//     ust_kategori: "unlu"
// })
// console.log(kategori)

// await Kategori.deleteKategori("undefined")

// await Kategori.updateKategori("mantisko", {
//     ust_kategori: "mantis"
// })



// const urunler = await Urun.getUrunler();
// console.log(urunler);

// const urunByName = await Urun.getUrunByName("manti");

// // const urun = await Urun.addUrun({
// //     isim: "kurabiye3",
// //     kategori: "unlu"
// // });

// // await Urun.deleteUrun('kurabiye2');

// await Urun.updateUrun('kurabiye3', {
//     isim: "tahinli kurabiye",
//     kategori: "unlu"
// });

// const urunler1 = await Urun.getUrunler();
// console.log(urunler1);

// const users = await User.getUsers();
// console.log(users);

// const userByID = await User.getUserById("buwu451");
// userByID.isim = 'talha'
// userByID.soyisim = 'karasu'
// //userByID.id = '2'
// User.updateUser(userByID.id, userByID)

// const user = await User.addUser({
//     isim: "buwu287",
//     soyisim: "aaa",
//     id: "buwu4",
//     sifre: "12"
// });

// await User.updateUser("buwu451", {
//     isim: "talha",
//     soyisim: "karasu",
//     id: "1",
//     sifre: "123"
// });

//await User.deleteUser("buwu4");

// User.addUser({
//     isim: "buwu287",
//     soyisim: "aaa",
//     id: "buwu451",
//     sifre: "12"
// }).then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

