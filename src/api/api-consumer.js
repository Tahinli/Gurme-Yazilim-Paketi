import User from "./user-api.js";

User.getUsers().then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

User.addUser({
    isim: "buwu287",
    soyisim: "aaa",
    id: "buwu451",
    sifre: "12"
}).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});


