import User from "./user-api.js";

const users = await User.getUsers();
console.log(users);

const userByID = await User.getUserById("buwu1");
console.log(userByID);

const user = await User.addUser({
    isim: "buwu287",
    soyisim: "aaa",
    id: "buwu4",
    sifre: "12"
});

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
