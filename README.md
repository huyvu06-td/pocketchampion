# POCKET CHAMPION - Linh Thú Online

## Bản v2.4 mới

- Chỉ `admin` có quyền thêm tên linh thú vào danh sách gốc.
- Admin có thể thêm từng tên hoặc nhập một danh sách dài, mỗi dòng một tên hoặc phân tách bằng dấu phẩy / chấm phẩy.
- `user` và `mod` chỉ search tên linh thú đã có trong danh sách.
- Sau khi chọn linh thú, `mod` và `admin` sẽ thấy nút **Build linh thú này**.
- Mỗi mod chỉ có 1 build cho cùng một linh thú và chỉ sửa được build của chính mình.
- Một linh thú có thể có nhiều bài build của nhiều mod/admin khác nhau.
- Có nút **Copy link linh thú**. Mở link sẽ tự hiện linh thú đó cùng toàn bộ bài build.
- Bấm vào từng bài build để xem đầy đủ nội tại, kỹ năng, tính cách, chỉ số và ghi chú.
- Dữ liệu build cũ sẽ được tự đồng bộ sang danh sách tên linh thú khi server khởi động.

Bản online có:

- Đăng ký / đăng nhập tài khoản.
- Dữ liệu linh thú lưu trên MongoDB, mở máy nào cũng thấy sau khi đăng nhập.
- Phân quyền:
  - `user`: chỉ tra cứu.
  - `mod`: tra cứu tên linh thú đã có, tạo build cho linh thú đó, chỉ sửa build do chính mod đó tạo.
  - `admin`: toàn quyền, gồm quản lý tài khoản, thêm danh sách tên linh thú, sửa/xóa mọi build và đặt tên trong game cho mod.
- Nhiều mod có thể cùng build một linh thú đã được admin thêm tên. Ví dụ `Pikachu` có thể có build của Mod A và build của Mod B.
- Mỗi build hiển thị rõ **người build**.
- Có bảng **Danh sách mod** công khai để mọi người thấy avatar, tên trong game, quyền và số build của từng mod/admin.
- Có khu **Liên kết chính thức** hiển thị nổi bật ở màn hình đăng nhập, đầu trang và thanh bên: link tải game, TikTok, Facebook nhóm game.
- Admin có thể nhập/sửa `Tên trong game` trong phần **Quản lý tài khoản**.
- Mod/admin có thể tự đổi avatar. Ảnh sẽ được resize còn 128×128 và backend giới hạn dưới 40KB/avatar để web nhẹ kể cả khi có nhiều mod.
- Mật khẩu được giới hạn 6–32 ký tự. Lưu ý: database chỉ lưu hash bcrypt, nên giới hạn này chủ yếu để dễ quản lý và an toàn, không phải vì mật khẩu dài làm tốn nhiều dung lượng.
- Mỗi linh thú có tên, vai trò, hệ, tính cách, nội tại, 1–6 kỹ năng, ghi chú và 6 dòng chỉ số `HP / ATK / SATK / DEF / SDEF / SPE` tổng đúng 510 điểm.
- Nhập / xuất JSON để backup hoặc chuyển dữ liệu từ bản cũ.

## 1. Chạy thử trên máy

Cài Node.js 20+.

```bash
npm install
cp .env.example .env
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Trong file `.env`, cần điền:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pocket_champion?retryWrites=true&w=majority
JWT_SECRET=mot_chuoi_bi_mat_rat_dai_va_ngau_nhien
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123
ADMIN_DISPLAY_NAME=Admin
ADMIN_GAME_NAME=TenAdminTrongGame
```

## 2. Up lên GitHub

Upload toàn bộ file trong thư mục này lên repo GitHub. Không upload `node_modules`, không upload `.env`.

Cấu trúc đúng:

```txt
repo/
├── public/
├── src/
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 3. Tạo MongoDB Atlas

1. Vào MongoDB Atlas.
2. Tạo cluster miễn phí hoặc cluster phù hợp.
3. Tạo database user.
4. Network Access: cho phép Render kết nối. Khi mới test có thể dùng `0.0.0.0/0`, sau này nên siết lại nếu biết IP.
5. Lấy connection string dạng `mongodb+srv://...`.

## 4. Deploy trên Render

Render phải tạo **Web Service**, không phải Static Site.

Thông số gợi ý:

```txt
Service type: Web Service
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Environment variables trên Render:

```env
MONGO_URI=<connection string MongoDB Atlas>
JWT_SECRET=<chuoi bi mat dai>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<mat khau admin manh>
ADMIN_DISPLAY_NAME=Admin
ADMIN_GAME_NAME=<ten trong game cua admin, co the de trong>
```

Sau khi deploy xong, mở link Render và đăng nhập bằng tài khoản admin.

## 5. Cách dùng quyền mod/admin

- Tài khoản `user`: chỉ xem/search/copy build.
- Tài khoản `mod`: được thêm build mới, chỉ sửa build do chính tài khoản đó tạo, và tự đổi avatar của mình.
- Tài khoản `admin`: sửa/xóa được mọi build, tạo tài khoản, đổi quyền, reset mật khẩu, đặt `Tên trong game` cho mod, và tự đổi avatar của mình.

Nếu Mod A tạo build `Rồng Lửa`, Mod B vẫn có thể tạo build `Rồng Lửa` riêng. Khi người chơi search `Rồng Lửa`, danh sách sẽ hiện cả hai build kèm tên người build.

## 6. Chuyển dữ liệu từ bản cũ

Nếu bản cũ đã có dữ liệu trong trình duyệt:

1. Mở bản web cũ.
2. Bấm **Xuất dữ liệu** để tải file JSON.
3. Mở bản online.
4. Đăng nhập tài khoản `mod` hoặc `admin`.
5. Bấm **Nhập JSON**.

Khi nhập JSON, dữ liệu sẽ được gắn chủ sở hữu là tài khoản đang nhập. Nếu tài khoản đó đã có build trùng tên linh thú, hệ thống sẽ cập nhật build của chính tài khoản đó, không ghi đè build của mod khác.

## 7. Lưu ý về mật khẩu và avatar

Mật khẩu được lưu dạng hash bằng bcrypt, admin không xem được mật khẩu gốc của người dùng. Nếu bạn bè quên mật khẩu, admin dùng nút **Reset mật khẩu** để đặt mật khẩu mới. Mật khẩu hợp lệ dài từ 6 đến 32 ký tự.

Avatar chỉ dành cho mod/admin. Khi chọn ảnh, trình duyệt sẽ tự crop vuông, resize về 128×128 và nén thành JPG nhỏ. Server vẫn kiểm tra lại, chỉ nhận PNG/JPG/WebP hợp lệ và dung lượng sau nén tối đa 40KB.

## 8. Thêm link tải game / TikTok / Facebook nhóm

Mở file:

```txt
public/site-config.js
```

Sửa phần `url` của từng dòng. Ví dụ:

```js
window.POCKET_CHAMPION_LINKS = [
  {
    id: 'download',
    label: 'Tải game',
    url: 'https://link-tai-game-cua-ban.com',
    description: 'Link tải game POCKET CHAMPION',
    icon: '🎮'
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@tenkenhcuaban',
    description: 'Kênh TikTok của bạn',
    icon: '🎵'
  },
  {
    id: 'facebook',
    label: 'Nhóm Facebook',
    url: 'https://www.facebook.com/groups/nhomcuaban',
    description: 'Nhóm cộng đồng game',
    icon: '👥'
  }
];
```

Sau khi sửa xong, push lên GitHub. Render sẽ deploy lại và các nút link sẽ bấm được. Nếu `url` còn để trống, nút sẽ hiện mờ và chưa bấm được.



## Cập nhật v2.5

- Giao diện hiển thị song ngữ cho các mục quan trọng: Nội tại (Ability), Tính cách (Nature), Kỹ năng (Skills), Berry / Chỉ số 510 điểm, Ghi chú (Notes).
- Form build có cố định 6 ô Skill để mod/admin điền; ô chưa dùng có thể để trống.
- Khi bấm vào một bài build, trang chi tiết luôn hiện đủ 6 slot Skills cùng Ability, Nature, Berry và Notes.
- Copy build cũng dùng nhãn song ngữ để người chơi dễ hiểu hơn.
